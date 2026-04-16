import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router';
import HomeView from '@/pages/HomeView/HomeView.vue';

export const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/files-upload',
    name: 'FilesUpload',
    component: () =>
      import(
        /* webpackChunkName: "FilesUpload" */ '@/pages/FilesUpload/FilesUpload.vue'
      ),
    meta: {
      title: '大文件上传'
    }
  },

  {
    path: '/low-code-platform',
    name: 'LowCodePlatform',
    component: () =>
      import(
        /* webpackChunkName: "LowCodePlatform" */ '@/pages/LowCodePlatform/LowCodePlatform.vue'
      ),
    meta: {
      title: '低代码'
    }
  },

  {
    path: '/memory-leak',
    name: 'MemoryLeak',
    component: () =>
      import(
        /* webpackChunkName: "MemoryLeak" */ '@/pages/MemoryLeak/MemoryLeak.vue'
      ),
    meta: {
      title: '内存泄露'
    }
  },
  {
    path: '/video-view',
    name: 'VideoView',
    component: () =>
      import(
        /* webpackChunkName: "VideoView" */ '@/pages/VideoView/VideoView.vue'
      ),
    meta: {
      title: '视频页面'
    }
  },
  {
    path: '/virtual-list',
    name: 'VirtualList',
    component: () =>
      import(
        /* webpackChunkName: "VirtualList" */ '@/pages/VirtualList/VirtualList.vue'
      ),
    meta: {
      title: '虚拟列表'
    }
  },
  {
    path: '/word-view',
    name: 'WordView',
    component: () =>
      import(
        /* webpackChunkName: "WordView" */ '@/pages/WordView/WordView.vue'
      ),
    meta: {
      title: '单词'
    }
  },
  {
    path: '/waterfall-flow',
    name: 'WaterfallFlow',
    component: () =>
      import(
        /* webpackChunkName: "WaterfallFlow" */ '@/pages/WaterfallFlow/WaterfallFlow.vue'
      ),
    meta: {
      title: '瀑布流'
    }
  },
  {
    path: '/editable-table',
    name: 'EditableTable',
    component: () =>
      import(
        /* webpackChunkName: "EditableTable" */ '@/pages/EditableTable/EditableTable.vue'
      ),
    meta: {
      title: '可编辑表格'
    }
  },
  {
    path: '/canvas-signature',
    name: 'CanvasSignature',
    component: () =>
      import(
        /* webpackChunkName: "CanvasSignature" */ '@/pages/CanvasSignature/CanvasSignature.vue'
      ),
    meta: {
      title: 'Canvas签名'
    }
  },
  {
    path: '/multi-spec-goods',
    name: 'MultiSpecGoods',
    component: () =>
      import(
        /* webpackChunkName: "MultiSpecGoods" */ '@/pages/MultiSpecGoods/MultiSpecGoods.vue'
      ),
    meta: {
      title: '多规格商品'
    }
  },
  {
    path: '/dynamic-form',
    name: 'DynamicForm',
    component: () =>
      import(
        /* webpackChunkName: "DynamicForm" */ '@/pages/DynamicForm/DynamicForm.vue'
      ),
    meta: {
      title: '动态表单'
    }
  },
  {
    path: '/todo-list',
    name: 'TodoList',
    component: () =>
      import(
        /* webpackChunkName: "TodoList" */ '@/pages/TodoList/TodoList.vue'
      ),
    meta: {
      title: '代办列表'
    }
  },
  {
    path: '/screen-saver',
    name: 'ScreenSaver',
    component: () =>
      import(
        /* webpackChunkName: "ScreenSaver" */ '@/pages/ScreenSaver/ScreenSaver.vue'
      ),
    meta: {
      title: '屏保'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(
        /* webpackChunkName: "SettingsView" */ '@/pages/SettingsView/SettingsView.vue'
      ),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/user-agreement',
    name: 'UserAgreement',
    component: () =>
      import(
        /* webpackChunkName: "UserAgreement" */ '@/pages/UserAgreement/UserAgreement.vue'
      ),
    meta: {
      title: '用户协议'
    }
  },
  {
    path: '/demo-view',
    name: 'DemoView',
    component: () =>
      import(
        /* webpackChunkName: "DemoView" */ '@/pages/DemoView/DemoView.vue'
      ),
    meta: {
      title: 'demo'
    }
  },
  {
    path: '/work-flow',
    name: 'WorkFlow',
    component: () =>
      import(
        /* webpackChunkName: "WorkFlow" */
        '@/pages/WorkFlow/WorkFlow.vue'
      ),
    meta: {
      title: '流程/工作流'
    }
  },
  {
    path: '/approval-process',
    name: 'ApprovalProcess',
    component: () =>
      import(
        /* webpackChunkName: "ApprovalProcess" */
        '@/pages/ApprovalProcess/ApprovalProcess.vue'
      ),
    meta: {
      title: '审批/审批流'
    }
  },
  {
    path: '/permission-setting',
    name: 'PermissionSetting',
    component: () =>
      import(
        /* webpackChunkName: "PermissionSetting" */
        '@/pages/PermissionSetting/PermissionSetting.vue'
      ),
    meta: {
      title: '权限设置'
    }
  },
  {
    path: '/web-socket',
    name: 'WebSocket',
    component: () =>
      import(
        /* webpackChunkName: "WebSocket" */
        '@/pages/WebSocket/WebSocket.vue'
      ),
    meta: {
      title: 'WebSocket / http轮询'
    }
  },
  {
    path: '/draggable-table',
    name: 'DraggableTable',
    component: () =>
      import(
        /* webpackChunkName: "DraggableTable" */
        '@/pages/DraggableTable/DraggableTable.vue'
      ),
    meta: {
      title: '拖拽生成表格'
    }
  },
  {
    path: '/count-down',
    name: 'CountDown',
    component: () =>
      import(
        /* webpackChunkName: "CountDown" */
        '@/pages/CountDown/CountDown.vue'
      ),
    meta: {
      title: '倒计时'
    }
  },
  {
    path: '/parabola-shop',
    name: 'ParabolaShop',
    component: () =>
      import(
        /* webpackChunkName: "ParabolaShop" */
        '@/pages/ParabolaShop/ParabolaShop.vue'
      ),
    meta: {
      title: '抛物线效果'
    }
  },
  {
    path: '/lyrics-scrolling',
    name: 'LyricsScrolling',
    component: () =>
      import(
        /* webpackChunkName: "LyricsScrolling" */
        '@/pages/LyricsScrolling/LyricsScrolling.vue'
      ),
    meta: {
      title: '歌词滚动'
    }
  }
];
const router = createRouter({
  history: createWebHistory(), // history模式
  // history: createWebHashHistory(), // hash模式
  routes: routes
});

export default router;
