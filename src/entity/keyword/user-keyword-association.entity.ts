import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { UserKeywordEntity } from './user-keyword.entity';
import { KeywordEntity } from './keyword.entity';

@Entity('user_keyword_association')
export class UserKeywordAssociationEntity extends BaseEntity {
  @Column('bigint', { comment: 'user_keyword id' })
  userKeywordId: string;

  @Column('bigint', { comment: 'keyword id' })
  keywordId: string;

  /* ============= 연관관계 ============= */
  @ManyToOne(
    () => UserKeywordEntity,
    (userKeyword) => userKeyword.userKeywordAssociations,
  )
  @JoinColumn({ name: 'userKeywordId' })
  userKeyword: UserKeywordEntity;

  @ManyToOne(() => KeywordEntity, (keyword) => keyword.userKeywordAssociations)
  @JoinColumn({ name: 'keywordId' })
  keyword: KeywordEntity;
}
