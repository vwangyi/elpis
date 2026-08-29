import "./public-path";
import { createApp } from "vue";
import { createWebHashHistory, createMemoryHistory } from "vue-router";
import App from "./App.vue";
import { createOrderRouter } from "./router";
import "./style.css";

let app = null;
let router = null;
let mountNode = null;

async function render(props = {}) {
  console.log("----", props)
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  // router = createOrderRouter(createWebHashHistory());

  const history = window.__POWERED_BY_QIANKUN__
    ? createMemoryHistory()
    : createWebHashHistory();

  router = createOrderRouter(history);

  if(window.__POWERED_BY_QIANKUN__){
    router.push(window.location.pathname || "/orders/list")
  }

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
