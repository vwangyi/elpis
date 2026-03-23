import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/pages/HomeView/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/pages/DemoView/DemoView.vue')
  },
  {
    path: '/user-agreement',
    name: 'UserAgreement',
    component: () => import('@/pages/UserAgreement/UserAgreement.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

export default router;
