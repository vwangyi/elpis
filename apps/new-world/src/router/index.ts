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
    component: () => import('~/DemoView.vue'),
    redirect: '/demo/coding-view',
    children: [
      {
        path: 'coding-view',
        name: 'CodingView',
        meta: { title: '编码能力' },
        component: () => import('~/views/CodingView/CodingView.vue')
      },

      {
        path: 'files-upload',
        name: 'FilesUpload',
        meta: { title: '文件上传' },
        component: () => import('~/views/FilesUpload/FilesUpload.vue')
      },
      {
        path: 'virtual-list',
        name: 'VirtualList',
        meta: { title: '虚拟列表' },
        component: () => import('~/views/VirtualList/VirtualList.vue')
      },
      {
        path: 'rbac-permissions',
        name: 'RbacPermissions',
        meta: { title: '权限' },
        component: () => import('~/views/RbacPermissions/RbacPermissions.vue')
      },
      {
        path: 'approval-flow',
        name: 'ApprovalFlow',
        meta: {
          title: '审批流',
          desc: '流程可以没有审批 但审批一定有流程，审批是流程的一个环节'
        },
        component: () => import('~/views/ApprovalFlow/ApprovalFlow.vue')
      },
      {
        path: 'work-flow',
        name: 'WorkFlow',
        meta: { title: '工作流' },
        component: () => import('~/views/WorkFlow/WorkFlow.vue')
      },
      {
        path: 'session-login',
        name: 'SessionLogin',
        meta: { title: 'session登录' },
        component: () => import('~/views/SessionLogin/SessionLogin.vue')
      },
      {
        path: 'jwt-login',
        name: 'JwtLogin',
        meta: { title: 'jwt登录' },
        component: () => import('~/views/JwtLogin/JwtLogin.vue')
      },
      {
        path: 'single-sign-on',
        name: 'SingleSignOn',
        meta: { title: '单点登录' },
        component: () => import('~/views/SingleSignOn/SingleSignOn.vue')
      },
      {
        path: 'todo-list',
        name: 'TodoList',
        meta: { title: '代办列表' },
        component: () => import('~/views/TodoList/TodoList.vue')
      },
      {
        path: 'chat-room',
        name: 'ChatRoom',
        meta: { title: '聊天室' },
        component: () => import('~/views/ChatView/ChatView.vue')
      },
      {
        path: 'service-monitoring',
        name: 'ServiceMonitoring',
        meta: { title: '服务监控' },
        component: () =>
          import('~/views/ServiceMonitoring/ServiceMonitoring.vue')
      },
      {
        path: 'log-record',
        name: 'LogRecord',
        meta: { title: '日志记录' },
        component: () => import('~/views/LogRecord/LogRecord.vue')
      },
      {
        path: 'bubble-sort',
        name: 'BubbleSort',
        meta: { title: '冒泡排序' },
        component: () => import('~/views/BubbleSort/BubbleSort.vue')
      },
      {
        path: 'bubble-sort',
        name: 'BubbleSort',
        meta: { title: '防抖节流' },
        component: () => import('~/views/BubbleSort/BubbleSort.vue')
      }
    ]
  },
  {
    path: '/dynamic-segmented-demo',
    name: 'DynamicSegmentedDemo',
    component: () => import('~/views/VirtualList/DynamicSegmentedDemo.vue')
  },
  {
    path: '/segmented-demo',
    name: 'SegmentedDemo',
    component: () => import('~/views/VirtualList/SegmentedDemo.vue')
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
