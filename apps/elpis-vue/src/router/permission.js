import router from './index';

router.beforeEach((to, from, next) => {
  // 如果存在 跳转的地方存在query参数path 就说明path是要去的路由
  if (to.query.path) {
    router.push(to.query.path);
    next();
    return;
  }

  next();
});
