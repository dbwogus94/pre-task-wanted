import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';

import { CustomLoggerService } from '@app/custom';
import { KeywordServiceUseCase } from './keyword.service';

@Injectable()
export class KeywordNotificationSchedule {
  /** 1분 마다 실행 */
  static readonly CON_TIME = '0 */1 * * * *';
  static readonly JobNames = {
    CREATE_NOTIFICATIONS: 'CreateNotificationsByHold',
    SEND_NOTIFICATION: 'SendNotificationsByHold',
  };

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly keywordService: KeywordServiceUseCase,
  ) {
    this.logger.setTarget(this.constructor.name);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: KeywordNotificationSchedule.JobNames.CREATE_NOTIFICATIONS,
  })
  async createNotifications() {
    const jobName = KeywordNotificationSchedule.JobNames.CREATE_NOTIFICATIONS;
    this.logger.debug(`[${jobName}] start`);

    const job = this.schedulerRegistry.getCronJob(jobName);
    job.stop();

    try {
      // 키워드 알림 생성
      await this.keywordService.createKeywordNotifications();
    } catch (error) {
      this.logger.error(error as Error);
    } finally {
      this.logger.debug(`[${jobName}] end`);
      job.start();
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: KeywordNotificationSchedule.JobNames.SEND_NOTIFICATION,
  })
  async sendNotification() {
    const jobName = KeywordNotificationSchedule.JobNames.SEND_NOTIFICATION;
    this.logger.debug(`[${jobName}] start`);

    const job = this.schedulerRegistry.getCronJob(jobName);
    job.stop();

    try {
      // 키워드 알림 전송
      await this.keywordService.sendNotification();
    } catch (error) {
      this.logger.error(error as Error);
    } finally {
      this.logger.debug(`[${jobName}] end`);
      job.start();
    }
  }
}
