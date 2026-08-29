import { ThemeToggle } from '@supply-chain/ui-react'
import {
  FileSearch,
  Landmark,
  LayoutDashboard,
  ReceiptText,
  RefreshCcw,
  WalletCards,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const navigation = [
  { to: '/', label: '结算概览', icon: LayoutDashboard, end: true },
  { to: '/batches', label: '结算批次', icon: Landmark },
  { to: '/reconciliation', label: '对账差异', icon: FileSearch },
  { to: '/invoices', label: '发票管理', icon: ReceiptText },
  { to: '/payments', label: '付款跟踪', icon: WalletCards },
]

export default function SettlementLayout() {
  const isMicroApp = Boolean(qiankunWindow.__POWERED_BY_QIANKUN__)

  const navigationLinks = navigation.map(({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={Boolean(end)}
      className={({ isActive }) =>
        `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
      }
    >
      <Icon size={16} />
      {label}
    </NavLink>
  ))

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${isMicroApp ? '' : 'lg:grid lg:grid-cols-[248px_1fr]'}`}
    >
      {!isMicroApp && (
        <aside className="border-b border-border bg-card lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center gap-3 border-b border-border px-5">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <RefreshCcw size={19} />
            </span>
            <div>
              <p className="font-semibold">结算中心</p>
              <p className="text-xs text-muted-foreground">供应链业财平台</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1">
            {navigationLinks}
          </nav>
        </aside>
      )}
      <div className="min-w-0">
        {isMicroApp ? (
          <div className="border-b border-border bg-card px-4 lg:px-8">
            <div className="flex min-h-16 items-center gap-5 overflow-x-auto">
              <div className="hidden shrink-0 border-r border-border pr-5 md:block">
                <p className="text-xs text-muted-foreground">结算中心</p>
                <p className="text-sm font-medium">对账、开票与付款管理</p>
              </div>
              <nav className="flex min-w-max items-center gap-1 py-2">{navigationLinks}</nav>
            </div>
          </div>
        ) : (
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8">
            <div>
              <p className="text-xs text-muted-foreground">业财协同</p>
              <p className="text-sm font-medium">对账、开票与付款管理</p>
            </div>
            <ThemeToggle />
          </header>
        )}
        <Outlet />
      </div>
    </div>
  )
}
