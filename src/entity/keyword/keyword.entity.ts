import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { UserKeywordAssociationEntity } from './user-keyword-association.entity';

@Entity('keyword')
export class KeywordEntity extends BaseEntity {
  @Column('varchar', { length: 100, comment: '키워드 명', unique: true })
  name: string;

  /* ============= 연관관계 ============= */
  @OneToMany(
    () => UserKeywordAssociationEntity,
    (association) => association.keyword,
  )
  userKeywordAssociations: UserKeywordAssociationEntity[];
}
