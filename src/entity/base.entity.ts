import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty({ description: '엔티티 uid', type: String })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  readonly uid: string;

  @ApiProperty({ description: '엔티티 id', type: Number })
  @Expose()
  @Column('int', { generated: 'increment', unique: true })
  readonly id: number;

  @ApiProperty({ description: '생성일', type: Date })
  @Expose()
  @CreateDateColumn({ type: 'datetime' })
  readonly createdAt: Date;

  @ApiProperty({ description: '수정일', type: Date })
  @Expose()
  @UpdateDateColumn({ type: 'datetime' })
  readonly updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
}
