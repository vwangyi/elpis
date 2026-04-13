import Router from '@koa/router';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const router = new Router();
// 批量注册所有 .js 路由文件（排除 app.js 自身）
const __dirname = dirname(fileURLToPath(import.meta.url));
const routeFiles = (await readdir(__dirname)).filter(
  file => file.endsWith('.js') && file !== 'index.js'
);
for (const file of routeFiles) {
  const module = await import(join(__dirname, file));
  const subRouter = module.default; // 约定每个路由模块默认导出 Router 实例
  if (subRouter && typeof subRouter.routes === 'function') {
    router.use(subRouter.routes(), subRouter.allowedMethods());
  }
}
export default router;
