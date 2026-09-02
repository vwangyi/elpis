import { registerMicroApps, start } from 'qiankun'

let started = false

export function startMicroApps() {
  if (started) return

  registerMicroApps([
    {
      name: 'fulfillmentApp',
      entry: '//localhost:5174',
      container: '#micro-app-container',
      activeRule: '/fulfillment',
    },
    {
      name: 'settlementApp',
      entry: '//localhost:5175',
      container: '#micro-app-container',
      activeRule: '/settlement',
    },
  ])

  start({ prefetch: false })
  started = true
}
