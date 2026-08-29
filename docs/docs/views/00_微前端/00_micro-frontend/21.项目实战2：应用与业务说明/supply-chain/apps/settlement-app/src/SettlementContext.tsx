import { createApiClient } from '@supply-chain/api-client'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { SettlementBatch, Summary } from './domain'

interface SettlementContextValue {
  summary: Summary | null
  batches: SettlementBatch[]
  loading: boolean
  updatingId: string
  errorMessage: string
  loadData: () => Promise<void>
  updateStatus: (
    batch: SettlementBatch,
    status: string,
    details?: SettlementStatusDetails,
  ) => Promise<void>
  createVerification: (
    batch: SettlementBatch,
    details: { differenceAmount: number; differenceReason: string; owner?: string },
  ) => Promise<void>
}

export interface SettlementStatusDetails {
  invoiceNo?: string
  differenceAmount?: number
  differenceReason?: string
}

const SettlementContext = createContext<SettlementContextValue | null>(null)
const request = createApiClient({ baseUrl: '/api' })

export function SettlementProvider({ children }: PropsWithChildren) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [batches, setBatches] = useState<SettlementBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const [summaryData, batchData] = await Promise.all([
        request<Summary>('settlements/summary'),
        request<SettlementBatch[]>('settlements/batches'),
      ])
      setSummary(summaryData)
      setBatches(batchData)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '结算数据加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const updateStatus = useCallback(
    async (batch: SettlementBatch, status: string, details: SettlementStatusDetails = {}) => {
      setUpdatingId(batch.id)
      setErrorMessage('')
      try {
        await request(`settlements/batches/${batch.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, ...details }),
        })
        await loadData()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '结算状态更新失败')
      } finally {
        setUpdatingId('')
      }
    },
    [loadData],
  )

  const createVerification = useCallback(
    async (
      batch: SettlementBatch,
      details: { differenceAmount: number; differenceReason: string; owner?: string },
    ) => {
      setUpdatingId(batch.id)
      setErrorMessage('')
      try {
        await request(`settlements/batches/${batch.id}/verifications`, {
          method: 'POST',
          body: JSON.stringify(details),
        })
        await loadData()
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '退回履约核实失败')
      } finally {
        setUpdatingId('')
      }
    },
    [loadData],
  )

  const value = useMemo(
    () => ({
      summary,
      batches,
      loading,
      updatingId,
      errorMessage,
      loadData,
      updateStatus,
      createVerification,
    }),
    [
      summary,
      batches,
      loading,
      updatingId,
      errorMessage,
      loadData,
      updateStatus,
      createVerification,
    ],
  )

  return <SettlementContext.Provider value={value}>{children}</SettlementContext.Provider>
}

export function useSettlement() {
  const value = useContext(SettlementContext)
  if (!value) throw new Error('SettlementProvider is missing')
  return value
}
