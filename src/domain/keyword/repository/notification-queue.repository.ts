import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { NotificationQueueEntity, QueueState } from '@app/entity';

type InsertBody = Pick<
  NotificationQueueEntity,
  'domainTypeCode' | 'domainId' | 'userKeywordId'
>;

export abstract class NotificationQueueRepositoryPort extends BaseRepository<NotificationQueueEntity> {
  abstract insertOne(body: InsertBody): Promise<string>;
  abstract insertMany(body: InsertBody[]): Promise<string[]>;
  abstract updateOne(queueId: string, state: QueueState): Promise<string>;
}

export class NotificationQueueRepository extends NotificationQueueRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(NotificationQueueEntity, manager);
  }

  override async insertOne(body: InsertBody): Promise<string> {
    const { raw } = await this.insert({ ...body, stateCode: QueueState.HOLD });
    return raw.insertId;
  }

  override async insertMany(body: InsertBody[]): Promise<string[]> {
    const dataList = body.map((i) => ({ ...i, stateCode: QueueState.HOLD }));
    const { raw } = await this.insert(dataList);
    return raw.insertId;
  }

  override async updateOne(
    queueId: string,
    state: QueueState,
  ): Promise<string> {
    await this.update(queueId, { stateCode: state });
    return queueId;
  }
}
