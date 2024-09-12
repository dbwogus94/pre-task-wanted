import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { OffsetPagination } from '@app/common';
import { DomainType, QueueState } from '@app/entity';
import { CommentRepositoryPort } from '../comment/comment.repository';
import { PostRepositoryPort } from '../post/post.repository';
import {
  CreateEventQueueRepositoryPort,
  KeywordRepositoryPort,
  NotificationQueueRepositoryPort,
} from './repository';

export abstract class KeywordServiceUseCase {
  abstract createKeywordNotifications(): Promise<void>;
}

@Injectable()
export class KeywordService extends KeywordServiceUseCase {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly createEventQueueRepo: CreateEventQueueRepositoryPort,
    private readonly notificationQueueRepo: NotificationQueueRepositoryPort,
    private readonly postRepo: PostRepositoryPort,
    private readonly commentRepo: CommentRepositoryPort,
    private readonly keywordRepo: KeywordRepositoryPort,
  ) {
    super();
  }

  /**
   * 생성된 게시글(댓글, 답글)을 기준으로 keyword 알림 만들기
   * @returns
   */
  override async createKeywordNotifications(): Promise<void> {
    const holdQueue = await this.createEventQueueRepo.findOneBy({
      stateCode: QueueState.HOLD,
    });
    if (!holdQueue) return;

    // 큐 상태를 '처리중'으로 변경
    await this.createEventQueueRepo.updateOne(
      holdQueue.id,
      QueueState.PROGRESS,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const txCreateEventQueueRepo =
        this.createEventQueueRepo.createTransactionRepo(manager);
      const txNotificationQueueRepo =
        this.notificationQueueRepo.createTransactionRepo(manager);
      const txPostRepo = this.postRepo.createTransactionRepo(manager);
      const txCommentRepo = this.commentRepo.createTransactionRepo(manager);
      const txKeywordRepo = this.keywordRepo.createTransactionRepo(manager);

      // 1. 키워드 N개씩 조회
      // TODO: 키워드 로직 페이징 적용 필요
      const pagination = OffsetPagination.of({ page: 1, pageSize: 1000 });
      const keywords = await txKeywordRepo.findMany({
        pagination: { limit: pagination.limit, offset: pagination.offset },
      });

      // 2. 큐의 값을 토대로 post나 comment에 포함되는 keyword 찾기
      const { domainId, domainTypeCode } = holdQueue;
      // Note: 트랜잭션인 경우 하나의 커넥션을 사용하기 때문에 병렬 처리는 되지 않는다.
      const keywordIdAndIncludeList = await Promise.all(
        keywords.map(async ({ id, name: keywordName }) => {
          const isInclude =
            domainTypeCode === DomainType.POST
              ? await txPostRepo.isIncludeKeyword(domainId, keywordName)
              : await txCommentRepo.isIncludeKeyword(domainId, keywordName);
          return { keywordId: id, isInclude };
        }),
      );
      const includeKeywords = keywordIdAndIncludeList.filter(
        ({ isInclude }) => isInclude,
      );

      // 키워드가 포함된 게시물(댓글, 답글)이 있다면?
      if (includeKeywords.length > 0) {
        const keywordIds = includeKeywords.map((i) => i.keywordId);
        // 3. 키워드와 매핑된 등록 키워드 조회
        const keywordAssociations =
          await txKeywordRepo.findManyKeywordAssociationByKeywordIds(
            keywordIds,
          );

        // 4. notificationQueue에 알림 생성
        const notificationQueueRecords = keywordAssociations.map(
          ({ userKeywordId }) => ({ domainId, domainTypeCode, userKeywordId }),
        );
        await txNotificationQueueRepo.insertMany(notificationQueueRecords);
      }

      // 5. 큐 상태를 '성공'으로 변경
      await txCreateEventQueueRepo.updateOne(holdQueue.id, QueueState.SUCCESS);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // 큐 상태를 '실패'으로 변경
      await this.createEventQueueRepo.updateOne(holdQueue.id, QueueState.FAIL);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
