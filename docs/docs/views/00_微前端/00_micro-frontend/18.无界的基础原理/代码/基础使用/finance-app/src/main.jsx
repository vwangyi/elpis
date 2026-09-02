import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, NavLink, useRoutes } from "react-router-dom";
import { routes } from "./routes.jsx";
import "./style.css";

let root;

function FinanceApp() {
  const routeElement = useRoutes(routes);
  const [operationNotice, setOperationNotice] = useState("暂无新的运营通知");
  const context = window.$wujie?.props || {
    name: "本地财务人员",
    role: "财务专员",
    currency: "CNY",
  };

  useEffect(() => {
    const receiveOperationNotice = (notice) => {
      setOperationNotice(notice.content);
    };

    window.$wujie?.bus.$on("host:operation-notice", receiveOperationNotice);
    return () => {
      window.$wujie?.bus.$off("host:operation-notice", receiveOperationNotice);
    };
  }, []);

  return (
    <section className="finance-app">
      <header className="finance-header">
        <div>
          <span>财务运营</span>
          <h2>财务结算工作台</h2>
          <p>跟踪收款确认、发票开具和结算风险，保证财务链路稳定推进。</p>
        </div>
        <dl className="operator-card">
          <div><dt>负责人</dt><dd>{context.name}</dd></div>
          <div><dt>结算币种</dt><dd>{context.currency}</dd></div>
        </dl>
      </header>

      <p className="operation-notice" role="status">
        <strong>运营通知</strong>
        {operationNotice}
      </p>

      <nav className="sub-nav" aria-label="财务中心页面">
        <NavLink to="/settlement">结算概览</NavLink>
        <NavLink to="/invoices">发票任务</NavLink>
      </nav>

      {routeElement}
    </section>
  );
}

function mount() {
  if (root) return;
  root = createRoot(document.querySelector("#app"));
  root.render(
    <BrowserRouter>
      <FinanceApp />
    </BrowserRouter>,
  );
}

function unmount() {
  root?.unmount();
  root = undefined;
}

if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = mount;
  window.__WUJIE_UNMOUNT = unmount;
  window.__WUJIE.mount();
} else {
  mount();
}
