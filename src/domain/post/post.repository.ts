import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository, FindManyPagination } from '@app/common';
import { PostEntity } from '@app/entity';
import { Post, PostEntityMapper } from './domain';

type FindManyOptions = {
  where?: Pick<PostEntity, 'title' | 'authorName'>;
  pagination?: FindManyPagination;
};

type InsertPostBody = Pick<
  PostEntity,
  'title' | 'content' | 'authorName' | 'password'
>;
type UpdatePostBody = Pick<PostEntity, 'title' | 'content' | 'authorName'>;

export abstract class PostRepositoryPort extends BaseRepository<PostEntity> {
  abstract findManyWithCount(
    options?: FindManyOptions,
  ): Promise<[Post[], number]>;
  abstract findOneByPK(postId: string): Promise<Post>;
  abstract insertOne(body: InsertPostBody): Promise<string>;
  abstract updateOne(postId: string, body: UpdatePostBody): Promise<string>;
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

  async findManyWithCount(
    options: FindManyOptions = {},
  ): Promise<[Post[], number]> {
    const { where, pagination } = options;
    const qb = this.createQueryBuilder('P');
    if (where.title)
      qb.andWhere('MATCH(P.title) AGAINST (:title IN BOOLEAN MODE)', {
        title: where.title + '*',
      });

    if (where.authorName)
      // Note: 작성자도 fulltext 사용하는 것도 방법이다.
      qb.andWhere('P.authorName LIKE :authorName', {
        authorName: `%${where.authorName}%`, // Index 사용 불가
      });

    if (pagination) qb.offset(pagination.offset).limit(pagination.limit);

    const [postEntities, count] = await qb
      .orderBy('P.id', 'DESC')
      .getManyAndCount();
    return [PostEntityMapper.toDomain(postEntities), count];
  }

  async findOneByPK(postId: string): Promise<Post> {
    const postEntity = await this.findOneBy({ id: postId });
    return postEntity ? PostEntityMapper.toDomain(postEntity) : null;
  }

  async insertOne(body: InsertPostBody): Promise<string> {
    const { raw } = await this.insert({ ...body });
    return raw.insertId;
  }

  async updateOne(postId: string, body: UpdatePostBody): Promise<string> {
    await this.update(postId, body);
    return postId;
  }

  async updateOneByProperty(
    postId: string,
    properties: Partial<PostEntity>,
  ): Promise<string> {
    await this.update(postId, { ...properties });
    return postId;
  }
}
