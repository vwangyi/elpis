import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SalesOrder } from '../orders/sales-order.entity'
import { FulfillmentException } from './fulfillment-exception.entity'

export enum FulfillmentStatus {
  PendingReview = 'pending_review',
  ReadyToShip = 'ready_to_ship',
  InTransit = 'in_transit',
  PartiallyReceived = 'partially_received',
  Completed = 'completed',
  Exception = 'exception',
}

@Entity({ name: 'fulfillments' })
export class Fulfillment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'sales_order_id', type: 'uuid', unique: true })
  salesOrderId!: string

  @OneToOne(() => SalesOrder, (salesOrder) => salesOrder.fulfillment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder!: SalesOrder

  @Column({ length: 100 })
  warehouse!: string

  @Column({ type: 'varchar', length: 80, nullable: true })
  carrier!: string | null

  @Column({ name: 'tracking_no', type: 'varchar', length: 64, nullable: true })
  trackingNo!: string | null

  @Column({ name: 'total_quantity', type: 'int' })
  totalQuantity!: number

  @Column({ name: 'shipped_quantity', type: 'int', default: 0 })
  shippedQuantity!: number

  @Column({ name: 'received_quantity', type: 'int', default: 0 })
  receivedQuantity!: number

  @Column({
    type: 'enum',
    enum: FulfillmentStatus,
    enumName: 'fulfillment_status_enum',
    default: FulfillmentStatus.PendingReview,
  })
  status!: FulfillmentStatus

  @Column({ name: 'shipped_at', type: 'timestamptz', nullable: true })
  shippedAt!: Date | null

  @Column({ name: 'signed_at', type: 'timestamptz', nullable: true })
  signedAt!: Date | null

  @OneToMany(() => FulfillmentException, (exception) => exception.fulfillment)
  exceptions?: FulfillmentException[]
}
