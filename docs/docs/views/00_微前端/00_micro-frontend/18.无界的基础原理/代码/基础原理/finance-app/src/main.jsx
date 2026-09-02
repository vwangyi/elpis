import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, NavLink, useRoutes } from "react-router-dom";
import { routes } from "./routes.jsx";
import "./style.css";

const baseurl = window.__MICRO_APP_BASE_URL__ || "/";
const container =
  window.__MICRO_APP_CONTAINER__?.querySelector("#app") ||
  document.querySelector("#app");

function App() {
  const routeElement = useRoutes(routes);

  return (
    <section className="finance-app">
      <header>
        <h2>财务结算工作台</h2>
        <p>跟踪收款确认、发票开具和结算风险，保证财务链路稳定推进。</p>
      </header>

      <nav className="sub-nav" aria-label="财务中心页面">
        <NavLink to="/settlement">结算概览</NavLink>
        <NavLink to="/invoices">发票任务</NavLink>
      </nav>

      {routeElement}
    </section>
  );
}

createRoot(container).render(
  <Router basename={baseurl}>
    <App />
  </Router>,
);
