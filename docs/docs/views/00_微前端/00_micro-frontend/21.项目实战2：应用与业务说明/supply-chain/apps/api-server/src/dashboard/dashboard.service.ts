import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ExceptionStatus, FulfillmentException } from '../fulfillment/fulfillment-exception.entity'
import { Fulfillment, FulfillmentStatus } from '../fulfillment/fulfillment.entity'
import { SalesOrder } from '../orders/sales-order.entity'
import { SettlementBatch, SettlementStatus } from '../settlement/settlement-batch.entity'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SalesOrder) private readonly orderRepository: Repository<SalesOrder>,
    @InjectRepository(Fulfillment)
    private readonly fulfillmentRepository: Repository<Fulfillment>,
    @InjectRepository(FulfillmentException)
    private readonly exceptionRepository: Repository<FulfillmentException>,
    @InjectRepository(SettlementBatch)
    private readonly settlementRepository: Repository<SettlementBatch>,
  ) {}

  async overview() {
    const [orders, fulfillments, exceptions, settlements] = await Promise.all([
      this.orderRepository.find({ order: { orderDate: 'ASC' } }),
      this.fulfillmentRepository.find(),
      this.exceptionRepository.find(),
      this.settlementRepository.find(),
    ])
    const orderTrend = Object.values(
      orders.reduce<Record<string, { date: string; count: number; amount: number }>>(
        (result, order) => {
          const current = result[order.orderDate] ?? { date: order.orderDate, count: 0, amount: 0 }
          current.count += 1
          current.amount += Number(order.amount)
          result[order.orderDate] = current
          return result
        },
        {},
      ),
    )
    const openExceptions = exceptions.filter((item) => item.status !== ExceptionStatus.Resolved)
    return {
      kpis: {
        orderCount: orders.length,
        fulfillmentRate: orders.length
          ? Math.round(
              (fulfillments.filter((item) => item.status === FulfillmentStatus.Completed).length /
                orders.length) *
                100,
            )
          : 0,
        openExceptions: openExceptions.length,
        pendingSettlementAmount: settlements
          .filter((item) => item.status !== SettlementStatus.Paid)
          .reduce((total, item) => total + Number(item.payableAmount), 0),
      },
      orderTrend,
      fulfillmentDistribution: Object.values(FulfillmentStatus).map((status) => ({
        status,
        count: fulfillments.filter((item) => item.status === status).length,
      })),
      risks: [
        { type: '履约异常', count: openExceptions.length, level: 'high' },
        {
          type: '对账差异',
          count: settlements.filter((item) => item.status === SettlementStatus.Difference).length,
          level: 'medium',
        },
        {
          type: '待开发票',
          count: settlements.filter((item) => item.status === SettlementStatus.Confirmed).length,
          level: 'low',
        },
      ],
    }
  }
}
