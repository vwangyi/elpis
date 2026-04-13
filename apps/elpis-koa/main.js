import Koa from 'koa';
import config from './config/index.js';
import { errorHandler } from './app/middleware/errorHandler.js';
import { logger } from './app/middleware/logger.js';
import { router } from './app/middleware/router.js';
import bodyparser from 'koa-bodyparser';

const app = new Koa();
app.use(errorHandler);

// app.use(router.routes());
// app.use(router.allowedMethods());
app.use(await router(app));
app.use(logger(app));
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
  console.log(`
  ═══════════════════════════════════════════════════════
  ✅ Server is running on http://localhost:${config.PORT}
  📝 Environment: ${config.NODE_ENV}
  🛡️  Exception handler enabled
  ═══════════════════════════════════════════════════════
  `);
});
