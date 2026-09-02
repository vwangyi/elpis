import { registerMicroApps, start } from "qiankun";
const microApps = {
  order: {
    name: "order-app",
    label: "订单子应用",
    entry: "//localhost:5174",
    activeRule: "/orders",
    defaultPath: "/orders/list",
  },
  finance: {
    name: "finance-app",
    label: "财务子应用",
    entry: "//localhost:5175",
    activeRule: "/finance",
    defaultPath: "/finance/bills",
  },
};

let started = false;

export function setupQiankun(){
  if(started) return;

  registerMicroApps([
    {
      name: microApps.order.name,
      entry: microApps.order.entry,
      container: "#subapp-viewport",
      activeRule: microApps.order.activeRule,
      props:{
        defaultPath: microApps.order.defaultPath,
        activeRule: microApps.order.activeRule,
        initialPath: "helloApp",
        abc: "abc",
      }
    },
    {
      name: microApps.finance.name,
      entry: microApps.finance.entry,
      container: "#subapp-viewport",
      activeRule: microApps.finance.activeRule
    },
  ]);

  start();

  started = true;
}

export function getMicroApps() {
  return microApps;
}