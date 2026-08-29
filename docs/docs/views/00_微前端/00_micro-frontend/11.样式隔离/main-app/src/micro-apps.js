import { loadMicroApp, registerMicroApps, start } from "qiankun";

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

// 第 12 课样式隔离演示：课堂上依次切换这三个配置，观察默认样式生命周期、选择器改写和 Shadow DOM。
const qiankunSandboxOptions = {
  // sandbox: true,
  // sandbox: {
  //   experimentalStyleIsolation: true,
  // },
  // sandbox: {
  //   strictStyleIsolation: true,
  // },
};

let started = false;
let orderMicroApp = null;

// 主应用保存每个子系统最后停留的真实 URL，用来实现“切回来还在上次子路由”。
const lastVisitedPaths = {
  order: microApps.order.defaultPath,
  finance: microApps.finance.defaultPath,
};

// 根据当前浏览器路径判断属于哪个子系统；这里用的是主应用分配给子系统的一级路径前缀。
function getAppNameByPath(path) {
  if (path.startsWith(microApps.finance.activeRule)) return "finance";
  return "order";
}

// 每次主应用路由变化后调用，把当前子系统的最近访问路径更新掉。
function rememberVisitedPath(path) {
  const appName = getAppNameByPath(path);
  lastVisitedPaths[appName] = path || microApps[appName].defaultPath;
}

// 侧边栏菜单会读这个值；如果没有访问记录，就退回子系统默认首页。
export function getLastVisitedPath(appName) {
  return lastVisitedPaths[appName] || microApps[appName]?.defaultPath || "/";
}

// 主应用传给子应用的统一导航协议：子应用只提出“我要去哪”，真正改地址栏的是主应用。
function createRouteProps(router, microApp) {
  return {
    defaultPath: microApp.defaultPath,
    getCurrentPath: () => window.location.pathname,
    navigate: (path) => {
      const targetPath = path || microApp.defaultPath;
      if (router.currentRoute.value.path !== targetPath) {
        void router.push(targetPath);
      }
    },
  };
}

// 订单子应用是保活实例，需要额外知道当前应该显示哪个内部路由，以及现在是显示态还是隐藏态。
function createOrderProps(router, keepAliveActive) {
  return {
    ...createRouteProps(router, microApps.order),
    activePath: getLastVisitedPath("order"),
    // keepAliveActive 不是 qiankun 内置字段，是主应用和订单子应用约定的显示/隐藏状态。
    keepAliveActive,
  };
}

// 显示订单工作区：第一次进入时手动加载，后续进入时复用已经存在的 qiankun 实例。
function showOrderMicroApp(router) {
  if (!orderMicroApp) {
    // registerMicroApps 会在离开 activeRule 时自动 unmount；订单工作区要保活，所以改用 loadMicroApp 手动持有实例。
    orderMicroApp = loadMicroApp(
      {
        name: microApps.order.name,
        entry: microApps.order.entry,
        container: "#order-viewport",
        props: createOrderProps(router, true),
      },
      qiankunSandboxOptions,
    );
    return;
  }

  // 已经加载过的订单子应用不重新创建，只把最新路径和激活状态同步进去。
  // 注意：update() 不负责隐藏页面，也不负责保住表单。它负责把“主应用状态变化”通知给已经保活的子应用。
  // 子应用收到 update() 后可以在生命周期里做一些处理，比如暂停轮询、恢复订阅或刷新数据。
  orderMicroApp.update?.(createOrderProps(router, true));
}

// 隐藏订单工作区：只通知子应用进入失活状态，不销毁实例，这样页面里的表单状态才能保住。
function hideOrderMicroApp(router) {
  // 保活的关键点：切走时只通知订单进入失活状态，不调用 orderMicroApp.unmount()。
  orderMicroApp?.update?.(createOrderProps(router, false));
}

// 主应用路由变化时调用：如果当前在订单路径就显示订单，否则隐藏订单。
function syncOrderKeepAlive(router, path) {
  if (getAppNameByPath(path) === "order") {
    showOrderMicroApp(router);
    return;
  }

  hideOrderMicroApp(router);
}

export function setupQiankun(router) {
  if (started) return;

  // 刷新后首次进入也要先记录当前路径，否则侧边栏会不知道当前子系统的最近位置。
  rememberVisitedPath(router.currentRoute.value.path);

  registerMicroApps([
    {
      name: microApps.finance.name,
      entry: microApps.finance.entry,
      container: "#normal-subapp-viewport",
      activeRule: microApps.finance.activeRule,
      props: createRouteProps(router, microApps.finance),
    },
  ]);

  start(qiankunSandboxOptions);

  // qiankun 启动后立刻按当前路由同步订单保活状态，解决直接打开 /orders/detail/2048 的场景。
  syncOrderKeepAlive(router, router.currentRoute.value.path);

  router.afterEach((to) => {
    // 主应用路由变化后，在 afterEach 里记录路径。
    rememberVisitedPath(to.path);
    syncOrderKeepAlive(router, to.path);
  });

  started = true;
}

export function getMicroApps() {
  return microApps;
}
