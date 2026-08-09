import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView/HomeView.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/files-upload',
    children: [
      {
        path: 'files-upload',
        name: 'FilesUpload',
        meta: { title: '文件上传' },
        component: () => import('@/views/FilesUpload/FilesUpload.vue')
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '虚拟列表' },
        component: () => import('@/views/VirtualList/VirtualList.vue')
      }
    ]
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
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
