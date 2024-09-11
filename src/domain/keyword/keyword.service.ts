import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { CustomLoggerService } from '@app/custom';
import { QueueState } from '@app/entity';
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
    private readonly logger: CustomLoggerService,
    private readonly createEventQueueRepo: CreateEventQueueRepositoryPort,
    private readonly notificationQueueRepo: NotificationQueueRepositoryPort,
    private readonly postRepo: PostRepositoryPort,
    private readonly commentRepo: CommentRepositoryPort,
    private readonly keywordRepo: KeywordRepositoryPort,
  ) {
    super();
    this.logger.setTarget(this.constructor.name);
  }

  /**
   * 생성된 게시글(댓글, 답글)을 기준으로 keyword 알림 만들기
   * @returns
   */
  override async createKeywordNotifications(): Promise<void> {
    const holdCreateEventQueue = await this.createEventQueueRepo.findOneByState(
      QueueState.HOLD,
    );

    if (!holdCreateEventQueue) {
      return;
    }

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

      // 1. 상태를 처리중으로 변경

      // 2. 키워드 N개씩 조회

      // 3. 조회된 키워드를 사용해 게시물 or 댓글 or 답글 FULLTAXT 조회
      // - createEventQueue의 정보로 검색 대상 선정
      // findOneKeywords

      // 4. 존재하는 키워드와 매핑된 등록 키워드 조회

      // 5. notificationQueue에 알림 생성

      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.createEventQueueRepo.updateOne(
        holdCreateEventQueue.id,
        QueueState.FAIL,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
