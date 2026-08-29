import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router, NavLink, useRoutes } from "react-router-dom";
import { routes } from "./routes.jsx";
import "./style.css";

window.runtimeOwner = "finance-app";

function App() {
  const routeElement = useRoutes(routes);
  const [globalData, setGlobalData] = useState({
    theme: "light",
    riskMode: false,
    user: "本地用户",
  });

  useEffect(() => {
    const receiveGlobalData = (data) => {
      setGlobalData((current) => ({ ...current, ...data }));
    };

    window.microApp?.addGlobalDataListener(receiveGlobalData, true);
    return () => window.microApp?.removeGlobalDataListener(receiveGlobalData);
  }, []);

  return (
    <section className="finance-app">
      <header>
        <h2 className="child-shared-title">财务结算工作台</h2>
        <p>跟踪收款确认、发票开具和结算风险，保证财务链路稳定推进。</p>
      </header>

      <dl className="runtime-panel shared-scope-card">
        <div><dt>构建工具</dt><dd>Vite</dd></div>
        <div><dt>路由</dt><dd>hash</dd></div>
        <div><dt>window.runtimeOwner</dt><dd>{window.runtimeOwner}</dd></div>
        <div><dt>沙箱</dt><dd>iframe</dd></div>
        <div><dt>全局主题</dt><dd>{globalData.theme}</dd></div>
        <div><dt>风控模式</dt><dd>{globalData.riskMode ? "开启" : "关闭"}</dd></div>
      </dl>

      <nav className="sub-nav" aria-label="财务中心页面">
        <NavLink to="/settlement">结算概览</NavLink>
        <NavLink to="/invoices">发票任务</NavLink>
      </nav>

      {routeElement}
    </section>
  );
}

const root = createRoot(document.querySelector("#app"));

root.render(
  <Router>
    <App />
  </Router>,
);

window.unmount = () => {
  root.unmount();
};
