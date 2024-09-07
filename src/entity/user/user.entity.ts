import { Column, Entity } from 'typeorm';

import { RestApiHideProperty, RestApiStringProperty } from '@app/common';
import { BaseEntity } from '../base.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  /**
   * 닉네임
   * - 000 + id,
   * - default 0000
   */
  @RestApiStringProperty({
    description: '닉네임',
    maxLength: 50,
    default: '0000',
  })
  @Column('varchar', { comment: '닉네임', length: 50, default: '0000' })
  nickname: string;

  /**
   * JWT 토큰
   * - defalt ''
   */
  @RestApiHideProperty()
  @Column('varchar', { comment: 'JWT 토큰', length: 300, default: '' })
  token: string;

  /**
   * 마지막 접속일
   * - mvp에서는 생성시 추가
   * - default now
   */
  @RestApiHideProperty()
  @Column('datetime', { comment: '마지막 접속일', default: () => 'NOW()' })
  accessedAt: Date;

  @RestApiHideProperty()
  @Column('boolean', { comment: '약관 동의', default: false })
  agreementTerms: true;
}
