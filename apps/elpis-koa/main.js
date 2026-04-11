import Koa from 'koa';
import config from './config/index.js';
import router from './app/router/app.js';
import bodyparser from 'koa-bodyparser';

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());
// 使用koa-bodyparser后 才可以使用ctx.request.body
app.use(
  bodyparser({
    formLimit: '1000mb', // 防止大文件上传导致服务器崩溃
    // enableTypes是为了支持不同类型的请求体
    // 比如 application/json application/x-www-form-urlencoded text/plain
    enableTypes: ['from', 'json', 'text']
  })
);

// console.log(app.env, config)

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
