import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { SettlementItem } from './settlement-item.entity'
import { FulfillmentVerification } from '../fulfillment/fulfillment-verification.entity'

export enum SettlementStatus {
  Reconciling = 'reconciling',
  Difference = 'difference',
  Confirmed = 'confirmed',
  Invoiced = 'invoiced',
  Paid = 'paid',
}

@Entity({ name: 'settlement_batches' })
export class SettlementBatch {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'batch_no', length: 32, unique: true })
  batchNo!: string

  @Column({ name: 'partner_name', length: 120 })
  partnerName!: string

  @Column({ length: 20 })
  period!: string

  @Column({ name: 'payable_amount', type: 'decimal', precision: 14, scale: 2 })
  payableAmount!: string

  @Column({ name: 'difference_amount', type: 'decimal', precision: 14, scale: 2, default: 0 })
  differenceAmount!: string

  @Column({
    type: 'enum',
    enum: SettlementStatus,
    enumName: 'settlement_status_enum',
    default: SettlementStatus.Reconciling,
  })
  status!: SettlementStatus

  @Column({ name: 'invoice_no', type: 'varchar', length: 50, nullable: true })
  invoiceNo!: string | null

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt!: Date | null

  @OneToMany(() => SettlementItem, (item) => item.batch)
  items?: SettlementItem[]

  @OneToMany(() => FulfillmentVerification, (verification) => verification.settlementBatch)
  verifications?: FulfillmentVerification[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date
}
