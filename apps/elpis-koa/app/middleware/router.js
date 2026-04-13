/**
 * 路由器中间件
 */
import Router from '@koa/router';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export async function router(app) {
  const router = new Router();
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // 读取 routes 目录（当前文件在 middleware 目录，所以 ../routes）
  const routesDir = join(__dirname, '../routes');

  // 读取目录下所有文件
  const files = await readdir(routesDir);

  // 过滤出 .js 文件
  const routeFiles = files.filter(file => file.endsWith('.js'));

  // 批量注册路由
  for (const file of routeFiles) {
    const module = await import(join(routesDir, file));
    const subRouter = module.default; // 约定每个路由模块默认导出 Router 实例
    if (subRouter && typeof subRouter.routes === 'function') {
      router.use(subRouter.routes(), subRouter.allowedMethods());
      console.log(`✅ 路由注册成功: ${file}`);
    }
  }

  // 注册路由中间件
  app.use(router.routes());
  app.use(router.allowedMethods());

  // 返回中间件（用于继续执行后续逻辑）
  return async function (ctx, next) {
    await next();
  };
}
