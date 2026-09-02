import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { SalesOrder } from '../orders/sales-order.entity'
import { SettlementBatch } from '../settlement/settlement-batch.entity'
import { Fulfillment } from './fulfillment.entity'

export enum VerificationStatus {
  Pending = 'pending',
  Processing = 'processing',
  Resolved = 'resolved',
}

@Entity({ name: 'fulfillment_verifications' })
@Index('idx_fulfillment_verifications_batch_status', ['settlementBatchId', 'status'])
export class FulfillmentVerification {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'settlement_batch_id', type: 'uuid' })
  settlementBatchId!: string

  @ManyToOne(() => SettlementBatch, (batch) => batch.verifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'settlement_batch_id' })
  settlementBatch!: SettlementBatch

  @Column({ name: 'sales_order_id', type: 'uuid' })
  salesOrderId!: string

  @ManyToOne(() => SalesOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder!: SalesOrder

  @Column({ name: 'fulfillment_id', type: 'uuid' })
  fulfillmentId!: string

  @ManyToOne(() => Fulfillment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fulfillment_id' })
  fulfillment!: Fulfillment

  @Column({ name: 'difference_amount', type: 'decimal', precision: 14, scale: 2 })
  differenceAmount!: string

  @Column({ name: 'difference_reason', type: 'varchar', length: 200 })
  differenceReason!: string

  @Column({ length: 60, default: '待分配' })
  owner!: string

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    enumName: 'fulfillment_verification_status_enum',
    default: VerificationStatus.Pending,
  })
  status!: VerificationStatus

  @Column({
    name: 'verified_delivery_amount',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  verifiedDeliveryAmount!: string | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  resolution!: string | null

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt!: Date | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date
}
