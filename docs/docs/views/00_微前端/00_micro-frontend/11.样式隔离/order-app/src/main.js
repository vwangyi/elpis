import "./public-path";
import { createApp } from "vue";
import { reactive } from "vue";
import { createMemoryHistory, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import { createOrderRouter } from "./router";
import "./style.css";

let app = null;
let router = null;
let mountNode = null;
let latestProps = {};

const sharedGlobalState = reactive({
  pendingCount: 0,
  lastUpdatedBy: "独立运行",
});

let setGlobalState = null;
let offGlobalStateChange = null;

function syncSharedGlobalState(state = {}) {
  if (typeof state.pendingCount === "number") {
    sharedGlobalState.pendingCount = state.pendingCount;
  }

  if (state.lastUpdatedBy) {
    sharedGlobalState.lastUpdatedBy = state.lastUpdatedBy;
  }
}

function bindGlobalState(props = {}) {
  setGlobalState = props.setGlobalState || null;
  offGlobalStateChange = props.offGlobalStateChange || null;

  props.onGlobalStateChange?.((state) => {
    syncSharedGlobalState(state);
  }, true);
}

function changePendingCount(delta) {
  const nextCount = Math.max(0, sharedGlobalState.pendingCount + delta);

  if (setGlobalState) {
    setGlobalState({
      pendingCount: nextCount,
      lastUpdatedBy: "order-app",
    });
    return;
  }

  syncSharedGlobalState({
    pendingCount: nextCount,
    lastUpdatedBy: "order-app",
  });
}

// 主应用通过 activePath 告诉订单 memory router 应该显示哪个页面；路径没变时不重复跳转。
async function syncActivePath(path) {
  if (!router || !path || router.currentRoute.value.fullPath === path) return;
  await router.push(path);
}

// 保活实例重新显示时，路由组件不一定重新创建，所以需要主动把标题恢复成订单当前页面。
function syncDocumentTitle() {
  const title = router?.currentRoute.value.meta.title;
  if (title) {
    document.title = `订单管理 - ${title}`;
  }
}

// 接收主应用传来的显示/隐藏状态；真实项目里可以在这里暂停轮询、恢复订阅或刷新数据。
function syncKeepAliveState(props = {}) {
  if (props.keepAliveActive === false) {
    console.info(
      "[order-app] keep alive inactive: pause polling or subscriptions here",
    );
    // 现在只是打印日志和恢复标题，没有真正暂停轮询、关闭订阅、停止定时器。
    // 所以在当前演示里，它更像是一个“生命周期信号”。
    // 真实项目里它会用来做这些事：
    // stopPolling();
    // pauseWebSocketMessageHandling();
    // stopChartResizeObserver();
    return;
  }

  if (props.keepAliveActive === true) {
    console.info(
      "[order-app] keep alive active: resume visible workspace work here",
    );
    // 真实项目里它会用来做这些事：
    // startPolling();
    // resumeWebSocketMessageHandling();
    // refreshVisiblePageData();
    syncDocumentTitle();
  }
}

async function render(props = {}) {
  console.log("props", props);
  latestProps = props;
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  const isEmbedded = window.__POWERED_BY_QIANKUN__;
  const initialPath = props.getCurrentPath?.() || props.defaultPath;

  // 嵌入主应用时使用 memory router，避免订单子应用直接改写浏览器 history.state。
  router = createOrderRouter(
    isEmbedded ? createMemoryHistory() : createWebHashHistory(),
  );

  router.afterEach((to) => {
    document.title = `订单管理 - ${to.meta.title}`;
  });

  app = createApp(App);
  // 把主应用传来的导航能力提供给订单页面里的 RouterLink 点击处理。
  app.provide("hostNavigation", {
    isEmbedded,
    navigate: props.navigate,
  });
  app.provide("sharedGlobalState", {
    state: sharedGlobalState,
    changePendingCount,
  });
  app.use(router);

  if (isEmbedded) {
    await syncActivePath(props.activePath || initialPath);
  }

  await router.isReady();
  app.mount(mountNode);
  syncKeepAliveState(props);
}

export async function bootstrap() {
  console.info("[order-app] bootstrap");
}

export async function mount(props = {}) {
  bindGlobalState(props);
  await render(props);
}

export async function unmount() {
  offGlobalStateChange?.();
  app?.unmount();
  app = null;
  router = null;
  mountNode = null;
  latestProps = {};
  setGlobalState = null;
  offGlobalStateChange = null;
}

export async function update(props = {}) {
  // loadMicroApp 复用订单实例时会走 update；这里接收主应用传来的最新路径和显示/隐藏状态。
  latestProps = {
    ...latestProps,
    ...props,
  };

  await syncActivePath(
    latestProps.activePath || latestProps.getCurrentPath?.(),
  );
  syncKeepAliveState(latestProps);
}

// 独立运行兜底
if (!window.__POWERED_BY_QIANKUN__) {
  void render();
}
