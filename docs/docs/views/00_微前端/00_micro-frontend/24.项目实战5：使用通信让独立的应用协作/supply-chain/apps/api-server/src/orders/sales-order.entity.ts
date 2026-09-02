import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Fulfillment } from '../fulfillment/fulfillment.entity'

export enum SalesOrderStatus {
  PendingReview = 'pending_review',
  ReadyToShip = 'ready_to_ship',
  InTransit = 'in_transit',
  PartiallyReceived = 'partially_received',
  Completed = 'completed',
  Exception = 'exception',
}

@Entity({ name: 'sales_orders' })
export class SalesOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'order_no', length: 32, unique: true })
  orderNo!: string

  @Column({ name: 'customer_name', length: 120 })
  customerName!: string

  @Column({ name: 'business_unit', length: 100 })
  businessUnit!: string

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount!: string

  @Column({ name: 'item_count', type: 'int' })
  itemCount!: number

  @Column({ name: 'order_date', type: 'date' })
  orderDate!: string

  @Column({ name: 'promised_date', type: 'date' })
  promisedDate!: string

  @Column({
    type: 'enum',
    enum: SalesOrderStatus,
    enumName: 'sales_order_status_enum',
    default: SalesOrderStatus.PendingReview,
  })
  status!: SalesOrderStatus

  @OneToOne(() => Fulfillment, (fulfillment) => fulfillment.salesOrder)
  fulfillment?: Fulfillment

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date
}
