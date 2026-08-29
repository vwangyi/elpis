export interface Summary {
  pendingAmount: number
  differenceCount: number
  pendingInvoiceCount: number
  paidAmount: number
  statusDistribution: { status: string; count: number }[]
}

export interface SettlementItem {
  id: string
  orderAmount: string
  deliveryAmount: string
  invoiceAmount: string
  differenceReason: string | null
  salesOrder: { orderNo: string; customerName: string }
}

export interface SettlementBatch {
  id: string
  batchNo: string
  partnerName: string
  period: string
  payableAmount: string
  differenceAmount: string
  status: string
  invoiceNo: string | null
  items: SettlementItem[]
  verifications: { id: string; status: string }[]
}

export const statusMeta: Record<
  string,
  { text: string; variant: 'secondary' | 'warning' | 'danger' | 'info' | 'success' }
> = {
  reconciling: { text: '对账中', variant: 'info' },
  difference: { text: '存在差异', variant: 'danger' },
  confirmed: { text: '待开票', variant: 'warning' },
  invoiced: { text: '待付款', variant: 'info' },
  paid: { text: '已付款', variant: 'success' },
}

export const actionMeta: Record<string, { text: string; status: string }> = {
  reconciling: { text: '确认对账', status: 'confirmed' },
  difference: { text: '确认差异', status: 'confirmed' },
  invoiced: { text: '确认付款', status: 'paid' },
}

export function money(value: number | string) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(
    Number(value),
  )
}
