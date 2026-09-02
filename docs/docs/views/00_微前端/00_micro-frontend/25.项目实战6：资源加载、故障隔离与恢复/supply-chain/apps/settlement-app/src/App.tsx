import { RouterProvider } from 'react-router-dom'
import type { RouterProviderProps } from 'react-router-dom'

import { SettlementProvider } from './SettlementContext'
export default function App({ router }: Pick<RouterProviderProps, 'router'>) {
  return (
    <SettlementProvider>
      <RouterProvider router={router} />
    </SettlementProvider>
  )
}
