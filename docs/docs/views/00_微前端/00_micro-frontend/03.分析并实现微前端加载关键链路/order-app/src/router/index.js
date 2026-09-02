import { createRouter } from 'vue-router'
import OrderDetailView from '../views/OrderDetailView.vue'
import OrderListView from '../views/OrderListView.vue'
import OrderRefundView from '../views/OrderRefundView.vue'

const routes = [
  {
    path: '/orders/list',
    component: OrderListView,
    meta: { title: '订单列表' },
  },
  {
    path: '/orders/detail/2048',
    component: OrderDetailView,
    meta: { title: '订单详情' },
  },
  {
    path: '/orders/refund/1024',
    component: OrderRefundView,
    meta: { title: '退款处理' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/orders/list',
  },
]

export function createOrderRouter(history) {
  return createRouter({
    history,
    routes,
  })
}