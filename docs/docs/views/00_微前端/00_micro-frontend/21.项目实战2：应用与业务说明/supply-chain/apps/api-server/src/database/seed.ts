import 'reflect-metadata'

import { hash } from 'bcryptjs'

import dataSource from './data-source'
import { ExceptionStatus, FulfillmentException } from '../fulfillment/fulfillment-exception.entity'
import { Fulfillment, FulfillmentStatus } from '../fulfillment/fulfillment.entity'
import { SalesOrder, SalesOrderStatus } from '../orders/sales-order.entity'
import { Organization } from '../organizations/organization.entity'
import { SettlementBatch, SettlementStatus } from '../settlement/settlement-batch.entity'
import { SettlementItem } from '../settlement/settlement-item.entity'
import { User, UserStatus } from '../users/user.entity'

async function seed() {
  await dataSource.initialize()
  const organizationRepository = dataSource.getRepository(Organization)
  const userRepository = dataSource.getRepository(User)
  const orderRepository = dataSource.getRepository(SalesOrder)
  const fulfillmentRepository = dataSource.getRepository(Fulfillment)
  const exceptionRepository = dataSource.getRepository(FulfillmentException)
  const settlementRepository = dataSource.getRepository(SettlementBatch)
  const settlementItemRepository = dataSource.getRepository(SettlementItem)

  let organization = await organizationRepository.findOneBy({ code: 'GROUP-HQ' })
  organization ??= await organizationRepository.save(
    organizationRepository.create({ code: 'GROUP-HQ', name: '集团运营中心' }),
  )

  const existingUser = await userRepository.findOneBy({ username: 'admin' })
  if (!existingUser) {
    await userRepository.save(
      userRepository.create({
        username: 'admin',
        displayName: '平台管理员',
        passwordHash: await hash('Admin123!', 12),
        status: UserStatus.Active,
        organizationId: organization.id,
      }),
    )
  }

  if (!(await orderRepository.existsBy({ orderNo: 'SO202608050021' }))) {
    const orderInputs = [
      [
        'SO202608050021',
        '华东零售事业部',
        '华东事业群',
        128600,
        320,
        '2026-08-05',
        '2026-08-08',
        SalesOrderStatus.Completed,
      ],
      [
        'SO202608060035',
        '南方渠道中心',
        '南方事业群',
        86400,
        180,
        '2026-08-06',
        '2026-08-09',
        SalesOrderStatus.Completed,
      ],
      [
        'SO202608070042',
        '北区直营中心',
        '北方事业群',
        52800,
        120,
        '2026-08-07',
        '2026-08-10',
        SalesOrderStatus.PartiallyReceived,
      ],
      [
        'SO202608080063',
        '西南分销事业部',
        '西南事业群',
        43200,
        96,
        '2026-08-08',
        '2026-08-11',
        SalesOrderStatus.Exception,
      ],
      [
        'SO202608090071',
        '华中商超渠道',
        '华中事业群',
        196800,
        410,
        '2026-08-09',
        '2026-08-12',
        SalesOrderStatus.InTransit,
      ],
      [
        'SO202608090078',
        '华南直营网点',
        '南方事业群',
        77600,
        160,
        '2026-08-09',
        '2026-08-12',
        SalesOrderStatus.ReadyToShip,
      ],
      [
        'SO202608100087',
        '西北区域公司',
        '西北事业群',
        93400,
        210,
        '2026-08-10',
        '2026-08-13',
        SalesOrderStatus.PendingReview,
      ],
      [
        'SO202608100092',
        '苏皖零售中心',
        '华东事业群',
        68800,
        140,
        '2026-08-10',
        '2026-08-13',
        SalesOrderStatus.InTransit,
      ],
      [
        'SO202608110016',
        '粤海经销中心',
        '南方事业群',
        112500,
        250,
        '2026-08-11',
        '2026-08-14',
        SalesOrderStatus.ReadyToShip,
      ],
      [
        'SO202608110018',
        '京津直营网点',
        '北方事业群',
        158000,
        360,
        '2026-08-11',
        '2026-08-14',
        SalesOrderStatus.PendingReview,
      ],
    ] as const
    const orders = await orderRepository.save(
      orderInputs.map(
        ([
          orderNo,
          customerName,
          businessUnit,
          amount,
          itemCount,
          orderDate,
          promisedDate,
          status,
        ]) =>
          orderRepository.create({
            orderNo,
            customerName,
            businessUnit,
            amount: amount.toFixed(2),
            itemCount,
            orderDate,
            promisedDate,
            status,
          }),
      ),
    )
    const fulfillmentInputs = orders.map((order, index) => {
      const completed = index < 2
      const inTransit = [2, 4, 7].includes(index)
      const exception = index === 3
      return fulfillmentRepository.create({
        salesOrderId: order.id,
        warehouse: index % 2 === 0 ? '上海青浦中心仓' : '武汉东西湖中心仓',
        carrier: index < 6 ? (index % 2 === 0 ? '顺丰供应链' : '京东物流') : null,
        trackingNo: index < 6 ? `YT202608${String(index + 1).padStart(4, '0')}` : null,
        totalQuantity: order.itemCount,
        shippedQuantity: completed || inTransit || exception ? order.itemCount : 0,
        receivedQuantity: completed ? order.itemCount : index === 2 ? 80 : 0,
        status: order.status as unknown as FulfillmentStatus,
        shippedAt:
          completed || inTransit || exception
            ? new Date(`2026-08-${String(index + 6).padStart(2, '0')}T03:30:00Z`)
            : null,
        signedAt: completed
          ? new Date(`2026-08-${String(index + 8).padStart(2, '0')}T08:20:00Z`)
          : null,
      })
    })
    const fulfillments = await fulfillmentRepository.save(fulfillmentInputs)
    await exceptionRepository.save([
      exceptionRepository.create({
        fulfillmentId: fulfillments[3]!.id,
        exceptionType: '运输延误',
        description: '干线车辆临时故障，预计晚到 8 小时',
        owner: '周敏',
        status: ExceptionStatus.Processing,
        deadlineAt: new Date('2026-08-12T10:00:00+08:00'),
      }),
      exceptionRepository.create({
        fulfillmentId: fulfillments[2]!.id,
        exceptionType: '签收差异',
        description: '客户实收数量与发运数量相差 40 件',
        owner: '陈涛',
        status: ExceptionStatus.Open,
        deadlineAt: new Date('2026-08-12T16:00:00+08:00'),
      }),
      exceptionRepository.create({
        fulfillmentId: fulfillments[0]!.id,
        exceptionType: '外包装破损',
        description: '已完成现场取证并确认不影响商品销售',
        owner: '李倩',
        status: ExceptionStatus.Resolved,
        deadlineAt: new Date('2026-08-09T18:00:00+08:00'),
      }),
    ])
    const batchInputs = [
      ['ST202608-0010', 128600, 0, SettlementStatus.Paid, 'FP2026080018'],
      ['ST202608-0011', 86400, 0, SettlementStatus.Invoiced, 'FP2026080021'],
    ] as const
    const batches = await settlementRepository.save(
      batchInputs.map(([batchNo, payableAmount, differenceAmount, status, invoiceNo], index) =>
        settlementRepository.create({
          batchNo,
          partnerName: orders[index]!.customerName,
          period: '2026-08',
          payableAmount: payableAmount.toFixed(2),
          differenceAmount: differenceAmount.toFixed(2),
          status,
          invoiceNo,
          paidAt: status === SettlementStatus.Paid ? new Date('2026-08-11T09:00:00+08:00') : null,
          createdAt: new Date(`2026-08-${String(index + 6).padStart(2, '0')}T02:00:00Z`),
        }),
      ),
    )
    await settlementItemRepository.save(
      batches.map((batch, index) => {
        const order = orders[index]!
        const difference = Number(batch.differenceAmount)
        return settlementItemRepository.create({
          batchId: batch.id,
          salesOrderId: order.id,
          orderAmount: order.amount,
          deliveryAmount: (Number(order.amount) - difference).toFixed(2),
          invoiceAmount:
            batch.status === SettlementStatus.Invoiced || batch.status === SettlementStatus.Paid
              ? (Number(order.amount) - difference).toFixed(2)
              : '0.00',
          differenceReason: difference
            ? index === 2
              ? '签收数量差异'
              : '运输时效扣款待确认'
            : null,
        })
      }),
    )
  }

  await dataSource.destroy()
  console.warn('Seed completed. Initial administrator: admin')
}

seed().catch(async (error: unknown) => {
  console.error(error)
  if (dataSource.isInitialized) await dataSource.destroy()
  process.exitCode = 1
})
