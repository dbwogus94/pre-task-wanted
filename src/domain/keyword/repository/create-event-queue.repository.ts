import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { CreateEventQueueEntity, QueueState } from '@app/entity';

type InsertBody = Pick<CreateEventQueueEntity, 'domainTypeCode' | 'domainId'>;

export abstract class CreateEventQueueRepositoryPort extends BaseRepository<CreateEventQueueEntity> {
  abstract insertOne(body: InsertBody): Promise<string>;
}

export class CreateEventQueueRepository extends CreateEventQueueRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(CreateEventQueueEntity, manager);
  }

  override async insertOne(body: InsertBody): Promise<string> {
    const { raw } = await this.insert({ ...body, queueState: QueueState.HOLD });
    return raw.insertId;
  }
}
