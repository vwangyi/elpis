import { Badge, Card } from '@supply-chain/ui-react'
import { FileClock, FileCheck2, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'

import { money, statusMeta } from '../domain'
import { useSettlement } from '../SettlementContext'
import PageHeader from './PageHeader'

export function Component() {
  const { batches, loading, loadData } = useSettlement()
  const invoiceBatches = batches.filter((batch) =>
    ['confirmed', 'invoiced', 'paid'].includes(batch.status),
  )
  return (
    <main className="p-5 lg:p-8">
      <PageHeader
        title="发票管理"
        description="跟踪待开票、已开票及关联结算批次"
        loading={loading}
        onRefresh={() => void loadData()}
      />
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <FileClock className="text-amber-500" size={20} />
          <p className="mt-4 text-sm text-muted-foreground">待开票</p>
          <p className="mt-1 text-3xl font-semibold">
            {batches.filter((item) => item.status === 'confirmed').length}
          </p>
        </Card>
        <Card className="p-5">
          <ReceiptText className="text-blue-600" size={20} />
          <p className="mt-4 text-sm text-muted-foreground">已登记发票</p>
          <p className="mt-1 text-3xl font-semibold">
            {batches.filter((item) => item.invoiceNo).length}
          </p>
        </Card>
        <Card className="p-5">
          <FileCheck2 className="text-emerald-600" size={20} />
          <p className="mt-4 text-sm text-muted-foreground">含税金额</p>
          <p className="mt-1 text-2xl font-semibold">
            {money(invoiceBatches.reduce((sum, item) => sum + Number(item.payableAmount), 0))}
          </p>
        </Card>
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {invoiceBatches.map((batch) => (
          <Card key={batch.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  to={`/batches/${batch.id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {batch.invoiceNo ?? '待登记发票'}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{batch.partnerName}</p>
              </div>
              <Badge variant={statusMeta[batch.status]?.variant ?? 'secondary'}>
                {statusMeta[batch.status]?.text}
              </Badge>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 rounded-lg bg-muted/60 p-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">结算批次</p>
                <p className="mt-1 font-medium">{batch.batchNo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">账期</p>
                <p className="mt-1 font-medium">{batch.period}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">开票金额</p>
                <p className="mt-1 font-medium">{money(batch.payableAmount)}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </main>
  )
}
