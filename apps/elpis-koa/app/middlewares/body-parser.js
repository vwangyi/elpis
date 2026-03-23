const bodyParser = require('koa-bodyparser');

module.exports = app => {
  // 使用koa-bodyparser后 才可以使用ctx.request.body
  app.use(
    bodyParser({
      formLimit: '1000mb', // 防止大文件上传导致服务器崩溃
      // enableTypes是为了支持不同类型的请求体
      // 比如 application/json application/x-www-form-urlencoded text/plain
      enableTypes: ['from', 'json', 'text']
    })
  );
};
