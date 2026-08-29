import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  qiankunWindow,
  renderWithQiankun,
} from "vite-plugin-qiankun/dist/helper";
import { createFinanceRouter } from "./router.jsx";
import "./style.css";

const routerFuture = { v7_startTransition: true };

let root = null;
let router = null;
let mountNode = null;

function render(props = {}) {
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  // router = createFinanceRouter();
  
  router = createFinanceRouter(
    qiankunWindow.__POWERED_BY_QIANKUN__
      ? { memory: true, initialPath: window.location.pathname || "/finance/bills" }
      : undefined
  );

  root = createRoot(mountNode);
  root.render(<RouterProvider router={router} future={routerFuture} />);
}

renderWithQiankun({
  bootstrap() {
    console.info("[finance-app] bootstrap");
  },
  mount(props) {
    render(props);
  },
  unmount() {
    root?.unmount();
    root = null;
    router = null;
    mountNode = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
