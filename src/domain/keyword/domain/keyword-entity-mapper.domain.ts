import { KeywordEntity } from '@app/entity';
import { Keyword } from './keyword.domain';

export class KeywordEntityMapper {
  static toDomain(entity: KeywordEntity[]): Keyword[];
  static toDomain(entity: KeywordEntity): Keyword;
  static toDomain(
    entity: KeywordEntity | KeywordEntity[],
  ): Keyword | Keyword[] {
    if (Array.isArray(entity)) {
      return entity.map((e) => this.toDomain(e));
    }

    return new Keyword({ ...entity }) //
      .setBase(entity.id, entity.createdAt, entity.updatedAt);
  }
}
