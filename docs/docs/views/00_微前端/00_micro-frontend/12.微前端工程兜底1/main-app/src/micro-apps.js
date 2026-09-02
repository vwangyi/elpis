import { nextTick, reactive } from "vue";
import {
  addGlobalUncaughtErrorHandler,
  loadMicroApp,
  prefetchApps,
  registerMicroApps,
  start,
} from "qiankun";
// 新重试方案需要用 single-spa 主动触发当前路由下的子应用调度。
import { triggerAppChange } from "single-spa";
import {
  createMicroAppStatusStore,
  MICRO_APP_STATUS,
} from "./micro-app-status.mjs";

const microApps = {
  order: {
    name: "order-app",
    label: "订单系统",
    entry: "//localhost:5174",
    activeRule: "/orders",
    defaultPath: "/orders/list",
  },
  finance: {
    name: "finance-app",
    label: "财务系统",
    entry: "//localhost:5175",
    activeRule: "/finance",
    defaultPath: "/finance/bills",
  },
};

const qiankunSandboxOptions = {
  sandbox: true,
  // sandbox: {
  //   experimentalStyleIsolation: true,
  // },
  // sandbox: {
  //   strictStyleIsolation: true,
  // },
};

// [加载时间过长演示代码] 下面这几个常量只用于课堂复现 timeout 提示。
// 正常访问时仍使用 12 秒超时；URL 带 ?demoFinanceTimeout=1 时，才切到 3 秒超时 + 5 秒 entry 延迟。
// const FINANCE_TIMEOUT_DEMO_PARAM = "demoFinanceTimeout";
// const DEFAULT_LOADING_TIMEOUT_MS = 12000;
// const DEMO_LOADING_TIMEOUT_MS = 3000;
// const DEMO_FINANCE_ENTRY_DELAY_MS = 5000;

let started = false;
let orderMicroApp = null;
let globalErrorHandlerRegistered = false;
// 新重试方案：先探测财务入口是否可访问，再允许 qiankun 加载财务子应用。
let financeLoadEnabled = false;

// financeCheckVersion的作用是处理并发。
// 比如用户连续点两次“重新加载”，或者路由快速变化，可能会同时发出多次 entry 探测。
let financeCheckVersion = 0;

// [加载时间过长演示代码] 判断当前访问是否打开了财务加载超时演示开关。
// function isFinanceTimeoutDemoEnabled() {
//   return new URLSearchParams(window.location.search).has(
//     FINANCE_TIMEOUT_DEMO_PARAM,
//   );
// }

// [加载时间过长演示代码] 演示模式下缩短 timeout，方便课堂快速看到“加载时间过长”提示。
// function getLoadingTimeoutMs() {
//   return isFinanceTimeoutDemoEnabled()
//     ? DEMO_LOADING_TIMEOUT_MS
//     : DEFAULT_LOADING_TIMEOUT_MS;
// }

// [加载时间过长演示代码] 模拟慢 entry 探测，不代表真实项目需要主动 sleep。
// function delay(ms) {
//   return new Promise((resolve) => {
//     window.setTimeout(resolve, ms);
//   });
// }

const statusStore = createMicroAppStatusStore({
  apps: microApps,
  // [加载时间过长演示代码] 默认12000ms超时，演示模式下缩短为3000ms。
  // timeoutMs: getLoadingTimeoutMs(),
  minLoadingMs: 1000,
  stateFactory: reactive,
});

export const microAppStatus = statusStore.state;
export { MICRO_APP_STATUS };

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

function createLoader(appName) {
  return (loading) => {
    if (loading) {
      statusStore.markLoading(appName);
      return;
    }

    statusStore.markReady(appName);
  };
}

function getCurrentAppName() {
  return getAppNameByPath(window.location.pathname);
}

// 新重试方案：封装财务路径判断和 entry 地址转换。
function isFinancePath(path) {
  return path.startsWith(microApps.finance.activeRule);
}

// getEntryUrl(entry)是把 //localhost:5175 这种 entry 转成完整 URL。
// 因为 fetch() 更适合拿完整地址：//localhost:5175  ->  http://localhost:5175/
function getEntryUrl(entry) {
  return new URL(entry, window.location.href).toString();
}

// [工程兜底补充] 让正在路上的财务 entry 探测失效。
// 场景：用户从财务加载态快速切到订单时，旧的异步探测结果不应该再触发 single-spa 调度。
function cancelFinanceLoadCheck() {
  financeCheckVersion += 1;
}

// 未明确携带子应用名称的异常，按当前路由归到正在使用的子应用。
function markCurrentAppFailed(error) {
  statusStore.markFailed(getCurrentAppName(), error);
}

// 接收子应用主动上报的业务异常，并整理成状态中心统一处理的 Error。
function markReportedAppFailed(event) {
  const { appName, message } = event.detail || {};
  statusStore.markFailed(
    appName || getCurrentAppName(),
    new Error(message || "业务服务异常"),
  );
}

// 集中安装框架层、业务层和浏览器层的错误入口。
function registerGlobalErrorHandler() {
  // setupQiankun() 可能被重复调用，避免同一个错误被多个重复监听器处理。
  if (globalErrorHandlerRegistered) return;

  // 框架层：接住 qiankun 提供的全局未捕获异常。
  addGlobalUncaughtErrorHandler((event) => {
    markCurrentAppFailed(event?.reason || event?.message || event);
  });

  // 业务层：接住子应用已经捕获、但需要主应用整块降级的业务异常。
  window.addEventListener("micro-app:business-error", markReportedAppFailed);

  // 浏览器层：补充接住财务页面中的同步异常和资源加载异常。
  window.addEventListener("error", (event) => {
    // 本节只演示财务子应用降级，避免把其他页面错误误记到财务状态。
    if (!window.location.pathname.startsWith("/finance")) return;
    event.preventDefault?.();
    markCurrentAppFailed(event.error || event.message || event);
  });

  // 浏览器层：补充接住财务页面中没有被处理的 Promise rejection。
  window.addEventListener("unhandledrejection", (event) => {
    if (!window.location.pathname.startsWith("/finance")) return;
    event.preventDefault?.();
    markCurrentAppFailed(event.reason || event);
  });

  // 标记监听已安装，后续初始化不再重复注册。
  globalErrorHandlerRegistered = true;
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

// [工程兜底补充-待打开] 判断 loadMicroApp 返回的订单实例是否已经真正挂载完成。
// single-spa 只有在 MOUNTED 状态才允许 update；如果还没挂载就 update，会出现 #32 报错。
// function isMountedMicroApp(microApp) {
//   return microApp?.getStatus?.() === "MOUNTED";
// }

// [工程兜底补充-待打开] 安全同步订单保活状态。
// 订单是手动 loadMicroApp 的保活实例，切换显示/隐藏时需要 update props；但 update 必须等实例 MOUNTED 后再调用。
// function updateOrderMicroApp(router, keepAliveActive) {
//   if (!isMountedMicroApp(orderMicroApp)) return;
//
//   orderMicroApp
//     .update?.(createOrderProps(router, keepAliveActive))
//     ?.catch?.((error) => {
//       // single-spa #32 表示 parcel 还没 mounted 时被 update。
//       // 这是保活同步的时序问题，不应该展示成“订单系统不可用”。
//       if (String(error?.message || error).includes("code=32")) return;
//       statusStore.markFailed("order", error);
//     });
// }

// 显示订单工作区：第一次进入时手动加载，后续进入时复用已经存在的 qiankun 实例。
function showOrderMicroApp(router) {
  if (!orderMicroApp) {
    // registerMicroApps 会在离开 activeRule 时自动 unmount；订单工作区要保活，所以改用 loadMicroApp 手动持有实例。
    statusStore.markLoading("order");
    orderMicroApp = loadMicroApp(
      {
        name: microApps.order.name,
        entry: microApps.order.entry,
        container: "#order-viewport",
        props: createOrderProps(router, true),
      },
      qiankunSandboxOptions,
    );
    orderMicroApp.mountPromise
      .then(() => statusStore.markReady("order"))
      .catch((error) => statusStore.markFailed("order", error));
    return;
  }

  // 已经加载过的订单子应用不重新创建，只把最新路径和激活状态同步进去。
  // 注意：update() 不负责隐藏页面，也不负责保住表单。它负责把“主应用状态变化”通知给已经保活的子应用。
  // 子应用收到 update() 后可以在生命周期里做一些处理，比如暂停轮询、恢复订阅或刷新数据。
  orderMicroApp.update?.(createOrderProps(router, true));
  // [工程兜底补充-待打开] 复现 single-spa #32 后，打开下面这行，并注释上一行直接 update。
  // updateOrderMicroApp(router, true);
}

// 隐藏订单工作区：只通知子应用进入失活状态，不销毁实例，这样页面里的表单状态才能保住。
function hideOrderMicroApp(router) {
  // 保活的关键点：切走时只通知订单进入失活状态，不调用 orderMicroApp.unmount()。
  orderMicroApp?.update?.(createOrderProps(router, false));
  // [工程兜底补充-待打开] 复现 single-spa #32 后，打开下面这行，并注释上一行直接 update。
  // updateOrderMicroApp(router, false);
}

// 主应用路由变化时调用：如果当前在订单路径就显示订单，否则隐藏订单。
function syncOrderKeepAlive(router, path) {
  if (getAppNameByPath(path) === "order") {
    showOrderMicroApp(router);
    return;
  }

  hideOrderMicroApp(router);
}

// 新重试方案：先由主应用探测财务 entry，探测成功后再交给 qiankun 加载。
async function ensureFinanceCanLoad(path) {
  if (!isFinancePath(path) || financeLoadEnabled) return;

  const checkVersion = ++financeCheckVersion;
  statusStore.markLoading("finance");

  try {
    // [加载时间过长演示代码] URL 带上 ?demoFinanceTimeout=1 时，故意把财务 entry 探测放慢。
    // 这样可以稳定看到 timeout 提示，同时后续 fetch 仍会继续执行，用来说明“超时只是体验判断，不代表服务已经失败”。
    // if (isFinanceTimeoutDemoEnabled()) {
    //   await delay(DEMO_FINANCE_ENTRY_DELAY_MS);
    // }

    const response = await fetch(getEntryUrl(microApps.finance.entry), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`财务系统入口请求失败：${response.status}`);
    }

    if (
      checkVersion !== financeCheckVersion ||
      !isFinancePath(window.location.pathname)
    ) {
      return;
    }

    financeLoadEnabled = true;
    await nextTick();
    await triggerAppChange();
  } catch (error) {
    if (checkVersion !== financeCheckVersion) return;

    financeLoadEnabled = false;
    statusStore.markFailed("finance", error);
  }
}

export function setupQiankun(router) {
  if (started) return;

  registerGlobalErrorHandler();

  // 刷新后首次进入也要先记录当前路径，否则侧边栏会不知道当前子系统的最近位置。
  rememberVisitedPath(router.currentRoute.value.path);

  registerMicroApps([
    {
      name: microApps.finance.name,
      entry: microApps.finance.entry,
      container: "#normal-subapp-viewport",
      // 旧方案：进入 /finance 时，qiankun 直接加载财务子应用。
      // activeRule: microApps.finance.activeRule,
      // 新方案：先等主应用确认财务 entry 可访问，再允许 qiankun 加载。
      activeRule: (location) =>
        financeLoadEnabled && isFinancePath(location.pathname),
      props: createRouteProps(router, microApps.finance),
      loader: createLoader("finance"),
    },
  ]);

  start({
    ...qiankunSandboxOptions,
    // 订单系统是 loadMicroApp 手动保活应用，不在 registerMicroApps 的注册列表里。
    // 所以这里关闭 start() 的注册应用预加载，下面改用 prefetchApps() 明确预加载订单资源。
    prefetch: false,
  });

  prefetchApps([{ name: microApps.order.name, entry: microApps.order.entry }]);

  // qiankun 启动后立刻按当前路由同步订单保活状态，解决直接打开 /orders/detail/2048 的场景。
  syncOrderKeepAlive(router, router.currentRoute.value.path);
  // 新方案：刷新后直接进入 /finance 时，也先探测财务 entry。
  void ensureFinanceCanLoad(router.currentRoute.value.path);

  router.afterEach((to) => {
    // 主应用路由变化后，在 afterEach 里记录路径。
    rememberVisitedPath(to.path);
    syncOrderKeepAlive(router, to.path);
    if (!isFinancePath(to.path)) {
      cancelFinanceLoadCheck();
    }
    // 新方案：每次进入财务路径时，先探测财务 entry。
    void ensureFinanceCanLoad(to.path);
  });

  started = true;
}

// 这个方法是兜底页“重新加载”按钮的统一入口。
// 它不直接判断页面该展示什么，而是把失败的子应用状态复位，并通过路由变化让 qiankun / loadMicroApp 重新走加载流程。
export async function retryMicroApp(router, appName) {
  const microApp = microApps[appName];
  // 防御处理：如果传进来的 appName 不在主应用登记表里，就没有可重试的子应用，直接结束。
  if (!microApp) return;

  // 先把当前子应用从 error / timeout 等失败态切回 loading 态。
  // 这样页面会立刻从“不可用兜底页”切到“正在重新连接”的业务反馈。
  statusStore.prepareRetry(appName);

  // 订单子应用是 loadMicroApp 手动持有的保活实例。
  // 普通路由切换不会销毁它，所以重试订单时必须先主动 unmount，再把引用清空。
  // 否则下一次进入订单路径时，showOrderMicroApp 会认为旧实例还在，只调用 update()，不会重新拉取子应用资源。
  if (appName === "order") {
    await orderMicroApp?.unmount?.();
    orderMicroApp = null;
  }

  // 重试时回到这个子系统上次停留的真实子路由，而不是固定跳默认首页。
  // 例如财务在 /finance/bills 失败，点击重试后仍然尝试恢复 /finance/bills。
  const targetPath = getLastVisitedPath(appName);

  // 如果当前不在目标子路由，直接跳过去即可。
  // 对财务来说，进入 /finance 会命中 registerMicroApps 的 activeRule，qiankun 会重新尝试加载。
  // 对订单来说，进入 /orders 会触发 afterEach 里的 syncOrderKeepAlive，进而重新创建刚才被清空的 orderMicroApp。
  if (router.currentRoute.value.path !== targetPath) {
    await router.push(targetPath);
    return;
  }

  // 新方案：财务重试时不跳订单，而是重新探测 entry，并原地触发 single-spa 调度。
  if (appName === "finance") {
    financeLoadEnabled = false;
    await ensureFinanceCanLoad(targetPath);
    return;
  }

  // 旧方案：当前已经在失败路径上时，先切到订单，再切回目标路径触发重新加载。
  // 原因是 Vue Router 对“跳转到当前相同路径”通常不会产生新的路由切换结果，qiankun 也就没有新的调度机会。
  // 所以这里先跳到一个确定存在的订单页，让当前失败子应用离开激活区间，再 nextTick 等 DOM / 路由状态完成更新，最后跳回目标路径重新触发加载。
  await router.replace(microApps.order.defaultPath);
  await nextTick();
  await router.push(targetPath);
}

export function getMicroApps() {
  return microApps;
}

// [工程兜底补充] 关闭当前兜底提示。
// 这里只是隐藏本次错误/超时提示，不把子应用标记成 ready；下一次错误上报仍会重新显示兜底层。
export function dismissMicroAppStatus(appName) {
  statusStore.dismissCurrentStatus(appName);
}
