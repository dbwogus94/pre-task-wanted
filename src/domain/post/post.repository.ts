import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository } from '@app/common';
import { PostEntity } from '@app/entity';
import { Post, PostEntityMapper } from './domain';

type InsertPostBody = Pick<
  PostEntity,
  'title' | 'content' | 'authorName' | 'password'
>;

export abstract class PostRepositoryPort extends BaseRepository<PostEntity> {
  abstract findOneByPK(postId: string): Promise<Post>;
  abstract insertOne(body: InsertPostBody): Promise<string>;
  abstract updateOneByProperty(
    postId: string,
    properties: Partial<PostEntity>,
  ): Promise<string>;
}

@Injectable()
export class PostRepository extends PostRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(PostEntity, manager);
  }

  async findOneByPK(postId: string): Promise<Post> {
    const postEntity = await this.findOneBy({ id: postId });
    return PostEntityMapper.toDomain(postEntity);
  }

  async insertOne(body: InsertPostBody): Promise<string> {
    const { raw } = await this.insert({ ...body });
    return raw.insertId;
  }

  async updateOneByProperty(
    postId: string,
    properties: Partial<PostEntity>,
  ): Promise<string> {
    await this.update(postId, { ...properties });
    return postId;
  }
}
