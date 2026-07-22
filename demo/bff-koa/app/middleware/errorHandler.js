/**
 * 错误处理中间件
 */
/**
 * 这是一个中间件 运行时 错误异常处理 兜底所有异常
 * @param { object } app koa实例
 */

export function errorHandler(app) {
  return async function (ctx, next) {
    try {
      await next();
    } catch (err) {
      // 1. 记录到日志
      const { status, message, detail } = error;
      app.logger.info(JSON.stringify(error));
      app.logger.error('[-- exception --]: ', error);
      app.logger.error('[-- exception --]: ', status, message, detail);
      // 2. 响应返回错误
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 50000,
        message: message || '网络异常 请稍后重试'
      };
    }
  };
}
