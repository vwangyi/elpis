import { Badge, Button, Card } from '@supply-chain/ui-react'
import { ArrowLeft, CalendarRange, CircleDollarSign, FileText, Landmark } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { actionMeta, money, statusMeta } from '../domain'
import { useSettlement } from '../SettlementContext'

export function Component() {
  const { id } = useParams()
  const { batches, loading, errorMessage, updatingId, updateStatus } = useSettlement()
  const batch = batches.find((item) => item.id === id)
  if (loading)
    return (
      <main className="p-5 lg:p-8">
        <Card className="p-10 text-center text-sm text-muted-foreground">正在加载结算批次...</Card>
      </main>
    )
  if (errorMessage)
    return (
      <main className="p-5 lg:p-8">
        <Card className="border-rose-200 p-6 text-sm text-rose-600">{errorMessage}</Card>
      </main>
    )
  if (!batch)
    return (
      <main className="p-5 lg:p-8">
        <Card className="p-10 text-center">
          <p className="font-medium">未找到结算批次</p>
          <Link to="/batches" className="mt-2 inline-block text-sm text-primary">
            返回批次列表
          </Link>
        </Card>
      </main>
    )
  return (
    <main className="p-5 lg:p-8">
      <Link
        to="/batches"
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        返回结算批次
      </Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{batch.batchNo}</h1>
            <Badge variant={statusMeta[batch.status]?.variant ?? 'secondary'}>
              {statusMeta[batch.status]?.text}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{batch.partnerName}</p>
        </div>
        {actionMeta[batch.status] && batch.status !== 'confirmed' && (
          <Button
            disabled={updatingId === batch.id}
            onClick={() => void updateStatus(batch, actionMeta[batch.status]!.status)}
          >
            {updatingId === batch.id ? '处理中' : actionMeta[batch.status]!.text}
          </Button>
        )}
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: '结算账期', value: batch.period, icon: CalendarRange },
          { label: '应结金额', value: money(batch.payableAmount), icon: CircleDollarSign },
          { label: '差异金额', value: money(batch.differenceAmount), icon: Landmark },
          { label: '发票号码', value: batch.invoiceNo ?? '尚未登记', icon: FileText },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5">
            <Icon size={19} className="text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </Card>
        ))}
      </section>
      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">三单核对明细</h2>
          <p className="mt-1 text-sm text-muted-foreground">订单、签收与发票金额逐项比对</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                {['销售订单', '客户', '订单金额', '签收金额', '发票金额', '差异原因'].map(
                  (title) => (
                    <th key={title} className="px-5 py-3 font-medium">
                      {title}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {batch.items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-5 py-4 font-medium">{item.salesOrder.orderNo}</td>
                  <td className="px-5 py-4">{item.salesOrder.customerName}</td>
                  <td className="px-5 py-4">{money(item.orderAmount)}</td>
                  <td className="px-5 py-4">{money(item.deliveryAmount)}</td>
                  <td className="px-5 py-4">{money(item.invoiceAmount)}</td>
                  <td
                    className={
                      item.differenceReason
                        ? 'px-5 py-4 text-rose-600'
                        : 'px-5 py-4 text-emerald-600'
                    }
                  >
                    {item.differenceReason ?? '无差异'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
