export interface SalesOrder {
  orderNo: string
  customerName: string
  businessUnit: string
  amount: string
  promisedDate: string
}

export interface ExceptionItem {
  id: string
  exceptionType: string
  description: string
  owner: string
  status: string
  deadlineAt: string
  fulfillment?: { id: string; status: string; salesOrder: SalesOrder }
}

export interface Fulfillment {
  id: string
  warehouse: string
  carrier: string | null
  trackingNo: string | null
  totalQuantity: number
  shippedQuantity: number
  receivedQuantity: number
  status: string
  salesOrder: SalesOrder
  exceptions: ExceptionItem[]
}

export interface Summary {
  pendingReview: number
  shippedCount: number
  receivedCount: number
  openExceptions: number
  pendingVerifications: number
  statusDistribution: { status: string; count: number }[]
}

export interface FulfillmentVerification {
  id: string
  differenceAmount: string
  differenceReason: string
  owner: string
  status: 'pending' | 'processing' | 'resolved'
  verifiedDeliveryAmount: string | null
  resolution: string | null
  resolvedAt: string | null
  createdAt: string
  salesOrder: SalesOrder
  fulfillment: { id: string }
  settlementBatch: { id: string; batchNo: string }
}

export const statusMeta: Record<
  string,
  { text: string; variant: 'secondary' | 'warning' | 'info' | 'success' | 'danger' }
> = {
  pending_review: { text: '待审核', variant: 'warning' },
  ready_to_ship: { text: '待发运', variant: 'secondary' },
  in_transit: { text: '运输中', variant: 'info' },
  partially_received: { text: '部分签收', variant: 'warning' },
  completed: { text: '已完成', variant: 'success' },
  exception: { text: '异常', variant: 'danger' },
}

export const actionMeta: Record<string, { text: string; status: string }> = {
  pending_review: { text: '审核通过', status: 'ready_to_ship' },
  ready_to_ship: { text: '确认发运', status: 'in_transit' },
  in_transit: { text: '确认签收', status: 'completed' },
  partially_received: { text: '完成签收', status: 'completed' },
  exception: { text: '恢复运输', status: 'in_transit' },
}

export function money(value: string | number) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(
    Number(value),
  )
}

export function formatTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
