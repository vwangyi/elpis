const Router = require("koa-router");
const glob = require("glob");
const path = require("path");
const { sep } = path;

module.exports = function (app) {
  const router = new Router();
  /* 把当前目录下 所有文件导出的函数都执行 */
  const routerPath = path.resolve(process.cwd(), `.${sep}app${sep}router`);
  let fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`));
  fileList = fileList.filter(item => !item.endsWith("index.js"));
  fileList.forEach(filePath => require(filePath)(app, router));

  /* 路由兜底 重定向到首页 */

  /**
   * 路由兜底
   *
   * 比如 前端是单页面应用 但需要用 window.open 新开一个标签页 此时新标签页会发送一个新的 get请求 来请求页面
   */
  router.get(/.*/, async ctx => {
    // 处理所有 GET 请求
    ctx.status = 302; // 临时重定向
    // 这是一个单页面应用 只要请求的不是 /api/前缀的接口 都是认为是请求页面 而页面只有一个 那就是 '/' 首页
    ctx.redirect("/");
  });
  // 路由注册到 app 上
  app.use(router.routes());
  app.use(router.allowedMethods());
  console.info(`-- [init] load router done --`);
};
