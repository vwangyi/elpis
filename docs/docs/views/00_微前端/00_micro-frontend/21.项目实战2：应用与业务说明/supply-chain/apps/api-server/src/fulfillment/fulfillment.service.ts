import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type EntityManager, type FindOptionsWhere, ILike, Not, Repository } from 'typeorm'

import { SalesOrder, SalesOrderStatus } from '../orders/sales-order.entity'
import { SettlementBatch, SettlementStatus } from '../settlement/settlement-batch.entity'
import { SettlementItem } from '../settlement/settlement-item.entity'
import type { UpdateVerificationDto } from './dto/update-verification.dto'
import { ExceptionStatus, FulfillmentException } from './fulfillment-exception.entity'
import { FulfillmentVerification, VerificationStatus } from './fulfillment-verification.entity'
import { Fulfillment, FulfillmentStatus } from './fulfillment.entity'

const nextStatus: Partial<Record<FulfillmentStatus, FulfillmentStatus[]>> = {
  [FulfillmentStatus.PendingReview]: [FulfillmentStatus.ReadyToShip],
  [FulfillmentStatus.ReadyToShip]: [FulfillmentStatus.InTransit],
  [FulfillmentStatus.InTransit]: [
    FulfillmentStatus.PartiallyReceived,
    FulfillmentStatus.Completed,
    FulfillmentStatus.Exception,
  ],
  [FulfillmentStatus.PartiallyReceived]: [FulfillmentStatus.Completed, FulfillmentStatus.Exception],
  [FulfillmentStatus.Exception]: [FulfillmentStatus.InTransit, FulfillmentStatus.Completed],
}

const salesOrderStatusByFulfillment: Record<FulfillmentStatus, SalesOrderStatus> = {
  [FulfillmentStatus.PendingReview]: SalesOrderStatus.PendingReview,
  [FulfillmentStatus.ReadyToShip]: SalesOrderStatus.ReadyToShip,
  [FulfillmentStatus.InTransit]: SalesOrderStatus.InTransit,
  [FulfillmentStatus.PartiallyReceived]: SalesOrderStatus.PartiallyReceived,
  [FulfillmentStatus.Completed]: SalesOrderStatus.Completed,
  [FulfillmentStatus.Exception]: SalesOrderStatus.Exception,
}

const nextExceptionStatus: Partial<Record<ExceptionStatus, ExceptionStatus[]>> = {
  [ExceptionStatus.Open]: [ExceptionStatus.Processing],
  [ExceptionStatus.Processing]: [ExceptionStatus.Resolved],
}

@Injectable()
export class FulfillmentService {
  constructor(
    @InjectRepository(Fulfillment)
    private readonly fulfillmentRepository: Repository<Fulfillment>,
    @InjectRepository(FulfillmentException)
    private readonly exceptionRepository: Repository<FulfillmentException>,
    @InjectRepository(FulfillmentVerification)
    private readonly verificationRepository: Repository<FulfillmentVerification>,
  ) {}

  async summary() {
    const fulfillments = await this.fulfillmentRepository.find({ relations: { exceptions: true } })
    const pendingVerifications = await this.verificationRepository.countBy({
      status: Not(VerificationStatus.Resolved),
    })
    return {
      pendingReview: fulfillments.filter((item) => item.status === FulfillmentStatus.PendingReview)
        .length,
      shippedCount: fulfillments.filter((item) => item.shippedAt).length,
      receivedCount: fulfillments.filter((item) => item.receivedQuantity > 0).length,
      openExceptions: fulfillments
        .flatMap((item) => item.exceptions ?? [])
        .filter((item) => item.status !== ExceptionStatus.Resolved).length,
      pendingVerifications,
      statusDistribution: Object.values(FulfillmentStatus).map((status) => ({
        status,
        count: fulfillments.filter((item) => item.status === status).length,
      })),
    }
  }

  findAll(search?: string, status?: FulfillmentStatus) {
    const statusWhere: FindOptionsWhere<Fulfillment> = status ? { status } : {}
    const where: FindOptionsWhere<Fulfillment> | FindOptionsWhere<Fulfillment>[] = search
      ? [
          { ...statusWhere, salesOrder: { orderNo: ILike(`%${search}%`) } },
          { ...statusWhere, salesOrder: { customerName: ILike(`%${search}%`) } },
        ]
      : statusWhere

    return this.fulfillmentRepository.find({
      where,
      relations: { salesOrder: true, exceptions: true },
      order: { salesOrder: { promisedDate: 'ASC' } },
    })
  }

  async updateStatus(id: string, status: FulfillmentStatus) {
    return this.fulfillmentRepository.manager.transaction(async (manager) => {
      const fulfillmentRepository = manager.getRepository(Fulfillment)
      const orderRepository = manager.getRepository(SalesOrder)
      const fulfillment = await fulfillmentRepository.findOne({
        where: { id },
        relations: { salesOrder: true, exceptions: true },
      })
      if (!fulfillment) throw new NotFoundException('履约任务不存在')
      if (!(nextStatus[fulfillment.status] ?? []).includes(status)) {
        throw new BadRequestException('当前履约状态不允许执行该操作')
      }
      const unresolvedExceptions = (fulfillment.exceptions ?? []).filter(
        (item) => item.status !== ExceptionStatus.Resolved,
      )
      if (
        unresolvedExceptions.length > 0 &&
        (status === FulfillmentStatus.Completed ||
          fulfillment.status === FulfillmentStatus.Exception)
      ) {
        throw new BadRequestException('请先关闭关联履约异常，再推进订单状态')
      }

      fulfillment.status = status
      fulfillment.salesOrder.status = salesOrderStatusByFulfillment[status]
      if (status === FulfillmentStatus.InTransit && !fulfillment.shippedAt) {
        fulfillment.shippedAt = new Date()
        fulfillment.shippedQuantity = fulfillment.totalQuantity
      }
      if (status === FulfillmentStatus.Completed) {
        fulfillment.signedAt = new Date()
        fulfillment.receivedQuantity = fulfillment.totalQuantity
      }
      await orderRepository.save(fulfillment.salesOrder)
      const savedFulfillment = await fulfillmentRepository.save(fulfillment)
      if (status === FulfillmentStatus.Completed) {
        await this.createSettlementForCompletedOrder(manager, fulfillment.salesOrder)
      }
      return savedFulfillment
    })
  }

  findExceptions() {
    return this.exceptionRepository.find({
      relations: { fulfillment: { salesOrder: true } },
      order: { deadlineAt: 'ASC' },
    })
  }

  async updateExceptionStatus(id: string, status: ExceptionStatus) {
    return this.exceptionRepository.manager.transaction(async (manager) => {
      const exceptionRepository = manager.getRepository(FulfillmentException)
      const fulfillmentRepository = manager.getRepository(Fulfillment)
      const orderRepository = manager.getRepository(SalesOrder)
      const exception = await exceptionRepository.findOne({
        where: { id },
        relations: { fulfillment: { salesOrder: true } },
      })
      if (!exception) throw new NotFoundException('履约异常不存在')
      if (!(nextExceptionStatus[exception.status] ?? []).includes(status)) {
        throw new BadRequestException('当前异常状态不允许执行该操作')
      }

      exception.status = status
      const savedException = await exceptionRepository.save(exception)
      const unresolvedCount = await exceptionRepository.countBy({
        fulfillmentId: exception.fulfillmentId,
        status: Not(ExceptionStatus.Resolved),
      })
      if (
        status === ExceptionStatus.Resolved &&
        unresolvedCount === 0 &&
        exception.fulfillment.status === FulfillmentStatus.Exception
      ) {
        exception.fulfillment.status = FulfillmentStatus.InTransit
        exception.fulfillment.salesOrder.status = SalesOrderStatus.InTransit
        await orderRepository.save(exception.fulfillment.salesOrder)
        await fulfillmentRepository.save(exception.fulfillment)
      }
      return savedException
    })
  }

  findVerifications() {
    return this.verificationRepository.find({
      relations: { salesOrder: true, fulfillment: true, settlementBatch: true },
      order: { createdAt: 'DESC' },
    })
  }

  async updateVerification(id: string, input: UpdateVerificationDto) {
    return this.verificationRepository.manager.transaction(async (manager) => {
      const verificationRepository = manager.getRepository(FulfillmentVerification)
      const verification = await verificationRepository.findOne({
        where: { id },
        relations: { salesOrder: true, settlementBatch: true },
      })
      if (!verification) throw new NotFoundException('履约核实任务不存在')

      if (
        verification.status === VerificationStatus.Pending &&
        input.status === VerificationStatus.Processing
      ) {
        verification.status = VerificationStatus.Processing
        return verificationRepository.save(verification)
      }

      if (
        verification.status !== VerificationStatus.Processing ||
        input.status !== VerificationStatus.Resolved
      ) {
        throw new BadRequestException('当前核实任务状态不允许执行该操作')
      }
      if (input.verifiedDeliveryAmount === undefined || !input.resolution?.trim()) {
        throw new BadRequestException('完成核实时必须填写核实后的交付金额和处理结论')
      }

      const itemRepository = manager.getRepository(SettlementItem)
      const item = await itemRepository.findOneBy({
        batchId: verification.settlementBatchId,
        salesOrderId: verification.salesOrderId,
      })
      if (!item) throw new NotFoundException('关联结算明细不存在')
      if (input.verifiedDeliveryAmount > Number(item.orderAmount)) {
        throw new BadRequestException('核实后的交付金额不能超过订单金额')
      }

      const differenceAmount = Number(item.orderAmount) - input.verifiedDeliveryAmount
      item.deliveryAmount = input.verifiedDeliveryAmount.toFixed(2)
      item.differenceReason = differenceAmount > 0 ? verification.differenceReason : null
      await itemRepository.save(item)

      const batchRepository = manager.getRepository(SettlementBatch)
      const batch = verification.settlementBatch
      batch.payableAmount = input.verifiedDeliveryAmount.toFixed(2)
      batch.differenceAmount = differenceAmount.toFixed(2)
      batch.status = SettlementStatus.Reconciling
      await batchRepository.save(batch)

      verification.status = VerificationStatus.Resolved
      verification.verifiedDeliveryAmount = input.verifiedDeliveryAmount.toFixed(2)
      verification.resolution = input.resolution.trim()
      verification.resolvedAt = new Date()
      return verificationRepository.save(verification)
    })
  }

  private async createSettlementForCompletedOrder(manager: EntityManager, order: SalesOrder) {
    const itemRepository = manager.getRepository(SettlementItem)
    if (await itemRepository.existsBy({ salesOrderId: order.id })) return

    const batchRepository = manager.getRepository(SettlementBatch)
    const batchNo = order.orderNo.startsWith('SO')
      ? `ST${order.orderNo.slice(2)}`
      : `ST-${order.orderNo}`.slice(0, 32)
    const batch = await batchRepository.save(
      batchRepository.create({
        batchNo,
        partnerName: order.customerName,
        period: order.orderDate.slice(0, 7),
        payableAmount: order.amount,
        differenceAmount: '0.00',
        status: SettlementStatus.Reconciling,
        invoiceNo: null,
        paidAt: null,
      }),
    )
    await itemRepository.save(
      itemRepository.create({
        batchId: batch.id,
        salesOrderId: order.id,
        orderAmount: order.amount,
        deliveryAmount: order.amount,
        invoiceAmount: '0.00',
        differenceReason: null,
      }),
    )
  }
}
