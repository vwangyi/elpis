import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import OrderExceptions from "./pages/OrderExceptions.vue";
import OrderList from "./pages/OrderList.vue";
import { connectMicroApp, disconnectMicroApp } from "./micro-bridge.js";
import "./style.css";

window.runtimeOwner = "order-app";

const baseRoute = window.__MICRO_APP_BASE_ROUTE__ || "/";
const routerHistory = createWebHistory(baseRoute);

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      redirect: "/list",
    },
    {
      path: "/list",
      component: OrderList,
    },
    {
      path: "/exceptions",
      component: OrderExceptions,
    },
  ],
});

const app = createApp(App);

connectMicroApp();
app.use(router).mount("#app");

window.unmount = () => {
  disconnectMicroApp();
  app.unmount();
  routerHistory.destroy();
};
