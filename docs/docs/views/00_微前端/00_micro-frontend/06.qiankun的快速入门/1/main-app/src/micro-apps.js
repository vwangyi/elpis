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

function createRouteProps(router, microApp) {
  return {
    defaultPath: microApp.defaultPath,
    getCurrentPath: () => window.location.pathname,
    // [路由处理1:] 子应用只发起导航请求，真正写浏览器 history 的动作统一交给主应用 Vue Router。
    navigate: (path) => {
      const targetPath = path || microApp.defaultPath;
      if (router.currentRoute.value.path !== targetPath) {
        void router.push(targetPath);
      }
    },
  };
}

export function setupQiankun(router) {
  if (started) return;

  registerMicroApps([
    {
      name: microApps.order.name,
      entry: microApps.order.entry,
      container: "#subapp-viewport",
      activeRule: microApps.order.activeRule,
      props: createRouteProps(router, microApps.order),
    },
    {
      name: microApps.finance.name,
      entry: microApps.finance.entry,
      container: "#subapp-viewport",
      activeRule: microApps.finance.activeRule,
      props: createRouteProps(router, microApps.finance),
    },
  ]);

  start();

  started = true;
}

export function getMicroApps() {
  return microApps;
}
