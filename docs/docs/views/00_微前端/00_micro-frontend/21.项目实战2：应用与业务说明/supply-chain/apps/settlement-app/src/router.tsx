import { createHashRouter } from 'react-router-dom'

import { Component as BatchDetailView } from './views/BatchDetailView'
import { Component as BatchesView } from './views/BatchesView'
import { Component as HomeView } from './views/HomeView'
import { Component as InvoicesView } from './views/InvoicesView'
import { Component as NotFoundView } from './views/NotFoundView'
import { Component as PaymentsView } from './views/PaymentsView'
import { Component as ReconciliationView } from './views/ReconciliationView'
import SettlementLayout from './views/SettlementLayout'

export const router = createHashRouter([
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
])
