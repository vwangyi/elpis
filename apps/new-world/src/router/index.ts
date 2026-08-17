import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView/HomeView.vue';

export const routes = [
  {
    path: '/',
    redirect: '/demo',
    component: HomeView
  },
  {
    path: '/demo',
    name: 'DemoView',
    component: () => import('@/views/DemoView/DemoView.vue'),
    redirect: '/demo/files-upload',
    children: [
      {
        path: 'files-upload',
        name: 'FilesUpload',
        meta: { title: '文件上传' },
        component: () => {
          return import('@/views/DemoView/views/FilesUpload/FilesUpload.vue');
        }
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '虚拟列表' },
        component: () => {
          return import('@/views/DemoView/views/VirtualList/VirtualList.vue');
        }
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '权限' },
        component: () => {
          return import('@/views/DemoView/views/VirtualList/VirtualList.vue');
        }
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '审批' },
        component: () => {
          return import('@/views/DemoView/views/VirtualList/VirtualList.vue');
        }
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '流程' },
        component: () => {
          return import('@/views/DemoView/views/VirtualList/VirtualList.vue');
        }
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '登录' },
        component: () => {
          return import('@/views/DemoView/views/VirtualList/VirtualList.vue');
        }
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '单点登录' },
        component: () => {
          return import('@/views/DemoView/views/VirtualList/VirtualList.vue');
        }
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '数据分析WebSocket' },
        component: () => {
          return import('@/views/DemoView/views/VirtualList/VirtualList.vue');
        }
      },
      {
        path: 'todo-list',
        name: 'TodoList',
        meta: { title: '代办列表' },
        component: () => {
          return import('@/views/DemoView/views/TodoList/TodoList.vue');
        }
      }
    ]
  },
  {
    path: '/dynamic-segmented-demo',
    name: 'DynamicSegmentedDemo',
    component: () => {
      return import('@/views/DemoView/views/VirtualList/DynamicSegmentedDemo.vue');
    }
  },
  {
    path: '/segmented-demo',
    name: 'SegmentedDemo',
    component: () => {
      return import('@/views/DemoView/views/VirtualList/SegmentedDemo.vue');
    }
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
