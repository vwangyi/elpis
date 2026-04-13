/**
 * 身份认证中间件
 */

// app.use(async (ctx, next) => {
//     const token = ctx.headers.authorization;

//     if (!token) {
//       ctx.status = 401;
//       ctx.body = { error: '未提供认证令牌' };
//       return; // 不调用 next()，中断执行
//     }

//     try {
//       // 验证token
//       const user = verifyToken(token);
//       ctx.state.user = user; // 存储用户信息
//       await next(); // 验证通过，继续执行
//     } catch (err) {
//       ctx.status = 403;
//       ctx.body = { error: '无效的认证令牌' };
//     }
//   });

//   // 业务中间件可以直接使用用户信息
//   app.use(async (ctx) => {
//     ctx.body = { message: `Hello ${ctx.state.user.name}` };
//   });
