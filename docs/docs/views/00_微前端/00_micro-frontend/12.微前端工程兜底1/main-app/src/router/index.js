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
