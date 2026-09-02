import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FulfillmentException } from '../fulfillment/fulfillment-exception.entity'
import { Fulfillment } from '../fulfillment/fulfillment.entity'
import { SalesOrder } from '../orders/sales-order.entity'
import { SettlementBatch } from '../settlement/settlement-batch.entity'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesOrder, Fulfillment, FulfillmentException, SettlementBatch]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
