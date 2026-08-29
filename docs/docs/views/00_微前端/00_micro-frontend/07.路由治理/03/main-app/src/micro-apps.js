import { registerMicroApps, start } from "qiankun";
const microApps = {
  order: {
    name: "order-app",
    label: "订单子应用",
    entry: "//localhost:5174",
    activeRule: "/orders",
    defaultPath: "/orders/list",
  },
  user: {
    name: "user-app",
    label: "用户子应用",
    entry: "//localhost:5176",
    activeRule: "/users",
    defaultPath: "/users/list",
  },
  // [路由处理2:] React Router 冲突演示：先把财务子应用接入主应用，但 finance-app 的 history.state 兼容层暂时不开。
  finance: {
    name: "finance-app",
    label: "财务子应用",
    entry: "//localhost:5175",
    activeRule: "/finance",
    defaultPath: "/finance/bills",
  },
};

let started = false;

export function setupQiankun() {
  if (started) return;

  registerMicroApps([
    {
      name: microApps.order.name,
      entry: microApps.order.entry,
      container: "#subapp-viewport",
      activeRule: microApps.order.activeRule,
    },
    {
      name: microApps.user.name,
      entry: microApps.user.entry,
      container: "#subapp-viewport",
      activeRule: microApps.user.activeRule,
    },
    // [路由处理2:] React Router 冲突演示：注册 React 财务子应用，用来观察 React Router 写 history.state 后的差异。
    {
      name: microApps.finance.name,
      entry: microApps.finance.entry,
      container: "#subapp-viewport",
      activeRule: microApps.finance.activeRule,
    },
  ]);

  start();

  started = true;
}

export function getMicroApps() {
  return microApps;
}
