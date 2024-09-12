import { UserKeywordAssociationEntity } from '@app/entity';
import { UserKeywordAssociation } from './keyword-association.domain';

export class UserKeywordAssociationEntityMapper {
  static toDomain(
    entity: UserKeywordAssociationEntity[],
  ): UserKeywordAssociation[];
  static toDomain(entity: UserKeywordAssociationEntity): UserKeywordAssociation;
  static toDomain(
    entity: UserKeywordAssociationEntity | UserKeywordAssociationEntity[],
  ): UserKeywordAssociation | UserKeywordAssociation[] {
    if (Array.isArray(entity)) {
      return entity.map((e) => this.toDomain(e));
    }

    return new UserKeywordAssociation({ ...entity }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
