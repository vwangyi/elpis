const jwt = require('jsonwebtoken');

/**
 * 1 当用户 登录后 在某个页面 手动删除token 后。 点击某个按钮访问 api 应该提示登录失效 让用户重新登录
 * 重新登录成功 回到页面 （用户不用再点击按钮就可以拿到api的数据了） 重新登录成功后 回到登录之前的页面
 *
 * 那就是说 每个请求都有 token 而 token里面存在 userId
 * 那就是每个请求都有userId 那就是叫 这个http有状态了 http默认是无状态的
 *
 * 保护需要登录的页面/API
 * 自动重定向未登录用户
 * 清除无效token
 * 区分API和页面请求的不同处理方式
 */
module.exports = app => {
  // 访问白名单内的api 不需要登录
  const whiteList = [
    '/',
    '/api/auth/logout',
    '/api/auth/login',
    '/api/user/list',
    '/api/auth/send_email_code', // 发送验证码 不需要登录
    '/api/auth/login/by_email_code'
  ];

  return async (ctx, next) => {
    if (whiteList.includes(ctx.path)) {
      await next();
      return;
    }
    let isLogin = true;
    ctx.token = ctx.cookies.get('token'); // 拿到token

    if (!ctx.token) {
      isLogin = false;
    }
    // token有效
    else {
      try {
        const { jwtSecreKey } = app.config;
        const decoded = jwt.verify(ctx.token, jwtSecreKey);
        ctx.userId = decoded.userId;
      } catch (err) {
        isLogin = false;
      }
    }

    // 若没有登录
    if (!isLogin) {
      ctx.cookies.set('token', '', {
        expires: new Date(0)
      });

      // 处理api请求：api请求就没办法重定向了
      if (ctx.url.startsWith('/api/')) {
        // 校验token后 提示重新登录
        ctx.body = {
          success: false,
          code: 50000,
          message: 'token已过期，请重新登录'
        };
      }
      // 处理页面请求 就可以重定向
      else {
        ctx.status = 302;
        // ctx.redirect('/view/auth/login?callback=${ctx.url }') // 重定向登录页
      }
      return;
    }

    // 已登录就放行
    await next();
  };
};
