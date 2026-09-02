import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/micro/order/list",
    },
    {
      path: "/micro/order/:childPath(.*)*",
      name: "order",
      component: { template: "<div />" },
    },
    {
      path: "/micro/finance",
      name: "finance",
      component: { template: "<div />" },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/micro/order/list",
    },
  ],
});
