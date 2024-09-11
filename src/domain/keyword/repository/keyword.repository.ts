import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { KeywordEntity } from '@app/entity';

export abstract class KeywordRepositoryPort extends BaseRepository<KeywordEntity> {}

export class KeywordRepository extends KeywordRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(KeywordEntity, manager);
  }
}
