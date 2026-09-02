import { createApp, nextTick } from 'vue';
import App from './App.vue';
import router from './router';
import { qiankun } from './qiankun';

const app = createApp(App);
app.use(router);
router.isReady().then(async () => {
  app.mount('#app');
  await nextTick();
  // [路由处理1:] 把主应用 router 交给 qiankun 注册层，后面由主应用统一更新浏览器地址栏。
  qiankun(router);
});
