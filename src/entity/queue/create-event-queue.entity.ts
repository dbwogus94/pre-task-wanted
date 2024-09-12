import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { DomainTypeEntity, QueueStateEntity } from '../code';
import { DomainType, QueueState } from '../enum';

@Entity('create_event_queue')
@Unique(['domainId', 'domainTypeCode'])
export class CreateEventQueueEntity extends BaseEntity {
  @Column('bigint', { comment: 'domain(게시물, 댓글, 답글) id' })
  domainId: string;

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
