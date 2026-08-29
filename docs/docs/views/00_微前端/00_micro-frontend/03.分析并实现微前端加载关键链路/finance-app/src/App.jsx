import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { defaultFinancePath, financePages } from './finance-pages'

const navItems = [
  { to: '/finance/bills', label: '账单中心' },
  { to: '/finance/invoice/908', label: '开票处理' },
  { to: '/finance/refund/1024', label: '退款打款' },
]

export default function App({ hostApi }) {
  const location = useLocation()
  const currentPage = financePages[location.pathname] ?? financePages[defaultFinancePath]

  useEffect(() => {
    if (!hostApi) {
      document.title = `财务管理 - ${currentPage.title}`
    }

    hostApi?.onChildRouteChange?.({
      path: location.pathname,
      route: `#${location.pathname}`,
    })
  }, [currentPage.title, hostApi, location.pathname])

  return (
    <section className="module-shell">
      <header className="module-header">
        <div>
          <span className="module-badge">财务系统</span>
          <h1>财务管理</h1>
          <p>负责账单、开票和退款打款流程。</p>
        </div>
        <div className="module-status">当前页面：{currentPage.title}</div>
      </header>

      <nav className="module-tabs">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `tab-link${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="module-content">
        <Outlet />
      </main>
    </section>
  )
}