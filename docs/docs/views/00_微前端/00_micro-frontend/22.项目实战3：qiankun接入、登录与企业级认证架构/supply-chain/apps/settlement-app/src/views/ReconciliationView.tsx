import { Badge, Card } from '@supply-chain/ui-react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { money, statusMeta } from '../domain'
import { useSettlement } from '../SettlementContext'
import PageHeader from './PageHeader'

export function Component() {
  const { batches, loading, loadData } = useSettlement()
  const items = batches.flatMap((batch) => batch.items.map((item) => ({ ...item, batch })))
  const differences = items.filter((item) => item.differenceReason)
  return (
    <main className="p-5 lg:p-8">
      <PageHeader
        title="对账差异"
        description="核对订单、签收和发票金额并定位差异原因"
        loading={loading}
        onRefresh={() => void loadData()}
      />
      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">核对明细</p>
          <p className="mt-2 text-3xl font-semibold">{items.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">历史差异明细</p>
          <p className="mt-2 text-3xl font-semibold text-rose-600">{differences.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">原始差异金额</p>
          <p className="mt-2 text-2xl font-semibold">
            {money(batches.reduce((sum, item) => sum + Number(item.differenceAmount), 0))}
          </p>
        </Card>
      </section>
      <Card className="overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">核对结果</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                {[
                  '销售订单',
                  '结算批次',
                  '订单金额',
                  '签收金额',
                  '发票金额',
                  '核对结果',
                  '处理状态',
                ].map((title) => (
                  <th key={title} className="px-5 py-3 font-medium">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-5 py-4 font-medium">{item.salesOrder.orderNo}</td>
                  <td className="px-5 py-4">
                    <Link to={`/batches/${item.batch.id}`} className="text-primary hover:underline">
                      {item.batch.batchNo}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{money(item.orderAmount)}</td>
                  <td className="px-5 py-4">{money(item.deliveryAmount)}</td>
                  <td className="px-5 py-4">{money(item.invoiceAmount)}</td>
                  <td className="px-5 py-4">
                    {item.differenceReason ? (
                      <Badge variant="danger">
                        <AlertCircle className="mr-1" size={13} />
                        {item.differenceReason}
                      </Badge>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 size={16} />
                        金额一致
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusMeta[item.batch.status]?.variant ?? 'secondary'}>
                      {statusMeta[item.batch.status]?.text ?? item.batch.status}
                    </Badge>
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
