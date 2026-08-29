import { reactive } from 'vue'

export interface PlatformNotification {
  id: string
  title: string
  message: string
  actionLabel: string
  actionPath: string
}

export const platformNotifications = reactive<PlatformNotification[]>([])

export function pushPlatformNotification(notification: PlatformNotification) {
  platformNotifications.unshift(notification)
  if (platformNotifications.length > 3) platformNotifications.pop()
  window.setTimeout(() => dismissPlatformNotification(notification.id), 10_000)
}

export function dismissPlatformNotification(id: string) {
  const index = platformNotifications.findIndex((item) => item.id === id)
  if (index >= 0) platformNotifications.splice(index, 1)
}
