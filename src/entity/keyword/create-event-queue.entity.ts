import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '../base.entity';
import { DomainTypeEntity, QueueStateEntity } from '../code';
import { DomainType, QueueState } from '../enum';

@Entity('create_event_queue')
@Unique(['domainId', 'domainTypeCode'])
export class CreateEventQueueEntity extends BaseEntity {
  @Column('bigint', { comment: 'domain(게시물, 댓글, 대댓글) id' })
  domainId: string;

  /* ============= 컬럼 연관관계 ============= */
  // 코드성 Entity는 컬럼 연관관계를 사용한다.
  @ManyToOne(() => DomainTypeEntity)
  @JoinColumn({ name: 'domainTypeCode' })
  domainTypeCode: DomainType;

  @ManyToOne(() => QueueStateEntity)
  @JoinColumn({ name: 'stateCode' })
  queueState: QueueState;
}
