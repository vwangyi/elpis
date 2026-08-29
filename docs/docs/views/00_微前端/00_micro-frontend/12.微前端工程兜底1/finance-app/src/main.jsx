import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  qiankunWindow,
  renderWithQiankun,
} from "vite-plugin-qiankun/dist/helper";
import { bindGlobalState, unbindGlobalState } from "./global-state.jsx";
import { HostNavigationContext } from "./host-navigation.jsx";
import { createFinanceRouter } from "./router.jsx";
import "./style.css";

const routerFuture = { v7_startTransition: true };

let root = null;
let router = null;
let mountNode = null;

function render(props = {}) {
  bindGlobalState(props);

  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  const isEmbedded = qiankunWindow.__POWERED_BY_QIANKUN__;

  router = createFinanceRouter(
    isEmbedded
      ? {
          memory: true,
          initialPath: props.getCurrentPath?.() || props.defaultPath,
        }
      : undefined,
  );

  root = createRoot(mountNode);
  root.render(
    <HostNavigationContext.Provider
      value={{
        isEmbedded,
        // [路由处理1:] 财务子应用只发出导航请求，由主应用负责写浏览器地址栏。
        navigate: props.navigate,
      }}
    >
      <RouterProvider router={router} future={routerFuture} />
    </HostNavigationContext.Provider>,
  );
}

renderWithQiankun({
  bootstrap() {
    console.info("[finance-app] bootstrap");
  },
  mount(props) {
    render(props);
  },
  unmount() {
    unbindGlobalState();
    root?.unmount();
    root = null;
    router = null;
    mountNode = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
