import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { DomainTypeEntity, QueueStateEntity } from '../code';
import { DomainType, QueueState } from '../enum';

@Entity('notification_queue')
export class NotificationQueueEntity extends BaseEntity {
  @Column('bigint', { comment: 'domain(게시물, 댓글, 답글) id' })
  domainId: string;

  @Column('bigint', { comment: 'user_keyword id, FK 사용 x', default: 0 })
  userKeywordId: string;

  /* ============= 연관관계 ============= */
  @ManyToOne(() => DomainTypeEntity)
  @JoinColumn({ name: 'domainTypeCode', referencedColumnName: 'code' })
  domainType: DomainTypeEntity;

  @ManyToOne(() => QueueStateEntity)
  @JoinColumn({ name: 'stateCode', referencedColumnName: 'code' })
  queueState: QueueStateEntity;

  /* ============= 명시적 FK ============= */
  @Column('varchar', { length: 100 })
  domainTypeCode: DomainType;

  @Column('varchar', { length: 100 })
  stateCode: QueueState;
}
