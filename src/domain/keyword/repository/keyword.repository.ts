import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { BaseRepository, FindManyPagination } from '@app/common';
import { KeywordEntity } from '@app/entity';
import { Keyword, KeywordEntityMapper } from '../domain';

type FindManyOptions = {
  pagination?: FindManyPagination;
};

export abstract class KeywordRepositoryPort extends BaseRepository<KeywordEntity> {
  abstract findManyWithCount(
    options: FindManyOptions,
  ): Promise<[Keyword[], number]>;
  abstract findMany(options: FindManyOptions): Promise<Keyword[]>;
}

export class KeywordRepository extends KeywordRepositoryPort {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(KeywordEntity, manager);
  }

  async findManyWithCount(
    options: FindManyOptions,
  ): Promise<[Keyword[], number]> {
    const qb = this.#getFindManyQueryBuilder('K', options);
    const [keywordEntities, count] = await qb.getManyAndCount();
    return [KeywordEntityMapper.toDomain(keywordEntities), count];
  }

  async findMany(options: FindManyOptions): Promise<Keyword[]> {
    const qb = this.#getFindManyQueryBuilder('K', options);
    const keywordEntities = await qb.getMany();
    return KeywordEntityMapper.toDomain(keywordEntities);
  }

  #getFindManyQueryBuilder(alias: string, options: FindManyOptions) {
    const { pagination } = options;
    const qb = this.createQueryBuilder(alias);
    qb.orderBy(`${alias}.id`, 'ASC');
    if (pagination) qb.offset(pagination.offset).limit(pagination.limit);

    return qb;
  }
}
