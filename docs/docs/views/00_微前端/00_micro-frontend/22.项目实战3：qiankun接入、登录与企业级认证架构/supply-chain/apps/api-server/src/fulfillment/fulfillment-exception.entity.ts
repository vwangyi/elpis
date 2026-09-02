import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Fulfillment } from './fulfillment.entity'

export enum ExceptionStatus {
  Open = 'open',
  Processing = 'processing',
  Resolved = 'resolved',
}

@Entity({ name: 'fulfillment_exceptions' })
export class FulfillmentException {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'fulfillment_id', type: 'uuid' })
  fulfillmentId!: string

  @ManyToOne(() => Fulfillment, (fulfillment) => fulfillment.exceptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fulfillment_id' })
  fulfillment!: Fulfillment

  @Column({ name: 'exception_type', length: 50 })
  exceptionType!: string

  @Column({ length: 300 })
  description!: string

  @Column({ length: 80 })
  owner!: string

  @Column({
    type: 'enum',
    enum: ExceptionStatus,
    enumName: 'fulfillment_exception_status_enum',
    default: ExceptionStatus.Open,
  })
  status!: ExceptionStatus

  @Column({ name: 'deadline_at', type: 'timestamptz' })
  deadlineAt!: Date

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date
}
