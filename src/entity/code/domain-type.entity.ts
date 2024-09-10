import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('domain_type')
export class DomainTypeEntity {
  @PrimaryColumn('varchar', { length: 100, comment: '코드' })
  code: string;

  @CreateDateColumn({ type: 'datetime', comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', comment: '삭제일' })
  deletedAt?: Date | null;

  @Column('varchar', { length: 100, comment: '코드명' })
  name: string;
}
