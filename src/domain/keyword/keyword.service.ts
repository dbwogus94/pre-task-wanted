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
  /**
   * CreateKeywordQueue를 사용해서 키워드 알림을 만든다.
   * 1. Hold(대기) 상태의 큐(CreateEventQueue) 조회
   * 2. 조회된 큐(CreateEventQueue)의 상태를 Progress(진행중)으로 변경
   * 3. (트랜잭션 시작) 키워드 N개씩 조회
   * 4. 큐의 값을 토대로 post나 comment에 포함되는 keyword 찾기
   * 5. (일치하는 keyword가 있다면?) 키워드와 매핑된 등록 키워드 조회
   * 6. NotificationQueue에 알림 생성
   * 7. (트랜잭션 종료) 큐 상태를 Success(성공)으로 변경
   * 8. (트랜잭션 실패) 큐 상태를 Fail(실패)로 변경
   */
  abstract createKeywordNotifications(): Promise<void>;

  /**
   * NotificationQueue를 사용해 알림을 전송한다.
   * - TODO: 현재는 1개의 알림을 전송, 알림 전송 개수 조절 필요
   */
  abstract sendNotification(): Promise<void>;
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

  override async sendNotification(): Promise<void> {
    const holdQueue = await this.notificationQueueRepo.findOneBy({
      stateCode: QueueState.HOLD,
    });
    if (!holdQueue) return;

    // 큐 상태를 '처리중'으로 변경
    await this.notificationQueueRepo.updateOne(
      holdQueue.id,
      QueueState.PROGRESS,
    );

    try {
      // 알림 전송
      console.log('[알림 전송] - ', holdQueue);

      // 5. 큐 상태를 '성공'으로 변경
      await this.notificationQueueRepo.updateOne(
        holdQueue.id,
        QueueState.SUCCESS,
      );
    } catch (error) {
      // 큐 상태를 '실패'으로 변경
      await this.notificationQueueRepo.updateOne(holdQueue.id, QueueState.FAIL);
      throw error;
    }
  }
}
