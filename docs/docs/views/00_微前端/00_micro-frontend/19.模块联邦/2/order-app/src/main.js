import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import OrderExceptions from "./pages/OrderExceptions.vue";
import OrderList from "./pages/OrderList.vue";
import { connectHost, disconnectHost } from "./micro-bridge.js";
import "./style.css";

const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    { path: "/", redirect: "/list" },
    { path: "/list", component: OrderList },
    { path: "/exceptions", component: OrderExceptions },
  ],
});

connectHost();
createApp(App).use(router).mount("#app");

window.addEventListener("beforeunload", disconnectHost, { once: true });
