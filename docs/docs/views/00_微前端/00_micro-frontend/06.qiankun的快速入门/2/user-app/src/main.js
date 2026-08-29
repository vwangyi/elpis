import "./public-path";
import { createApp } from "vue";
import { createWebHashHistory, createWebHistory } from "vue-router";
import App from "./App.vue";
import { createUserRouter } from "./router";
import "./style.css";

let app = null;
let router = null;
let mountNode = null;

async function render(props = {}) {
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  // [路由处理2:] 用户子应用和订单子应用一样，在 qiankun 中使用 history + /users base。
  const history = window.__POWERED_BY_QIANKUN__
    ? createWebHistory("/users")
    : createWebHashHistory();

  router = createUserRouter(history);

  router.afterEach((to) => {
    document.title = `用户管理 - ${to.meta.title}`;
  });

  app = createApp(App);
  app.use(router);

  await router.isReady();
  app.mount(mountNode);
}

export async function bootstrap() {
  console.info("[user-app] bootstrap");
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

if (!window.__POWERED_BY_QIANKUN__) {
  void render();
}
