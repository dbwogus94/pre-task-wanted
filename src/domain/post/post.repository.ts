import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository, FindManyPagination } from '@app/common';
import { PostEntity } from '@app/entity';
import { Post, PostEntityMapper } from './domain';

type FindManyOptions = {
  where?: Pick<Partial<PostEntity>, 'title' | 'authorName'>;
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

  /** FullText 검색으로 `title`와 `content`에 `keyword`로 시작하는 posts를 조회 */
  abstract findManyByKeyword(keyword: string): Promise<Post[]>;
  /**
   * postId를 가진 post에 `title`와 `content`에 `keyword`로 시작하는 단어가 포함되는지 확인한다.
   * @param postId
   * @param keyword
   */
  abstract isIncludeKeyword(postId: string, keyword: string): Promise<boolean>;

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
    if (where?.title)
      qb.andWhere('MATCH(P.title) AGAINST (:title IN BOOLEAN MODE)', {
        title: where.title + '*',
      });

    if (where?.authorName)
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

  async findManyByKeyword(keyword: string): Promise<Post[]> {
    const qb = this.createQueryBuilder('P');

    // FullText 검색으로 `title`와 `content`에 `keyword`로 시작하는 단어가 있는지 조회한다.
    qb.where('MATCH(P.title, P.content) AGAINST (:keyword IN BOOLEAN MODE)', {
      keyword: keyword + '*',
    });

    // 최신 게시물 부터 검색한다.
    const postEntities = await qb.orderBy('P.id', 'DESC').getMany();
    return PostEntityMapper.toDomain(postEntities);
  }

  async isIncludeKeyword(postId: string, keyword: string): Promise<boolean> {
    const qb = this.createQueryBuilder('P');

    qb.where('P.id = :postId', { postId });
    // FullText 검색으로 `title`와 `content`에 `keyword`로 시작하는 단어가 있는지 조회한다.
    qb.andWhere(
      'MATCH(P.title, P.content) AGAINST (:keyword IN BOOLEAN MODE)',
      { keyword: keyword + '*' },
    );
    const count = await qb.getCount();
    return count !== 0 ? true : false;
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
