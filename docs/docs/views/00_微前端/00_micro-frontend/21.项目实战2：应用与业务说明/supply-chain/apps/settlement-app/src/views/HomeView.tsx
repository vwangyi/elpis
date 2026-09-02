import {
  Card,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@supply-chain/ui-react'
import { AlertCircle, BadgeCheck, Landmark, ReceiptText } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'

import { money, statusMeta } from '../domain'
import { useSettlement } from '../SettlementContext'
import PageHeader from './PageHeader'

const chartConfig = {
  count: { label: '批次数量', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig

export function Component() {
  const { summary, batches, loading, errorMessage, loadData } = useSettlement()
  const pending = batches.filter((batch) => batch.status !== 'paid').slice(0, 4)
  return (
    <main className="p-5 lg:p-8">
      <PageHeader
        title="结算概览"
        description="汇总对账、差异、开票与付款进度"
        loading={loading}
        onRefresh={() => void loadData()}
      />
      {errorMessage && (
        <Card className="mb-6 border-rose-200 p-4 text-sm text-rose-600">{errorMessage}</Card>
      )}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: '待结算金额',
            value: money(summary?.pendingAmount ?? 0),
            icon: Landmark,
            color: 'text-blue-600',
          },
          {
            label: '差异批次',
            value: `${summary?.differenceCount ?? 0} 批`,
            icon: AlertCircle,
            color: 'text-rose-600',
          },
          {
            label: '待开票批次',
            value: `${summary?.pendingInvoiceCount ?? 0} 批`,
            icon: ReceiptText,
            color: 'text-amber-500',
          },
          {
            label: '已付款金额',
            value: money(summary?.paidAmount ?? 0),
            icon: BadgeCheck,
            color: 'text-emerald-600',
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card className="p-5" key={label}>
            <Icon className={color} size={21} />
            <p className="mt-4 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{loading ? '—' : value}</p>
          </Card>
        ))}
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <Card className="p-6">
          <h2 className="font-semibold">结算状态分布</h2>
          <p className="mt-1 text-sm text-muted-foreground">按批次统计业财处理进度</p>
          <ChartContainer config={chartConfig} className="mt-3 h-72 w-full">
            <BarChart
              accessibilityLayer
              data={(summary?.statusDistribution ?? []).map((item) => ({
                ...item,
                label: statusMeta[item.status]?.text ?? item.status,
              }))}
              layout="vertical"
              margin={{ left: 4, right: 20 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={72} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={6} />
            </BarChart>
          </ChartContainer>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">待办批次</h2>
              <p className="mt-1 text-sm text-muted-foreground">等待业财人员继续处理</p>
            </div>
            <Link to="/batches" className="text-sm text-primary">
              查看全部
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {pending.map((batch) => (
              <Link
                to={`/batches/${batch.id}`}
                key={batch.id}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition hover:bg-muted/60"
              >
                <div>
                  <p className="text-sm font-medium">{batch.batchNo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {batch.partnerName} · {batch.period}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{money(batch.payableAmount)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {statusMeta[batch.status]?.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </main>
  )
}
