import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dynamic-segmented-demo',
    name: 'DynamicSegmentedDemo',
    component: () => import('@/views/VirtualList/DynamicSegmentedDemo.vue')
  },
  {
    path: '/segmented-demo',
    name: 'SegmentedDemo',
    component: () => import('@/views/VirtualList/SegmentedDemo.vue')
  },
  {
    path: '/virtual-list',
    name: 'VirtualList',
    component: () => import('@/views/VirtualList/VirtualList.vue')
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
