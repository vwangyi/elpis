import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SalesOrder } from './sales-order.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SalesOrder])],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
