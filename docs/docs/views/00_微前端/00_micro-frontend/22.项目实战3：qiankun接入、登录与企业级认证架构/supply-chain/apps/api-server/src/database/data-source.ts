import 'reflect-metadata'
import 'dotenv/config'

import { DataSource } from 'typeorm'

import { Organization } from '../organizations/organization.entity'
import { FulfillmentException } from '../fulfillment/fulfillment-exception.entity'
import { Fulfillment } from '../fulfillment/fulfillment.entity'
import { FulfillmentVerification } from '../fulfillment/fulfillment-verification.entity'
import { SalesOrder } from '../orders/sales-order.entity'
import { SettlementBatch } from '../settlement/settlement-batch.entity'
import { SettlementItem } from '../settlement/settlement-item.entity'
import { User } from '../users/user.entity'

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'supply_chain',
  password: process.env.DATABASE_PASSWORD ?? 'supply_chain_dev',
  database: process.env.DATABASE_NAME ?? 'supply_chain',
  entities: [
    Organization,
    User,
    SalesOrder,
    Fulfillment,
    FulfillmentException,
    FulfillmentVerification,
    SettlementBatch,
    SettlementItem,
  ],
  synchronize: true,
})
