import BaseService from './baseService.js';

class UserService extends BaseService {
  /**
   * 获取用户列表
   * @param {number} page     页码，从1开始
   * @param {number} limit    每页条数
   * @returns {Promise<{list: Array, total: number}>}
   */
  async getUserList(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM user`;
    const [a] = await this.mysql2.execute(sql);
    console.log('拿到a', a);
    // 模拟数据库中的原始数据（实际应查数据库）

    const mockUsers = a.map(item => ({ ...item, password: null }));
    console.log('拿到mockUsers', mockUsers);

    // 分页计算
    const start = (page - 1) * limit;
    const end = start + limit;
    const list = mockUsers.slice(start, end);
    const total = mockUsers.length;

    return { list, total };
  }
}

export default new UserService();
