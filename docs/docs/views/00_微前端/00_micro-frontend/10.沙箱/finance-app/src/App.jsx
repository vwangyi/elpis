import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { defaultFinancePath, financePages } from "./finance-pages.js";
import { changePendingCount, useSharedGlobalState } from "./global-state.jsx";
import { useHostNavigation } from "./host-navigation.jsx";

const navItems = [
  { to: "/finance/bills", label: "账单中心" },
  { to: "/finance/invoice/908", label: "开票处理" },
  { to: "/finance/refund/1024", label: "退款打款" },
];

export default function App() {
  const location = useLocation();
  const hostNavigation = useHostNavigation();
  const sharedGlobalState = useSharedGlobalState();
  const currentPage =
    financePages[location.pathname] ?? financePages[defaultFinancePath];

  useEffect(() => {
    document.title = `财务管理 - ${currentPage.title}`;
  }, [currentPage.title]);

  function notifyHostNavigation(path) {
    // [路由处理1:] 嵌入态点击财务内部路由时，通知主应用同步更新地址栏。
    if (hostNavigation.isEmbedded) {
      hostNavigation.navigate?.(path);
    }
  }

  function addFinanceTask() {
    changePendingCount(1);
  }

  return (
    <section className="module-shell">
      <header className="module-header">
        <div>
          <span className="module-badge">财务系统</span>
          <h1>财务管理</h1>
        </div>
        <div className="header-actions">
          <div className="module-status">
            待处理事项 {sharedGlobalState.pendingCount} 条
          </div>
          <button
            className="finance-action"
            type="button"
            onClick={addFinanceTask}
          >
            新增一条财务待办
          </button>
        </div>
      </header>

      <nav className="module-tabs">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => notifyHostNavigation(item.to)}
            className={({ isActive }) => `tab-link${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="module-content">
        <Outlet />
      </main>
    </section>
  );
}
