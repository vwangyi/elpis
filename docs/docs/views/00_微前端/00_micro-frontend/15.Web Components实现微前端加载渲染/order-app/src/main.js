import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";

const baseurl = window.__MICRO_APP_BASE_URL__ || "/";
const container =
  window.__MICRO_APP_CONTAINER__?.querySelector("#app") ||
  document.querySelector("#app");

const router = createRouter({
  history: createWebHistory(baseurl),
  routes: [
    {
      path: "/",
      redirect: "/list",
    },
    {
      path: "/list",
      component: () => import("./pages/OrderList.vue"),
    },
    {
      path: "/exceptions",
      component: () => import("./pages/OrderExceptions.vue"),
    },
  ],
});

createApp(App).use(router).mount(container);
