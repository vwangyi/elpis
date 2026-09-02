import "./public-path";
import { createApp } from "vue";
import { createMemoryHistory, createWebHashHistory } from "vue-router";
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

  const isEmbedded = window.__POWERED_BY_QIANKUN__;
  const initialPath = props.getCurrentPath?.() || props.defaultPath;

  // [路由处理1:] 嵌入主应用时使用 memory router，避免订单子应用直接改写浏览器 history.state。
  router = createOrderRouter(
    isEmbedded ? createMemoryHistory() : createWebHashHistory(),
  );

  router.afterEach((to) => {
    document.title = `订单管理 - ${to.meta.title}`;
  });

  app = createApp(App);
  // [路由处理1:] 把主应用传来的导航能力提供给订单页面里的 RouterLink 点击处理。
  app.provide("hostNavigation", {
    isEmbedded,
    navigate: props.navigate,
  });
  app.use(router);

  if (isEmbedded) {
    await router.push(initialPath);
  }

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
