import {
  createHashRouter,
  createMemoryRouter,
  Navigate,
} from 'react-router-dom'
import App from './App.jsx'
import { defaultFinancePath } from './finance-pages'
import BillsView from './views/BillsView.jsx'
import InvoiceView from './views/InvoiceView.jsx'
import RefundView from './views/RefundView.jsx'

function getRoutes(hostApi) {
  return [
    {
      path: '/',
      element: <App hostApi={hostApi} />,
      children: [
        {
          index: true,
          element: <Navigate to={defaultFinancePath} replace />,
        },
        {
          path: 'finance/bills',
          element: <BillsView />,
        },
        {
          path: 'finance/invoice/908',
          element: <InvoiceView />,
        },
        {
          path: 'finance/refund/1024',
          element: <RefundView />,
        },
      ],
    },
  ]
}

export function createFinanceRouter({ type, hostApi, initialPath = defaultFinancePath } = {}) {
  const routes = getRoutes(hostApi)

  if (type === 'memory') {
    return createMemoryRouter(routes, {
      initialEntries: [initialPath],
    })
  }

  return createHashRouter(routes)
}