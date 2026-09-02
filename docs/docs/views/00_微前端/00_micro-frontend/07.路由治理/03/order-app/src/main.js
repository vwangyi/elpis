import "./public-path";
import { createApp } from "vue";
import { createWebHashHistory, createWebHistory } from "vue-router";
import App from "./App.vue";
import { createOrderRouter } from "./router";
import "./style.css";

let app = null;
let router = null;
let mountNode = null;

async function render(props = {}) {
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  // [路由处理2:] 嵌入主应用时使用 history，并把订单子应用限定在 /orders 命名空间下。
  const history = window.__POWERED_BY_QIANKUN__
    ? createWebHistory("/orders")
    : createWebHashHistory();

  router = createOrderRouter(history);

  router.afterEach((to) => {
    document.title = `订单管理 - ${to.meta.title}`;
  });

  app = createApp(App);
  app.use(router);

  await router.isReady();
  app.mount(mountNode);
}

export async function bootstrap() {
  console.info("[order-app] bootstrap");
}

export async function mount(props = {}) {
  await render(props);
}

export async function unmount() {
  app?.unmount();
  app = null;
  router = null;
  mountNode = null;
}

// 独立运行兜底
if (!window.__POWERED_BY_QIANKUN__) {
  void render();
}
