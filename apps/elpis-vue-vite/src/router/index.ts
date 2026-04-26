import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView/HomeView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
