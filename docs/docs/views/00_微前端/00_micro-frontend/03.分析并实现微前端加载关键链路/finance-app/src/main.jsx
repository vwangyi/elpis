import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { createFinanceRouter } from './router.jsx'
import './style.css'

const router = createFinanceRouter({ type: 'hash' })

createRoot(document.querySelector('#app')).render(<RouterProvider router={router} />)