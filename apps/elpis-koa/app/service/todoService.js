import BaseService from './baseService.js';
import todoModel from '../model/todoModel.js';

class TodoService extends BaseService {
  /**
   * 获取用户列表
   * @param {number} page     页码，从1开始
   * @param {number} limit    每页条数
   * @returns {Promise<{list: Array, total: number}>}
   */
  async getTodoList(page = 1, limit = 10) {
    const total = await todoModel.getTotal();
    console.log('service', total);
  }
}

export default new TodoService();
