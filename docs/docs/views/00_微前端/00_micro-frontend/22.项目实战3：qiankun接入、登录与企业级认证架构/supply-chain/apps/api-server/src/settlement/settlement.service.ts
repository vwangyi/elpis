import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'

import {
  FulfillmentVerification,
  VerificationStatus,
} from '../fulfillment/fulfillment-verification.entity'
import { Fulfillment } from '../fulfillment/fulfillment.entity'
import type { CreateVerificationDto } from './dto/create-verification.dto'
import type { UpdateSettlementStatusDto } from './dto/update-settlement-status.dto'
import { SettlementBatch, SettlementStatus } from './settlement-batch.entity'
import { SettlementItem } from './settlement-item.entity'

const nextStatus: Partial<Record<SettlementStatus, SettlementStatus[]>> = {
  [SettlementStatus.Reconciling]: [SettlementStatus.Confirmed, SettlementStatus.Difference],
  [SettlementStatus.Difference]: [SettlementStatus.Confirmed],
  [SettlementStatus.Confirmed]: [SettlementStatus.Invoiced],
  [SettlementStatus.Invoiced]: [SettlementStatus.Paid],
}

@Injectable()
export class SettlementService {
  constructor(
    @InjectRepository(SettlementBatch)
    private readonly batchRepository: Repository<SettlementBatch>,
  ) {}

  async summary() {
    const batches = await this.batchRepository.find()
    const sum = (items: SettlementBatch[]) =>
      items.reduce((total, item) => total + Number(item.payableAmount), 0)
    return {
      pendingAmount: sum(batches.filter((item) => item.status !== SettlementStatus.Paid)),
      differenceCount: batches.filter((item) => item.status === SettlementStatus.Difference).length,
      pendingInvoiceCount: batches.filter((item) => item.status === SettlementStatus.Confirmed)
        .length,
      paidAmount: sum(batches.filter((item) => item.status === SettlementStatus.Paid)),
      statusDistribution: Object.values(SettlementStatus).map((status) => ({
        status,
        count: batches.filter((item) => item.status === status).length,
      })),
    }
  }

  findAll() {
    return this.batchRepository.find({
      relations: { items: { salesOrder: true }, verifications: true },
      order: { createdAt: 'DESC' },
    })
  }

  async createVerification(id: string, input: CreateVerificationDto) {
    return this.batchRepository.manager.transaction(async (manager) => {
      const batchRepository = manager.getRepository(SettlementBatch)
      const batch = await batchRepository.findOne({ where: { id }, relations: { items: true } })
      if (!batch) throw new NotFoundException('结算批次不存在')
      if (batch.status !== SettlementStatus.Reconciling) {
        throw new BadRequestException('只有对账中的批次才能退回履约核实')
      }
      if (!input.differenceReason.trim()) throw new BadRequestException('必须填写差异原因')

      const verificationRepository = manager.getRepository(FulfillmentVerification)
      const activeVerification = await verificationRepository.existsBy({
        settlementBatchId: id,
        status: Not(VerificationStatus.Resolved),
      })
      if (activeVerification) throw new BadRequestException('该结算批次已有待处理的履约核实任务')

      const item = batch.items?.[0]
      if (!item) throw new NotFoundException('结算批次没有关联订单')
      if (input.differenceAmount >= Number(item.orderAmount)) {
        throw new BadRequestException('差异金额必须小于订单金额')
      }
      const fulfillment = await manager.getRepository(Fulfillment).findOneBy({
        salesOrderId: item.salesOrderId,
      })
      if (!fulfillment) throw new NotFoundException('关联履约任务不存在')

      const deliveryAmount = Number(item.orderAmount) - input.differenceAmount
      item.deliveryAmount = deliveryAmount.toFixed(2)
      item.differenceReason = input.differenceReason.trim()
      await manager.getRepository(SettlementItem).save(item)

      batch.differenceAmount = input.differenceAmount.toFixed(2)
      batch.payableAmount = deliveryAmount.toFixed(2)
      batch.status = SettlementStatus.Difference
      await batchRepository.save(batch)

      return verificationRepository.save(
        verificationRepository.create({
          settlementBatchId: batch.id,
          salesOrderId: item.salesOrderId,
          fulfillmentId: fulfillment.id,
          differenceAmount: input.differenceAmount.toFixed(2),
          differenceReason: input.differenceReason.trim(),
          owner: input.owner?.trim() || '履约运营组',
          status: VerificationStatus.Pending,
          verifiedDeliveryAmount: null,
          resolution: null,
          resolvedAt: null,
        }),
      )
    })
  }

  async updateStatus(id: string, input: UpdateSettlementStatusDto) {
    return this.batchRepository.manager.transaction(async (manager) => {
      const batchRepository = manager.getRepository(SettlementBatch)
      const batch = await batchRepository.findOne({ where: { id }, relations: { items: true } })
      if (!batch) throw new NotFoundException('结算批次不存在')
      if (!(nextStatus[batch.status] ?? []).includes(input.status)) {
        throw new BadRequestException('当前结算状态不允许执行该操作')
      }
      if (
        batch.status === SettlementStatus.Difference &&
        input.status === SettlementStatus.Confirmed
      ) {
        const hasUnresolvedVerification = await manager
          .getRepository(FulfillmentVerification)
          .existsBy({
            settlementBatchId: batch.id,
            status: Not(VerificationStatus.Resolved),
          })
        if (hasUnresolvedVerification) {
          throw new BadRequestException('请先等待履约中心完成差异核实')
        }
      }
      if (input.status === SettlementStatus.Invoiced && !input.invoiceNo) {
        throw new BadRequestException('登记开票时必须填写发票号码')
      }
      if (input.status === SettlementStatus.Difference) {
        if (!input.differenceAmount || !input.differenceReason?.trim()) {
          throw new BadRequestException('标记差异时必须填写差异金额和差异原因')
        }
        const orderAmount = (batch.items ?? []).reduce(
          (total, item) => total + Number(item.orderAmount),
          0,
        )
        if (input.differenceAmount >= orderAmount) {
          throw new BadRequestException('差异金额必须小于订单金额')
        }

        batch.differenceAmount = input.differenceAmount.toFixed(2)
        batch.payableAmount = (orderAmount - input.differenceAmount).toFixed(2)
        let remainingDifference = input.differenceAmount
        for (const item of batch.items ?? []) {
          const deduction = Math.min(remainingDifference, Number(item.orderAmount))
          item.deliveryAmount = (Number(item.orderAmount) - deduction).toFixed(2)
          item.differenceReason = deduction > 0 ? input.differenceReason.trim() : null
          remainingDifference -= deduction
        }
        await manager.save(batch.items ?? [])
      }

      batch.status = input.status
      if (input.invoiceNo) batch.invoiceNo = input.invoiceNo
      if (input.status === SettlementStatus.Invoiced) {
        for (const item of batch.items ?? []) item.invoiceAmount = item.deliveryAmount
        await manager.save(batch.items ?? [])
      }
      if (input.status === SettlementStatus.Paid) batch.paidAt = new Date()
      return batchRepository.save(batch)
    })
  }
}
