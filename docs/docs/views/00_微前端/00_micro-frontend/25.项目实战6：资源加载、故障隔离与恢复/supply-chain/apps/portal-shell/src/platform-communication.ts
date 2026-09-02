import { getStoredTheme, resolveTheme } from '@supply-chain/design-tokens/theme'
import {
  connectThemeToBridge,
  createMicroBridge,
  type BusinessEvent,
} from '@supply-chain/micro-bridge'
import { hasSession } from '@supply-chain/auth-session'
import type { Router } from 'vue-router'

import { updateMicroAppBadge } from './micro-app-badges'
import { pushPlatformNotification } from './platform-notifications'
import type { PlatformNotification } from './platform-notifications'
import { apiClient } from './services/api'

interface FulfillmentSummary {
  openExceptions: number
  pendingVerifications: number
}

interface SettlementSummary {
  differenceCount: number
  pendingInvoiceCount: number
}

const initialTheme = getStoredTheme()

export const platformBridge = createMicroBridge({
  initialState: {
    theme: initialTheme,
    resolvedTheme: resolveTheme(initialTheme),
    badges: { fulfillment: 0, settlement: 0 },
  },
  onError(error, context) {
    console.error('[platform-bridge] listener failed', context, error)
  },
})

let stopPlatformCommunication: (() => void) | null = null

export async function refreshMicroAppBadges() {
  if (!hasSession()) return
  try {
    const [fulfillment, settlement] = await Promise.all([
      apiClient<FulfillmentSummary>('fulfillment/summary'),
      apiClient<SettlementSummary>('settlements/summary'),
    ])
    const badges = {
      fulfillment: fulfillment.openExceptions + fulfillment.pendingVerifications,
      settlement: settlement.differenceCount + settlement.pendingInvoiceCount,
    }
    updateMicroAppBadge('fulfillment', badges.fulfillment)
    updateMicroAppBadge('settlement', badges.settlement)
    platformBridge.setState({ badges })
  } catch (error) {
    console.warn('[platform-bridge] badge refresh failed', error)
  }
}

function notificationFor(event: BusinessEvent): PlatformNotification {
  switch (event.type) {
    case 'settlement.verification-created':
      return {
        id: event.id,
        title: '结算中心发起履约核实',
        message: `${event.payload.orderNo} · ${event.payload.batchNo}`,
        actionLabel: '进入履约核实',
        actionPath: '/fulfillment/verifications',
      }
    case 'fulfillment.verification-resolved':
      return {
        id: event.id,
        title: '履约核实已经完成',
        message: `${event.payload.orderNo} · ${event.payload.batchNo}`,
        actionLabel: '查看结算批次',
        actionPath: `/settlement/batches/${event.payload.settlementBatchId}`,
      }
    case 'fulfillment.completed':
      return {
        id: event.id,
        title: '履约完成，已进入结算',
        message: event.payload.orderNo,
        actionLabel: '查看结算任务',
        actionPath: '/settlement/batches',
      }
  }
  throw new Error(`Unsupported business event: ${String((event as BusinessEvent).type)}`)
}

export function startPlatformCommunication(_router: Router) {
  if (stopPlatformCommunication) return

  const disconnectTheme = connectThemeToBridge(platformBridge, true)
  const unsubscribeEvents = platformBridge.subscribeAll((event) => {
    pushPlatformNotification(notificationFor(event))
    void refreshMicroAppBadges()
  })
  const refreshWhenVisible = () => {
    if (document.visibilityState === 'visible') void refreshMicroAppBadges()
  }
  window.addEventListener('focus', refreshWhenVisible)
  document.addEventListener('visibilitychange', refreshWhenVisible)
  void refreshMicroAppBadges()

  stopPlatformCommunication = () => {
    disconnectTheme()
    unsubscribeEvents()
    window.removeEventListener('focus', refreshWhenVisible)
    document.removeEventListener('visibilitychange', refreshWhenVisible)
    stopPlatformCommunication = null
  }
}
