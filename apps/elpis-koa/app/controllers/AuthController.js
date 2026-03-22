/* auth 认证模块 */
module.exports = app => {
  const BaseController = require("./BaseController")(app);
  const jwt = require("jsonwebtoken");
  return class AuthController extends BaseController {
    /* 登录 通过邮箱+验证码 */
    async loginByEmailCode(ctx) {
      const { email, code } = ctx.request.body;
      const { EmailService } = app.services;
      const { UserService } = app.services;

      try {
        // 验证验证码
        await EmailService.verifyEmailCode(email, code);
      } catch (error) {
        this.fail(ctx, { error }, error);
      }

      // 验证成功后 查找用户
      let user = await UserService.findByEmail(email);
      // 用户不存在则创建新用户
      if (!user) {
        const userId = await UserService.createByEmail(email);
        user = await UserService.findOneByUserId(userId);
      }
      // 设置token
      this.setAuthToken(ctx, user.user_id);

      // 业务成功情况
      this.success(ctx, { user });
    }
    /* 登录 通过用户名+密码 */
    async loginByUsernameAndPassword(ctx) {
      // 从body上取出参数
      const { username, password } = ctx.request.body;
      // 拿到 自己封装的 UserService 方法
      const { UserService } = app.services;

      // 获取数据库的账号密码作比对 返回用户对象
      const user = UserService.findOneByUsernameAndPassword({
        username,
        password
      });

      // 账号或密码错误 业务失败
      if (!user) {
        return this.fail(ctx, "账号或密码错误", 50000);
      }
      // 设置token
      this.setAuthToken(ctx, user.user_id);
      // 业务成功情况
      this.success(ctx, { user });
    }
    /* 设置认证token */
    setAuthToken(ctx, userId) {
      const { jwtSecreKey } = app.config;
      const payload = { userId };
      const token = jwt.sign(payload, jwtSecreKey, { expiresIn: 60 * 60 * 24 });
      // 把 token 放在浏览器的cookie 上 ，浏览器每次请求都会自动携带token
      const expires = new Date();
      expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24); // 一天有效
      ctx.cookies.set("token", token, {
        expires,
        httpOnly: true // 只有http可修改 （防止前端通过document.cookie获取）
      });
    }

    /* 发送邮箱验证码 */
    async sendEmailCode(ctx) {
      const { email } = ctx.request.query;
      const { EmailService } = app.services;

      // 生成6位数字验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // 设置验证码过期时间（5分钟）
      const expiresAt = Date.now() + 5 * 60 * 1000;
      const result = await EmailService.sendVerificationCode({
        email,
        code,
        expiresAt
      });

      const { rejected } = result;

      // 检查 rejected 数组
      if (Array.isArray(rejected) && rejected.length > 0) {
        this.fail(ctx, {}, "发送验证码失败");
      }

      this.success(ctx, {}, "发送验证码成功");
    }

    // 登出
    async logout(ctx) {
      // 清空cookie // 设置过期时间为当前时间 让cookie失效
      ctx.cookies.set("token", "", { expires: new Date(0) });
      ctx.status = 302;
      ctx.redirect("/");
      this.success(ctx);
    }
  };
};
