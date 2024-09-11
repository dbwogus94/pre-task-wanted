import { BaseRepository } from '@app/common';
import { CommentEntity } from '@app/entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

export abstract class CommentRepositoryPort extends BaseRepository<CommentEntity> {}

export class CommentRepository extends CommentRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(CommentEntity, manager);
  }
}
