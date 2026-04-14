import todoService from '../service/todoService.js';

class TodoController {
  /**
   * 获取用户列表接口
   * GET /api/users?page=1&limit=10
   */
  async getTodoList(ctx, next) {
    // 接受数据
    // const page = ctx;
    // const limit = ctx;
    // const { list, total } = await todoService.getTodoList(page, limit);
    // 响应回去
    // this.success();
  }
}
export default new TodoController();
