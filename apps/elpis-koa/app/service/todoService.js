import BaseService from './baseService.js';
import todoModel from '../model/todoModel.js';

class TodoService extends BaseService {
  async create(data) {
    return await todoModel.create(data);
  }
  /**
   * 获取用户列表
   * @param {number} page     页码，从1开始
   * @param {number} limit    每页条数
   * @returns {Promise<{list: Array, total: number}>}
   */
  async findAll(pageIndex = 1, pageSize = 10) {
    pageIndex = Number(pageIndex) >= 1 ? Number(pageIndex) : 1;
    pageSize = Number(pageSize) >= 1 ? Number(pageSize) : 10;
    const total = await todoModel.getTotal();
    const result = await todoModel.findAll(pageIndex, pageSize);
    const list = result.map(item => {
      delete item.is_delete;
      return item;
    });
    return [list, total];
  }
}

export default new TodoService();
