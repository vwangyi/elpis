import Koa from 'koa';
import config from './app/config/index.js';
import { errorHandler } from './app/middleware/errorHandler.js';
import { logger } from './app/middleware/logger.js';
import router from './app/router/index.js';
import bodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(errorHandler());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.PORT, () => {
  console.log(`
  ═══════════════════════════════════════════════════════
  ✅ Server is running on http://localhost:${config.PORT}
  📝 Environment: ${config.NODE_ENV}
  🛡️  Exception handler enabled
  ═══════════════════════════════════════════════════════
  `);
});
