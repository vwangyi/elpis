import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/Home.vue';
import AlbumPage from '../views/Album.vue';

// 定义一些路由
const routes = [
  { path: '/', component: HomePage },
  { path: '/album', component: AlbumPage }
];

// 创建一个路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 history 模式
  routes // 使用上面定义的路由
});

export default router;
