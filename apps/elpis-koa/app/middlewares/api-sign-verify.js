const md5 = require("md5");

/**
 * 校验每个请求的 sign 签名 是否有效 （注意 这和token 完全无关）
 *
 * API访问控制：确保只有合法客户端可以调用API 只有知道signKey的客户端才能生成正确签名
 * 防重放攻击：通过时间戳防止请求被重复使用
 * 请求时效性：确保请求在合理时间内到达
 * 灵活配置：通过白名单排除不需要验证的接口
 */
module.exports = app => {
  return async (ctx, next) => {
    const whiteList = ["/api/user/list", "/api/user/list", "/api/user/list", "/api/user/list"];
    // 白名单 放行通过
    if (whiteList.some(item => item === ctx.path)) {
      return await next(); // 表示放行通过
    }
    // 页面请求不需要校验签名 只对api请求校验 ： 只有两种请求 页面请求和api请求
    if (!ctx.path.startsWith("/api/")) {
      return await next(); // 表示放行通过
    }

    const { path, method } = ctx;
    const { headers } = ctx.request;
    const { s_sign: sSign, s_t: st } = headers;

    // 这个signKey 随意写都可以 但前后端用的是同一个key 这叫 对称加密
    const signKey = "klx05hb3n1c9ujp8uhx4bs2iksdfsdfk5io6wp212";
    const signature = md5(`${signKey}_${st}`); // md5加密

    app.logger.info(`[${method} ${path}] signature: ${signature}`);
    app.logger.info(`[${method} ${path}] IP: ${ctx.ip}`);
    app.logger.info(`[${method} ${path}] Headers: ${JSON.stringify(headers)}`);
    // 验证失败的详细原因
    if (!sSign) {
      app.logger.warn(`[${method} ${path}] Missing signature`);
    }
    if (!st) {
      app.logger.warn(`[${method} ${path}] Missing timestamp`);
    }
    if (signature !== sSign.toLowerCase()) {
      app.logger.warn(`[${method} ${path}] Signature mismatch`);
      app.logger.warn(`Expected: ${signature}, Got: ${sSign}`);
    }
    if (Date.now() - st > 600000) {
      app.logger.warn(`[${method} ${path}] Request expired`);
      app.logger.warn(`Timestamp: ${new Date(parseInt(st)).toISOString()}`);
    }
    if (
      !sSign || // 没有签名
      !st || // 没有时间
      signature !== sSign.toLowerCase() || // 签名不对
      Date.now() - st > 600000 // 大于600秒 也就是 10分钟 判定为请求超时
    ) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: "signature not correct or api timeout!!",
        code: 445
      };
      return;
    }

    await next();
  };
};
