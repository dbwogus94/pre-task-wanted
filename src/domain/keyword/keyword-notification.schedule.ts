import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

import { CustomLoggerService } from '@app/custom';
import { KeywordServiceUseCase } from './keyword.service';

@Injectable()
export class KeywordNotificationSchedule {
  /** 1분 마다 실행 */
  static readonly CON_TIME = '0 */1 * * * *';
  static readonly JOB_NAME = 'CreateNotificationsByHold';

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly keywordService: KeywordServiceUseCase,
  ) {
    this.logger.setTarget(this.constructor.name);
  }

  @Cron(KeywordNotificationSchedule.CON_TIME, {
    name: KeywordNotificationSchedule.JOB_NAME,
  })
  async createNotificationsByHold() {
    this.logger.debug(`[${KeywordNotificationSchedule.JOB_NAME}] start`);

    const job = this.schedulerRegistry.getCronJob(
      KeywordNotificationSchedule.JOB_NAME,
    );
    job.stop();
    await this.keywordService.createKeywordNotifications();
    try {
    } catch (error) {
      this.logger.error(error as Error);
    }
    this.logger.debug(`[${KeywordNotificationSchedule.JOB_NAME}] end`);

    job.start();
  }

  // 알림 생성 실패 재시도 처리

  // 알림 보내기

  // 알림 실패 재시도
}
