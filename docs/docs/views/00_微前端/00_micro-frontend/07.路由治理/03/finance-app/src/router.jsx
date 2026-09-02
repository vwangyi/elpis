import { Navigate, createBrowserRouter } from "react-router-dom";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";
import App from "./App.jsx";
import { defaultFinancePath } from "./finance-pages.js";
import BillsView from "./views/BillsView.jsx";
import InvoiceView from "./views/InvoiceView.jsx";
import RefundView from "./views/RefundView.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={defaultFinancePath} replace />,
      },
      {
        path: "/bills",
        element: <BillsView />,
      },
      {
        path: "/invoice/908",
        element: <InvoiceView />,
      },
      {
        path: "/refund/1024",
        element: <RefundView />,
      },
    ],
  },
];

// [路由处理2:] React Router 冲突修复演示：
// React Router 写入的 history.state 默认是 { usr, key, idx }，会覆盖 Vue Router 依赖的
// back/current/forward/position/replaced/scroll。主应用仍然是 Vue Router 时，点击主菜单会继续读取
// Vue Router 的这些字段，所以这里给 React Router 一个“代理 window”，拦截它对 history.state 的写入。
function createStatePreservingWindow() {
  // 独立运行财务项目时，不需要照顾主应用的 Vue Router，直接使用真实 window。
  if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    return window;
  }

  const browserHistory = window.history;

  // historyProxy 的作用：看起来还是浏览器 history，但 pushState/replaceState 会先合并状态。
  // React Router 只知道自己在调用 window.history；它不知道这里已经被我们加了一层兼容处理。
  const historyProxy = {
    get length() {
      return browserHistory.length;
    },
    get state() {
      return browserHistory.state;
    },
    go: browserHistory.go.bind(browserHistory),
    back: browserHistory.back.bind(browserHistory),
    forward: browserHistory.forward.bind(browserHistory),
    pushState(state, title, url) {
      // pushState 表示新增一条历史记录，例如从 /finance/bills 进入 /finance/invoice/908。
      browserHistory.pushState(
        createMergedHistoryState(state, url, false),
        title,
        url,
      );
    },
    replaceState(state, title, url) {
      // replaceState 表示替换当前历史记录，例如 React Router 初始化或重定向时会用到。
      browserHistory.replaceState(
        createMergedHistoryState(state, url, true),
        title,
        url,
      );
    },
  };

  // React Router 支持传入自定义 window。这里除了 history 之外，其它属性都继续转发给真实 window。
  return new Proxy(window, {
    get(target, prop) {
      if (prop === "history") {
        return historyProxy;
      }
      const value = target[prop];
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

function createMergedHistoryState(state, url, replaced) {
  // currentState 是当前历史记录已有的 state，里面可能已经有 Vue Router 写入的字段。
  const currentState = window.history.state ?? {};

  // url 是 React Router 准备跳转的目标地址；没有传 url 时，就退回当前地址栏地址。
  const targetUrl = new URL(url || window.location.href, window.location.href);
  const currentPath = targetUrl.pathname + targetUrl.search + targetUrl.hash;

  // previousPath 用来生成 Vue Router 需要的 back 字段。
  // 如果当前 state 已经有 current，就沿用；否则用地址栏当前路径兜底。
  const previousPath =
    typeof currentState.current === "string"
      ? currentState.current
      : window.location.pathname +
        window.location.search +
        window.location.hash;

  // position 是 Vue Router 用来判断历史栈顺序的字段；React Router 没有这个字段，所以要补上。
  const previousPosition =
    typeof currentState.position === "number"
      ? currentState.position
      : window.history.length - 1;

  return {
    // 先保留原有 state，避免丢掉主应用或 Vue 子应用已经写进去的信息。
    ...currentState,

    // 再放入 React Router 自己的 usr/key/idx，保证 React Router 自己也能正常工作。
    ...state,

    // replaceState 不新增历史记录，back 沿用旧值；pushState 新增历史记录，back 指向跳转前页面。
    back: replaced ? (currentState.back ?? null) : previousPath,

    // current 必须是完整浏览器路径，例如 /finance/invoice/908，不能只剩 React 内部概念。
    current: currentPath,

    // 新跳转后暂时没有 forward。
    forward: null,

    // 保留这次写入到底是 replace 还是 push，和 Vue Router 的字段语义对齐。
    replaced,

    // replace 不改变位置；push 在历史栈中前进一步。
    position: replaced ? previousPosition : previousPosition + 1,

    // scroll 字段也保留给 Vue Router，避免后续滚动恢复逻辑读不到字段。
    scroll: currentState.scroll ?? null,
  };
}

export function createFinanceRouter() {
  return createBrowserRouter(routes, {
    // [路由处理2:] basename 和主应用 activeRule 保持一致，最终 URL 仍然是 /finance/xxx。
    basename: qiankunWindow.__POWERED_BY_QIANKUN__ ? "/finance" : "/",
    // 把带 history 代理的 window 交给 React Router。
    // window: createStatePreservingWindow(),
  });
}
