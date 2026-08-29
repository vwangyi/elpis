import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { defaultFinancePath, financePages } from "./finance-pages.js";

const navItems = [
  // [路由处理2:] NavLink 只写财务子应用内部路径，React Router 会自动拼上 /finance basename。
  { to: "/bills", label: "账单中心" },
  { to: "/invoice/908", label: "开票处理" },
  { to: "/refund/1024", label: "退款打款" },
];

export default function App() {
  const location = useLocation();
  const currentPage =
    financePages[location.pathname] ?? financePages[defaultFinancePath];

  useEffect(() => {
    document.title = `财务管理 - ${currentPage.title}`;
  }, [currentPage.title]);

  return (
    <section className="module-shell">
      <header className="module-header">
        <div>
          <span className="module-badge">财务系统</span>
          <h1>财务管理</h1>
        </div>
      </header>

      <nav className="module-tabs">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
