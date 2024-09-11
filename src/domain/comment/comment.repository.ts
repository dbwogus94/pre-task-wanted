import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository, FindManyPagination } from '@app/common';
import { CommentEntity } from '@app/entity';
import { Comment, CommentEntityMapper } from './domain';

type FindManyOptions = {
  where?: { postId?: string; parentId?: string };
  pagination?: FindManyPagination;
};

type InsertCommentBody = Pick<
  Comment,
  'content' | 'authorName' | 'parentId' | 'postId'
>;

export abstract class CommentRepositoryPort extends BaseRepository<CommentEntity> {
  abstract findManyWithCount(
    options?: FindManyOptions,
  ): Promise<[Comment[], number]>;
  abstract findOneByPK(commentId: string): Promise<Comment>;

  abstract insertOne(body: InsertCommentBody): Promise<string>;
  abstract updateOneByProperty(
    commentId: string,
    properties: Partial<CommentEntity>,
  ): Promise<string>;
}

export class CommentRepository extends CommentRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(CommentEntity, manager);
  }

  async findManyWithCount(
    options: FindManyOptions = {},
  ): Promise<[Comment[], number]> {
    const { where, pagination } = options;
    const qb = this.createQueryBuilder('C');

    if (where?.postId)
      qb.andWhere('C.postId =:postId', { postId: where.postId });

    if (where?.parentId)
      qb.andWhere('C.parentId =:parentId', { parentId: where.parentId });

    if (pagination) qb.offset(pagination.offset).limit(pagination.limit);

    const [commentEntities, count] = await qb
      .orderBy('C.id', 'ASC')
      .getManyAndCount();

    return [CommentEntityMapper.toDomain(commentEntities), count];
  }

  async findOneByPK(commentId: string): Promise<Comment> {
    const commentEntity = await this.findOneBy({ id: commentId });
    return commentEntity ? CommentEntityMapper.toDomain(commentEntity) : null;
  }

  async insertOne(body: InsertCommentBody): Promise<string> {
    const { raw } = await this.insert({ ...body });
    return raw.insertId;
  }

  async updateOneByProperty(
    commentId: string,
    properties: Partial<CommentEntity>,
  ): Promise<string> {
    await this.update(commentId, { ...properties });
    return commentId;
  }
}
