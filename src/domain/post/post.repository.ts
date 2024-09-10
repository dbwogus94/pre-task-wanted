import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { PostEntity } from '@app/entity';

export abstract class PostRepositoryPort extends BaseRepository<PostEntity> {}

@Injectable()
export class PostRepository extends PostRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(PostEntity, manager);
  }
}
