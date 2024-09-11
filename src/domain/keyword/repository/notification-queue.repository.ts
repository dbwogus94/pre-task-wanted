import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { NotificationQueueEntity } from '@app/entity';

export abstract class NotificationQueueRepositoryPort extends BaseRepository<NotificationQueueEntity> {}

export class NotificationQueueRepository extends NotificationQueueRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(NotificationQueueEntity, manager);
  }
}
