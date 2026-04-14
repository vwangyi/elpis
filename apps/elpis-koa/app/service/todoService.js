import BaseService from './baseService.js';

class TodoService extends BaseService {
  /**
   * 获取用户列表
   * @param {number} page     页码，从1开始
   * @param {number} limit    每页条数
   * @returns {Promise<{list: Array, total: number}>}
   */
  async getTodoList(page = 1, limit = 10) {
    const sql = `SELECT * FROM user`;
    const offset = (page - 1) * limit;
    const [a] = await this.mysql2.execute(sql);
    const mockUsers = a.map(item => {
      delete item.password;
      return item;
    });

    // 分页计算
    const start = (page - 1) * limit;
    const end = start + limit;
    const list = mockUsers.slice(start, end);
    const total = mockUsers.length;

    return { list, total };
  }
}

export default new TodoService();
