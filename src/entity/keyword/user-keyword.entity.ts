import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { UserKeywordAssociationEntity } from './user-keyword-association.entity';

@Entity('user_keyword')
export class UserKeywordEntity extends BaseEntity {
  @Column('varchar', { length: 100, comment: '키워드 등록자', unique: true })
  authorName: string;

  /* ============= 연관관계 ============= */
  @OneToMany(
    () => UserKeywordAssociationEntity,
    (association) => association.userKeyword,
  )
  userKeywordAssociations: UserKeywordAssociationEntity[];
}
