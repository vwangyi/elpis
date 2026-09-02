import { createMicroVueHistory } from '@supply-chain/micro-router/vue'
import { createRouter, createWebHistory } from 'vue-router'

import FulfillmentLayout from './views/FulfillmentLayout.vue'

export function createFulfillmentRouter() {
  return createRouter({
    history: createMicroVueHistory({
      appName: 'fulfillmentApp',
      base: '/fulfillment',
      standalone: () => createWebHistory(),
    }),
    routes: [
      {
        path: '/',
        component: FulfillmentLayout,
        children: [
          { path: '', name: 'fulfillment-home', component: () => import('./views/HomeView.vue') },
          { path: 'orders', name: 'orders', component: () => import('./views/OrdersView.vue') },
          {
            path: 'orders/:id',
            name: 'order-detail',
            component: () => import('./views/OrderDetailView.vue'),
          },
          {
            path: 'shipments',
            name: 'shipments',
            component: () => import('./views/ShipmentsView.vue'),
          },
          {
            path: 'plans/new',
            name: 'fulfillment-plan-form',
            component: () => import('./views/FulfillmentPlanFormView.vue'),
          },
          {
            path: 'exceptions',
            name: 'exceptions',
            component: () => import('./views/ExceptionsView.vue'),
          },
          {
            path: 'verifications',
            name: 'verifications',
            component: () => import('./views/VerificationsView.vue'),
          },
        ],
      },
      { path: '/:pathMatch(.*)*', component: () => import('./views/NotFoundView.vue') },
    ],
    scrollBehavior: () => ({ top: 0 }),
  })
}
