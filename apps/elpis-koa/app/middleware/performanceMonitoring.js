/**
 * 性能监控中间件
 */

// app.use(async (ctx, next) => {
//     // 请求开始
//     ctx.state.requestId = generateRequestId();
//     ctx.state.startTime = process.hrtime();

//     // 记录请求开始
//     console.log(`[${ctx.state.requestId}] Request started`);

//     await next();

//     // 计算耗时
//     const diff = process.hrtime(ctx.state.startTime);
//     const duration = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

//     // 慢请求告警
//     if (duration > 1000) {
//       console.warn(`[${ctx.state.requestId}] Slow request: ${duration}ms`);
//     }

//     // 记录响应完成
//     console.log(`[${ctx.state.requestId}] Request completed in ${duration}ms`);
//   });
