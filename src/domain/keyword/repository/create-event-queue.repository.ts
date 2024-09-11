import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { CreateEventQueueEntity, QueueState } from '@app/entity';

type InsertBody = Pick<CreateEventQueueEntity, 'domainTypeCode' | 'domainId'>;

export abstract class CreateEventQueueRepositoryPort extends BaseRepository<CreateEventQueueEntity> {
  abstract findOneByState(state: QueueState): Promise<CreateEventQueueEntity>;
  abstract updateOne(
    queueId: string,
    state: QueueState,
  ): Promise<CreateEventQueueEntity>;
  abstract insertOne(body: InsertBody): Promise<string>;
}

export class CreateEventQueueRepository extends CreateEventQueueRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(CreateEventQueueEntity, manager);
  }

  override async findOneByState(
    state: QueueState,
  ): Promise<CreateEventQueueEntity> {
    // const result = await this.findOneBy({ queueState: state });
    // return result;
    throw new Error('Method not implemented.');
  }

  override async insertOne(body: InsertBody): Promise<string> {
    const { raw } = await this.insert({ ...body, queueState: QueueState.HOLD });
    return raw.insertId;
  }

  override async updateOne(
    queueId: string,
    state: QueueState,
  ): Promise<CreateEventQueueEntity> {
    throw new Error('Method not implemented.');
  }
}
