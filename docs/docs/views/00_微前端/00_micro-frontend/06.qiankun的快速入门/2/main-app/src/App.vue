<script setup>
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { getMicroApps } from "./micro-apps";

const route = useRoute();
const microApps = getMicroApps();

const menuItems = [
  microApps.order,
  microApps.user,
  // [路由处理2:] React Router 冲突演示：打开财务入口，先复现 React Router 和 Vue Router 共享 history.state 的问题。
  microApps.finance,
].filter(Boolean);

const currentApp = computed(() => {
  const browserPath = window.location.pathname;

  if (
    (route.path.startsWith("/users") || browserPath.startsWith("/users")) &&
    microApps.user
  ) {
    return microApps.user;
  }
  // [路由处理2:] React Router 冲突演示：让主应用菜单能正确高亮财务子应用。
  if (
    (route.path.startsWith("/finance") || browserPath.startsWith("/finance")) &&
    microApps.finance
  ) {
    return microApps.finance;
  }
  return microApps.order;
});

// [路由处理2:] 兜底修复演示：默认先注释，让学生先看到“只做 History + Base 配置”时的跨应用后退问题。
// 讲解问题原因后，再取消下面这段代码和模板里的 @click，即可修复跨子应用后退时主应用误读内部路径的问题。
// normalizeCurrentHistoryStateForHost 的作用：
// 在“点击主应用菜单、准备离开当前子应用”之前，把当前历史记录整理成主应用能识别的完整路径。
// 例如当前地址栏是 /orders/detail/2048，但子应用 state.current 可能是 /detail/2048；
// 这里会把 current 改成 /orders/detail/2048，避免后退时主应用把 /detail/2048 当成未知路由。
// function normalizeCurrentHistoryStateForHost() {
//   // 第一步：取出当前浏览器历史记录里的 state。
//   // Vue Router 会把 back/current/forward/position 等信息写在这里。
//   const state = window.history.state;

//   // 第二步：取地址栏里的真实完整路径。
//   // 这个路径一定带有子应用前缀，比如 /orders/detail/2048 或 /users/profile/1001。
//   const browserPath =
//     window.location.pathname + window.location.search + window.location.hash;

//   // 第三步：根据地址栏判断当前属于哪个子应用命名空间。
//   // currentBase 会是 /orders、/users，或者空字符串。
//   const currentBase = getCurrentMicroAppBase(browserPath);

//   // 如果没有 state，说明当前历史记录没有可整理的信息；
//   // 如果 currentBase 为空，说明当前地址不属于已知子应用，也不需要处理。
//   if (!state || !currentBase) {
//     return;
//   }

//   // 第四步：只替换当前这条历史记录的 state，不新增历史记录，也不改变地址栏。
//   // back/current/forward 都整理成主应用能看懂的完整路径。
//   window.history.replaceState(
//     {
//       // 先保留 Vue Router 原本写入的 position、replaced、scroll 等字段。
//       ...state,

//       // back/forward 可能还是 /list、/detail/2048 这种子应用内部路径，所以需要补 base。
//       back: normalizeHistoryPath(state.back, currentBase),

//       // current 直接使用地址栏完整路径，因为当前页面就是地址栏正在显示的页面。
//       current: browserPath,

//       // forward 同理，如果是内部路径，也补成完整路径。
//       forward: normalizeHistoryPath(state.forward, currentBase),
//     },
//     "",
//     // 第三个参数继续传当前地址，确保 replaceState 只更新 state，不跳转页面。
//     browserPath,
//   );
// }
//
// getCurrentMicroAppBase 的作用：
// 根据当前地址栏路径判断“当前页面属于哪个子应用的 base”。
// 后面补全 /list、/detail/2048 这类内部路径时，要靠这个 base 判断应该补 /orders 还是 /users。
// function getCurrentMicroAppBase(path) {
//   // 当前页面在订单子应用命名空间下。
//   if (path.startsWith("/orders")) {
//     return "/orders";
//   }

//   // 当前页面在用户子应用命名空间下。
//   if (path.startsWith("/users")) {
//     return "/users";
//   }

//   // [路由处理2:] React Router 冲突修复演示：打开财务兼容修复时，再让主应用识别 /finance base。
//   if (path.startsWith("/finance")) {
//     return "/finance";
//   }

//   // 不属于任何已知子应用时返回空字符串，外层函数会直接跳过处理。
//   return "";
// }
//
// normalizeHistoryPath 的作用：
// 把子应用内部路径转换成主应用能识别的完整路径。
// 例如在订单子应用里，/detail/2048 会被转换成 /orders/detail/2048。
// function normalizeHistoryPath(path, currentBase) {
//   // back 或 forward 可能是 null/undefined，非字符串不需要处理。
//   if (typeof path !== "string") {
//     return path;
//   }

//   // 如果已经是完整路径，就原样返回，避免重复拼成 /orders/orders/list。
//   if (path.startsWith("/orders") || path.startsWith("/users") || path.startsWith("/finance")) {
//     return path;
//   }

//   // 剩下的就是 /list、/detail/2048、/profile/1001 这类内部路径，补上当前子应用 base。
//   return `${currentBase}${path}`;
// }
</script>

<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="menu-list">
        <!-- [路由处理2:] 兜底修复演示：讲解完问题后，在 RouterLink 上恢复 @click="normalizeCurrentHistoryStateForHost"。 -->
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          class="menu-button"
          :class="{ active: currentApp.name === item.name }"
          :to="item.defaultPath"
        >
          <strong>{{ item.label }}</strong>
        </RouterLink>
      </div>
    </aside>

    <main class="workspace">
      <RouterView />
    </main>
  </div>
</template>
