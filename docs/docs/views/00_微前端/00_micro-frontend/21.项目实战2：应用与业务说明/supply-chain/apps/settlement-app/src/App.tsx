import { RouterProvider } from 'react-router-dom'

import { SettlementProvider } from './SettlementContext'
import { router } from './router'

export default function App() {
  return (
    <SettlementProvider>
      <RouterProvider router={router} />
    </SettlementProvider>
  )
}
