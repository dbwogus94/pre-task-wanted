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

  /** FullText 검색으로 `content`에 `keyword`로 시작하는 단어를 가진 comments를 조회. */
  abstract findManyByKeyword(keyword: string): Promise<Comment[]>;
  /**
   * commentId를 가진 comment의 content`에 `keyword`로 시작하는 단어가 포함되는지 확인한다.
   * @param commentId
   * @param keyword
   */
  abstract isIncludeKeyword(
    commentId: string,
    keyword: string,
  ): Promise<boolean>;

  abstract insertOne(body: InsertCommentBody): Promise<string>;
  abstract updateOneByProperty(
    commentId: string,
    properties: Partial<CommentEntity>,
  ): Promise<string>;

  abstract softDeleteByPostIdWithChilds(postId: string): Promise<void>;
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

  async findManyByKeyword(keyword: string): Promise<Comment[]> {
    const qb = this.createQueryBuilder('C');

    // FullText 검색으로 `title`와 `content`에 `keyword`로 시작하는 단어가 있는지 조회한다.
    qb.where('MATCH(C.content) AGAINST (:keyword IN BOOLEAN MODE)', {
      keyword: keyword + '*',
    });

    // 최신 게시물 부터 검색한다.
    const commentEntity = await qb.orderBy('C.id', 'DESC').getMany();
    return CommentEntityMapper.toDomain(commentEntity);
  }

  async isIncludeKeyword(commentId: string, keyword: string): Promise<boolean> {
    const qb = this.createQueryBuilder('C');

    qb.where('C.id = :commentId', { commentId });
    // FullText 검색으로 `title`와 `content`에 `keyword`로 시작하는 단어가 있는지 조회한다.
    qb.andWhere('MATCH(C.content) AGAINST (:keyword IN BOOLEAN MODE)', {
      keyword: keyword + '*',
    });
    const count = await qb.getCount();
    return count !== 0 ? true : false;
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

  async softDeleteByPostIdWithChilds(postId: string): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('postId = :postId', { postId })
      .execute();
  }
}
