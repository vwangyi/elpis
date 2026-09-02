import { Badge, Card } from '@supply-chain/ui-react'
import { CircleCheckBig, Clock3, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'

import { money, statusMeta } from '../domain'
import { useSettlement } from '../SettlementContext'
import PageHeader from './PageHeader'

export function Component() {
  const { batches, loading, loadData } = useSettlement()
  const paymentBatches = batches.filter((batch) => ['invoiced', 'paid'].includes(batch.status))
  const paid = paymentBatches.filter((batch) => batch.status === 'paid')
  return (
    <main className="p-5 lg:p-8">
      <PageHeader
        title="付款跟踪"
        description="跟踪已开票批次的付款状态和资金完成情况"
        loading={loading}
        onRefresh={() => void loadData()}
      />
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Clock3 className="text-amber-500" size={20} />
          <p className="mt-4 text-sm text-muted-foreground">待付款批次</p>
          <p className="mt-1 text-3xl font-semibold">{paymentBatches.length - paid.length}</p>
        </Card>
        <Card className="p-5">
          <CircleCheckBig className="text-emerald-600" size={20} />
          <p className="mt-4 text-sm text-muted-foreground">已付款批次</p>
          <p className="mt-1 text-3xl font-semibold">{paid.length}</p>
        </Card>
        <Card className="p-5">
          <WalletCards className="text-blue-600" size={20} />
          <p className="mt-4 text-sm text-muted-foreground">累计付款金额</p>
          <p className="mt-1 text-2xl font-semibold">
            {money(paid.reduce((sum, item) => sum + Number(item.payableAmount), 0))}
          </p>
        </Card>
      </section>
      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">付款任务</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                {['结算批次', '收款方', '发票号码', '付款金额', '状态'].map((title) => (
                  <th key={title} className="px-5 py-3 font-medium">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentBatches.map((batch) => (
                <tr key={batch.id} className="border-t border-border">
                  <td className="px-5 py-4">
                    <Link
                      to={`/batches/${batch.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {batch.batchNo}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{batch.partnerName}</td>
                  <td className="px-5 py-4">{batch.invoiceNo}</td>
                  <td className="px-5 py-4">{money(batch.payableAmount)}</td>
                  <td className="px-5 py-4">
                    <Badge variant={statusMeta[batch.status]?.variant ?? 'secondary'}>
                      {statusMeta[batch.status]?.text}
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
