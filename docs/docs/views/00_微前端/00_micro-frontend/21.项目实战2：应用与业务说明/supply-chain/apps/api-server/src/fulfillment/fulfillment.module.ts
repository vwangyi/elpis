import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SalesOrder } from '../orders/sales-order.entity'
import { SettlementBatch } from '../settlement/settlement-batch.entity'
import { SettlementItem } from '../settlement/settlement-item.entity'
import { FulfillmentController } from './fulfillment.controller'
import { FulfillmentException } from './fulfillment-exception.entity'
import { FulfillmentVerification } from './fulfillment-verification.entity'
import { Fulfillment } from './fulfillment.entity'
import { FulfillmentService } from './fulfillment.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesOrder,
      Fulfillment,
      FulfillmentException,
      FulfillmentVerification,
      SettlementBatch,
      SettlementItem,
    ]),
  ],
  controllers: [FulfillmentController],
  providers: [FulfillmentService],
  exports: [FulfillmentService],
})
export class FulfillmentModule {}
