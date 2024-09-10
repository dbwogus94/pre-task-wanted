import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', comment: 'ID' })
  readonly id: string;

  @CreateDateColumn({ type: 'datetime', comment: '생성일' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', comment: '삭제일' })
  deletedAt?: Date | null;
}
