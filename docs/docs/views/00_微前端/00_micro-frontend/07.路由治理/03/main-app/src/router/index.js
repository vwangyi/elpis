import { createRouter, createWebHistory } from "vue-router";
import RoutePortal from "../components/RoutePortal.vue";

const routes = [
  {
    path: "/",
    redirect: "/orders/list",
  },
  {
    path: "/orders/:pathMatch(.*)*",
    component: RoutePortal,
    meta: {
      appName: "order",
    },
  },
  {
    path: "/users/:pathMatch(.*)*",
    component: RoutePortal,
    meta: {
      appName: "user",
    },
  },
  // [路由处理2:] React Router 冲突演示：主应用识别 /finance/*，qiankun 再按 activeRule 挂载财务子应用。
  {
    path: "/finance/:pathMatch(.*)*",
    component: RoutePortal,
    meta: {
      appName: "finance",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/orders/list",
  },
];

export function createHostRouter() {
  return createRouter({
    history: createWebHistory(),
    routes,
  });
}
