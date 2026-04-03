import {
  createRouter,
  createWebHistory
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
  }

  // {
  //   path: '/demo',
  //   name: 'Demo',
  //   component: () => import(/* webpackChunkName: "DemoView" */ '@/pages/DemoView/DemoView.vue')
  // },
  // {
  //   path: '/user-agreement',
  //   name: 'UserAgreement',
  //   component: () => import(/* webpackChunkName: "UserAgreement" */ '@/pages/UserAgreement/UserAgreement.vue')
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

export default router;
