import { createRouter } from "vue-router";
import OrderDetailView from "../views/OrderDetailView.vue";
import OrderListView from "../views/OrderListView.vue";
import OrderRefundView from "../views/OrderRefundView.vue";

const routes = [
  {
    // [路由处理2:] 子应用配置了 /orders base 后，内部路由只写 base 后面的部分。
    path: "/list",
    component: OrderListView,
    meta: { title: "订单列表" },
  },
  {
    path: "/detail/2048",
    component: OrderDetailView,
    meta: { title: "订单详情" },
  },
  {
    path: "/refund/1024",
    component: OrderRefundView,
    meta: { title: "退款处理" },
  },
  {
    path: "/",
    redirect: "/list",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/list",
  },
];

export function createOrderRouter(history) {
  return createRouter({
    history,
    routes,
  });
}
