import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FulfillmentVerification } from '../fulfillment/fulfillment-verification.entity'
import { SettlementBatch } from './settlement-batch.entity'
import { SettlementController } from './settlement.controller'
import { SettlementItem } from './settlement-item.entity'
import { SettlementService } from './settlement.service'

@Module({
  imports: [TypeOrmModule.forFeature([SettlementBatch, SettlementItem, FulfillmentVerification])],
  controllers: [SettlementController],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}
