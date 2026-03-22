module.exports = app => {
  const BaseController = require("./BaseController")(app);
  const moment = require("moment");
  return class UserController extends BaseController {
    async create(ctx) {
      const { UserService } = app.services;
      const { username, nickname, gender, desc } = ctx.request.body;

      const userId = UserService.create({ username, nickname, gender, desc });
      this.success(ctx, { user_id: userId });
    }

    async remove(ctx) {
      const { usre_id: userId } = ctx.request.body;
      const { UserService } = app.services;
      await UserService.remove(userId);
      this.success(ctx, { user_id: userId });
    }

    async update(ctx) {
      const { UserService } = app.services;
      const { user_id: userId, nickname, username, desc, gender } = ctx.request.body;
      await UserService.update(userId, { nickname, username, desc, gender });

      this.success(ctx, { user_id: userId });
    }

    async findAll(ctx) {
      const {
        username,
        nickname,
        sex,
        create_time_start: createTimeStart,
        create_time_end: createTimeEnd,
        page,
        size
      } = ctx.request.query;

      const { UserService, EmailService } = app.services;

      await EmailService.sendVerificationCode();

      const [all, total] = await Promise.all([
        // 列表
        UserService.findAll({
          username,
          nickname,
          sex,
          createTimeStart,
          createTimeEnd,
          page: Number(page),
          size: Number(size)
        }),
        // 总条数
        UserService.findTotal({
          username,
          nickname,
          sex,
          createTimeStart,
          createTimeEnd
        })
      ]);

      /* 失败情况 */

      /* 空列表情况 */
      if (!(Array.isArray(all) && all.length)) {
        return this.success(ctx, { list: [], total: 0 });
      }

      // 数据库的数据 不一定是页面需要渲染的数据 数据转换也是在 controller处理的
      // 前后端分离 有些后端就直接 扔给前端 后端不处理
      const list = all.map(item => {
        return {
          ...item,
          sex: item.sex === 1 ? "男" : "女",
          create_time: moment(item.create_time).format("YYYY-MM-DD HH:mm:ss")
        };
      });
      this.success(ctx, { list, total });
    }

    async findOneByUserId(ctx) {
      const { UserService } = app.services;
      const { user_id: userId } = app.request.query;
      const user = await UserService.findOneByUserId(userId);
      // 在controller层 处理数据 给前端，前端就不需要处理数据了
      user.create_time = moment(user.create_time).format("YYYY-MM-DD HH:mm:ss");
      this.success(ctx, user);
    }

    async findUserInfo(ctx) {
      const { UserService } = app.services;
      const userId = ctx.userId; // 中间件已经帮我们解析token并设置ctx.userId
      const userInfo = await UserService.findOneByUserId(userId);
      this.success(ctx, userInfo);
    }
  };
};
