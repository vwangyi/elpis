import { reactive } from 'vue'

export type MicroAppBadgeKey = 'fulfillment' | 'settlement'

export const microAppBadges = reactive<Record<MicroAppBadgeKey, number>>({
  fulfillment: 0,
  settlement: 0,
})

export function updateMicroAppBadge(app: MicroAppBadgeKey, count: number) {
  microAppBadges[app] = Math.max(0, Math.floor(count))
}

export function clearMicroAppBadge(app: MicroAppBadgeKey) {
  updateMicroAppBadge(app, 0)
}
