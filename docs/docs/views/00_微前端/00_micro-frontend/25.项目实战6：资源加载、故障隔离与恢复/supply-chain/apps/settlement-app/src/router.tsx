import { createMicroReactRouter } from '@supply-chain/micro-router/react'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

import { Component as BatchDetailView } from './views/BatchDetailView'
import { Component as BatchesView } from './views/BatchesView'
import { Component as HomeView } from './views/HomeView'
import { Component as InvoicesView } from './views/InvoicesView'
import { Component as NotFoundView } from './views/NotFoundView'
import { Component as PaymentsView } from './views/PaymentsView'
import { Component as ReconciliationView } from './views/ReconciliationView'
import SettlementLayout from './views/SettlementLayout'

const routes = [
  {
    path: '/',
    Component: SettlementLayout,
    children: [
      { index: true, Component: HomeView },
      { path: 'batches', Component: BatchesView },
      { path: 'batches/:id', Component: BatchDetailView },
      { path: 'reconciliation', Component: ReconciliationView },
      { path: 'invoices', Component: InvoicesView },
      { path: 'payments', Component: PaymentsView },
    ],
  },
  { path: '*', Component: NotFoundView },
]

export function createSettlementRouter() {
  return createMicroReactRouter({
    appName: 'settlementApp',
    base: '/settlement',
    routes,
    // Vite 子应用卸载后模块仍会缓存，使用插件首次捕获的代理窗口才能稳定识别再次挂载。
    embedded: Boolean(qiankunWindow.__POWERED_BY_QIANKUN__),
    window: qiankunWindow as unknown as Window,
    standalone: 'hash',
  })
}
