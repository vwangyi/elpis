import { createApiClient } from '@supply-chain/api-client'
import { computed, ref } from 'vue'
import { createBusinessEvent } from '@supply-chain/micro-bridge'

import type { ExceptionItem, Fulfillment, FulfillmentVerification, Summary } from './domain'
import { getFulfillmentAccessToken, handleUnauthorized } from './auth'
import { getPlatformBridge } from './platform-bridge'

const summary = ref<Summary | null>(null)
const orders = ref<Fulfillment[]>([])
const exceptions = ref<ExceptionItem[]>([])
const verifications = ref<FulfillmentVerification[]>([])
const loading = ref(true)
const initialized = ref(false)
const updatingId = ref('')
const updatingExceptionId = ref('')
const updatingVerificationId = ref('')
const errorMessage = ref('')

const request = createApiClient({
  baseUrl: '/api',
  getAccessToken: getFulfillmentAccessToken,
  onUnauthorized: handleUnauthorized,
})

async function loadData(force = false) {
  if (initialized.value && !force) return
  loading.value = true
  errorMessage.value = ''
  try {
    const [summaryData, orderData, exceptionData, verificationData] = await Promise.all([
      request<Summary>('fulfillment/summary'),
      request<Fulfillment[]>('fulfillment/orders'),
      request<ExceptionItem[]>('fulfillment/exceptions'),
      request<FulfillmentVerification[]>('fulfillment/verifications'),
    ])
    summary.value = summaryData
    orders.value = orderData
    exceptions.value = exceptionData
    verifications.value = verificationData
    initialized.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '履约数据加载失败'
  } finally {
    loading.value = false
  }
}

async function updateVerification(
  id: string,
  status: string,
  details: { verifiedDeliveryAmount?: number; resolution?: string } = {},
) {
  const verification = verifications.value.find((item) => item.id === id)
  updatingVerificationId.value = id
  errorMessage.value = ''
  try {
    await request(`fulfillment/verifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...details }),
    })
    if (status === 'resolved' && verification) {
      getPlatformBridge().publish(
        createBusinessEvent({
          type: 'fulfillment.verification-resolved',
          source: 'fulfillmentApp',
          target: 'settlementApp',
          payload: {
            verificationId: verification.id,
            settlementBatchId: verification.settlementBatch.id,
            batchNo: verification.settlementBatch.batchNo,
            orderNo: verification.salesOrder.orderNo,
          },
        }),
      )
    }
    await loadData(true)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '履约核实任务更新失败'
  } finally {
    updatingVerificationId.value = ''
  }
}

async function updateStatus(id: string, status: string) {
  const fulfillment = orders.value.find((item) => item.id === id)
  updatingId.value = id
  errorMessage.value = ''
  try {
    await request(`fulfillment/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    if (status === 'completed' && fulfillment) {
      getPlatformBridge().publish(
        createBusinessEvent({
          type: 'fulfillment.completed',
          source: 'fulfillmentApp',
          target: 'settlementApp',
          payload: {
            fulfillmentId: fulfillment.id,
            orderNo: fulfillment.salesOrder.orderNo,
          },
        }),
      )
    }
    await loadData(true)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '履约状态更新失败'
  } finally {
    updatingId.value = ''
  }
}

async function updateExceptionStatus(id: string, status: string) {
  updatingExceptionId.value = id
  errorMessage.value = ''
  try {
    await request(`fulfillment/exceptions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    await loadData(true)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '异常状态更新失败'
  } finally {
    updatingExceptionId.value = ''
  }
}

export function useFulfillment() {
  return {
    summary,
    orders,
    exceptions,
    verifications,
    loading,
    updatingId,
    updatingExceptionId,
    updatingVerificationId,
    errorMessage,
    shipments: computed(() =>
      orders.value.filter((item) =>
        ['ready_to_ship', 'in_transit', 'partially_received', 'completed', 'exception'].includes(
          item.status,
        ),
      ),
    ),
    loadData,
    updateStatus,
    updateExceptionStatus,
    updateVerification,
  }
}
