import { Badge, Button, Card, Input } from '@supply-chain/ui-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { actionMeta, money, statusMeta } from '../domain'
import { useSettlement } from '../SettlementContext'
import PageHeader from './PageHeader'

export function Component() {
  const { batches, loading, updatingId, errorMessage, loadData, updateStatus, createVerification } =
    useSettlement()
  const [invoiceNumbers, setInvoiceNumbers] = useState<Record<string, string>>({})
  const [differenceAmounts, setDifferenceAmounts] = useState<Record<string, string>>({})
  const [differenceReasons, setDifferenceReasons] = useState<Record<string, string>>({})
  return (
    <main className="p-5 lg:p-8">
      <PageHeader
        title="结算批次"
        description="按账期管理对账、开票和付款处理批次"
        loading={loading}
        onRefresh={() => void loadData()}
      />
      {errorMessage && (
        <Card className="mb-6 border-rose-200 p-4 text-sm text-rose-600">{errorMessage}</Card>
      )}
      <Card className="overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">批次处理池</h2>
          <p className="mt-1 text-sm text-muted-foreground">共 {batches.length} 个结算批次</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1160px] text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                {['结算批次', '结算对象', '账期', '应结金额', '差异金额', '状态', '业务操作'].map(
                  (title) => (
                    <th key={title} className="px-5 py-3 font-medium">
                      {title}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
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
                  <td className="px-5 py-4">{batch.period}</td>
                  <td className="px-5 py-4">{money(batch.payableAmount)}</td>
                  <td
                    className={
                      Number(batch.differenceAmount)
                        ? 'px-5 py-4 text-rose-600'
                        : 'px-5 py-4 text-emerald-600'
                    }
                  >
                    {money(batch.differenceAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusMeta[batch.status]?.variant ?? 'secondary'}>
                      {statusMeta[batch.status]?.text ?? batch.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    {batch.status === 'confirmed' ? (
                      <div className="flex gap-2">
                        <Input
                          className="h-9 w-32"
                          value={invoiceNumbers[batch.id] ?? ''}
                          onChange={(event) =>
                            setInvoiceNumbers((value) => ({
                              ...value,
                              [batch.id]: event.target.value,
                            }))
                          }
                          placeholder="发票号码"
                        />
                        <Button
                          size="sm"
                          disabled={!invoiceNumbers[batch.id] || updatingId === batch.id}
                          onClick={() =>
                            void updateStatus(batch, 'invoiced', {
                              invoiceNo: invoiceNumbers[batch.id]!,
                            })
                          }
                        >
                          登记开票
                        </Button>
                      </div>
                    ) : batch.status === 'reconciling' ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            className="h-9 w-28"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={differenceAmounts[batch.id] ?? ''}
                            onChange={(event) =>
                              setDifferenceAmounts((value) => ({
                                ...value,
                                [batch.id]: event.target.value,
                              }))
                            }
                            placeholder="差异金额"
                          />
                          <Input
                            className="h-9 w-40"
                            value={differenceReasons[batch.id] ?? ''}
                            onChange={(event) =>
                              setDifferenceReasons((value) => ({
                                ...value,
                                [batch.id]: event.target.value,
                              }))
                            }
                            placeholder="差异原因"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === batch.id}
                            onClick={() => void updateStatus(batch, 'confirmed')}
                          >
                            确认无差异
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              updatingId === batch.id ||
                              !differenceAmounts[batch.id] ||
                              !differenceReasons[batch.id]
                            }
                            onClick={() =>
                              void updateStatus(batch, 'difference', {
                                differenceAmount: Number(differenceAmounts[batch.id]),
                                differenceReason: differenceReasons[batch.id]!,
                              })
                            }
                          >
                            标记差异
                          </Button>
                          <Button
                            size="sm"
                            disabled={
                              updatingId === batch.id ||
                              !differenceAmounts[batch.id] ||
                              !differenceReasons[batch.id]
                            }
                            onClick={() =>
                              void createVerification(batch, {
                                differenceAmount: Number(differenceAmounts[batch.id]),
                                differenceReason: differenceReasons[batch.id]!,
                                owner: '履约运营组',
                              })
                            }
                          >
                            退回履约核实
                          </Button>
                        </div>
                      </div>
                    ) : batch.verifications?.some((item) => item.status !== 'resolved') ? (
                      <span className="text-amber-600">等待履约核实</span>
                    ) : actionMeta[batch.status] ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingId === batch.id}
                        onClick={() => void updateStatus(batch, actionMeta[batch.status]!.status)}
                      >
                        {updatingId === batch.id ? '处理中' : actionMeta[batch.status]!.text}
                      </Button>
                    ) : (
                      <span className="text-emerald-600">流程完成</span>
                    )}
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
