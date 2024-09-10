import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { DomainTypeEntity, QueueStateEntity } from '../code';
import { UserKeywordEntity } from './user-keyword.entity';
import { DomainType, QueueState } from '../enum';

@Entity('notification_queue')
@Unique(['domainId', 'domainTypeCode'])
export class NotificationQueueEntity extends BaseEntity {
  @Column('bigint', { comment: 'domain(게시물, 댓글, 답글) id' })
  domainId: string;

  /* ============= 컬럼 연관관계 ============= */
  // 코드성 Entity는 컬럼 연관관계를 사용한다.
  @ManyToOne(() => DomainTypeEntity)
  @JoinColumn({ name: 'domainTypeCode' })
  domainTypeCode: DomainType;

  @ManyToOne(() => QueueStateEntity)
  @JoinColumn({ name: 'stateCode' })
  queueState: QueueState;

  /* ============= 컬럼 연관관계 ============= */
  @ManyToOne(() => UserKeywordEntity)
  @JoinColumn({ name: 'userKeywordId' })
  userKeyword: UserKeywordEntity;

  /* ============= 명시적 FK  ============= */
  // @Column('bigint', { comment: 'user_keyword id' })
  // userKeywordId: string;
}
