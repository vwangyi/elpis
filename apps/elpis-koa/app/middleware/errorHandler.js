/**
 * 错误处理中间件
 */
// app.use(async (ctx, next) => {
//     try {
//       await next(); // 捕获所有后续中间件的错误
//     } catch (err) {
//       ctx.status = err.status || 500;
//       ctx.body = {
//         error: err.message,
//         stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//       };

//       // 记录错误日志
//       console.error('Error:', err);
//     }
//   });

export async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    // 统一处理异常处理
    const { status, message, detail } = error;

    // 1. 记录到日志
    // app.logger.info(JSON.stringify(error));
    // app.logger.error('[-- exception --]: ', error);
    // app.logger.error('[-- exception --]: ', status, message, detail);
    // 2. 响应返回错误
    ctx.status = 200;
    ctx.body = {
      success: false,
      code: 50000,
      message: '网络异常 请稍后重试'
    };
  }
}
