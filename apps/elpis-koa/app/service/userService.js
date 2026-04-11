// import db from './db.js';

class UserService {
  /**
   * 获取用户列表
   * @param {number} page     页码，从1开始
   * @param {number} limit    每页条数
   * @returns {Promise<{list: Array, total: number}>}
   */
  async getUserList(page = 1, limit = 10) {
    // 模拟数据库中的原始数据（实际应查数据库）
    const mockUsers = [
      { id: 1, name: '张三', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', email: 'lisi@example.com' },
      { id: 3, name: '王五', email: 'wangwu@example.com' },
      { id: 4, name: '赵六', email: 'zhaoliu@example.com' },
      { id: 5, name: '孙七', email: 'sunqi@example.com' }
    ];

    // 分页计算
    const start = (page - 1) * limit;
    const end = start + limit;
    const list = mockUsers.slice(start, end);
    const total = mockUsers.length;

    return { list, total };
  }
}

export default new UserService();
