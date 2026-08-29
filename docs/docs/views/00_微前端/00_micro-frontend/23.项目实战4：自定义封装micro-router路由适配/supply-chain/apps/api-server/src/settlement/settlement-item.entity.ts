import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SalesOrder } from '../orders/sales-order.entity'
import { SettlementBatch } from './settlement-batch.entity'

@Entity({ name: 'settlement_items' })
@Index('uq_settlement_items_sales_order', ['salesOrderId'], { unique: true })
export class SettlementItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'batch_id', type: 'uuid' })
  batchId!: string

  @ManyToOne(() => SettlementBatch, (batch) => batch.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch!: SettlementBatch

  @Column({ name: 'sales_order_id', type: 'uuid' })
  salesOrderId!: string

  @ManyToOne(() => SalesOrder)
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder!: SalesOrder

  @Column({ name: 'order_amount', type: 'decimal', precision: 14, scale: 2 })
  orderAmount!: string

  @Column({ name: 'delivery_amount', type: 'decimal', precision: 14, scale: 2 })
  deliveryAmount!: string

  @Column({ name: 'invoice_amount', type: 'decimal', precision: 14, scale: 2 })
  invoiceAmount!: string

  @Column({ name: 'difference_reason', type: 'varchar', length: 200, nullable: true })
  differenceReason!: string | null
}
