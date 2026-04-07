// koa-nunjucks-2 这个插件可以给ctx添加render方法 render方法可以直接返回页面给前端
const koaNunjucks = require('koa-nunjucks-2');
const path = require('path');
const koaStatic = require('koa-static'); // 静态文件中间件

/**
 * koa-nunjucks-2 和 koa-static 配套使用的
 * koa-static 是 开放一个文件夹 用于前端 获取 js css 等静态资源
 * koa-nunjucks-2 则是 让前端拿到 html
 */
module.exports = app => {
  app.use(
    koaStatic(
      path.resolve(
        process.cwd(),
        './public'
      )
    )
  ); // src="/dist/xxx.js" /public/dist.xxx.js
  app.use(
    koaNunjucks({
      ext: 'html',
      path: path.resolve(
        process.cwd(),
        './public/'
      ), // 前端打包后的产物位置 app/public/xx.html
      nunjucksConfig: {
        noCache: true,
        trimABlocks: true
      }
    })
  );
};
