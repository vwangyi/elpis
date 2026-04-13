import userService from '../service/userService.js';

class UserController {
  /**
   * 获取用户列表接口
   * GET /api/users?page=1&limit=10
   */
  async getUserList(ctx, next) {
    console.log('执行 UserController');
    // 1. 从 query 中获取分页参数，并转换为数字、设置默认值
    let { page = 1, limit = 10 } = ctx.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // 2. 参数校验（简单示例）
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

    // 3. 调用 Service 层
    const { list, total } = await userService.getUserList(page, limit);

    // 4. 返回统一格式的 JSON
    ctx.body = {
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        limit
      }
    };
  }
}
export default new UserController();
