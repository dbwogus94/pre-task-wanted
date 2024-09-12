import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { BaseRepository, FindManyPagination } from '@app/common';
import { KeywordEntity, UserKeywordAssociationEntity } from '@app/entity';
import {
  Keyword,
  KeywordEntityMapper,
  UserKeywordAssociation,
  UserKeywordAssociationEntityMapper,
} from '../domain';

type FindManyOptions = {
  pagination?: FindManyPagination;
};

export abstract class KeywordRepositoryPort extends BaseRepository<KeywordEntity> {
  abstract findManyWithCount(
    options: FindManyOptions,
  ): Promise<[Keyword[], number]>;
  abstract findMany(options: FindManyOptions): Promise<Keyword[]>;

  /** keywordId 리스트를 사용해 N:M 매핑테이블인 UserKeywordAssociation를 조회한다. */
  abstract findManyKeywordAssociationByKeywordIds(
    keywordIds: string[],
  ): Promise<UserKeywordAssociation[]>;
}

export class KeywordRepository extends KeywordRepositoryPort {
  private readonly keywordAssociationRepo: Repository<UserKeywordAssociationEntity>;

  constructor(
    @InjectEntityManager()
    manager: EntityManager,
  ) {
    super(KeywordEntity, manager);
    this.keywordAssociationRepo = manager.getRepository(
      UserKeywordAssociationEntity,
    );
  }

  override async findManyWithCount(
    options: FindManyOptions,
  ): Promise<[Keyword[], number]> {
    const qb = this.#getFindManyQueryBuilder('K', options);
    const [keywordEntities, count] = await qb.getManyAndCount();
    return [KeywordEntityMapper.toDomain(keywordEntities), count];
  }

  override async findMany(options: FindManyOptions): Promise<Keyword[]> {
    const qb = this.#getFindManyQueryBuilder('K', options);
    const keywordEntities = await qb.getMany();
    return KeywordEntityMapper.toDomain(keywordEntities);
  }

  override async findManyKeywordAssociationByKeywordIds(
    keywordIds: string[],
  ): Promise<UserKeywordAssociation[]> {
    const entities = await this.keywordAssociationRepo.findBy({
      keywordId: In(keywordIds),
    });
    return UserKeywordAssociationEntityMapper.toDomain(entities);
  }

  #getFindManyQueryBuilder(alias: string, options: FindManyOptions) {
    const { pagination } = options;
    const qb = this.createQueryBuilder(alias);
    qb.orderBy(`${alias}.id`, 'ASC');
    if (pagination) qb.offset(pagination.offset).limit(pagination.limit);

    return qb;
  }
}
