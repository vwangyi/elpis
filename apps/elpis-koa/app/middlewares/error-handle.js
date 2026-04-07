// 处理异常
function handleAnException(
  app
) {}
/**
 * 这是一个中间件 运行时 错误异常处理 兜底所有异常
 * @param { object } app koa实例
 */
module.exports = app => {
  return async (
    ctx,
    next
  ) => {
    // next方法 表示 koa的中间件执行完毕后 继续执行下一个中间件

    try {
      await next();
    } catch (error) {
      // 统一处理异常处理
      const {
        status,
        message,
        detail
      } = error;

      app.logger.info(
        JSON.stringify(error)
      );
      app.logger.error(
        '[-- exception --]: ',
        error
      );
      app.logger.error(
        '[-- exception --]: ',
        status,
        message,
        detail
      );

      // 请求有 页面请求和API请求 两种; 当用户访问一个不存在的页面时候 应该重定向到首页
      if (
        message &&
        message.indexOf(
          'template not found'
        ) > -1
      ) {
        ctx.status = 302; // 临时重定向  一般不会用 301永久重定向
        ctx.redirect(
          `${app.project?.homePage}`
        );
        return;
      }

      const resBody = {
        success: false,
        code: 50000,
        message:
          '网络异常 请稍后重试'
      };
      ctx.status = 200;
      ctx.body = resBody;
    }
  };
};
