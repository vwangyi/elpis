import BaseModel from './baseModel.js';

class TodoModel extends BaseModel {
  // 创建
  async create(data) {
    const obj = {
      todo_id: this.uuid(),
      is_delete: 0,
      create_time: this.now(),
      ...data
    };
    const keys = Object.keys(obj).join('`, `');
    const values = Object.values(obj).join(`', '`);
    const sql = `insert into todo(\`${keys}\`) values('${values}')`;
    await this.mysql2.execute(sql);
    return true;
  }

  // 获取所有
  async findAll(pageIndex, pageSize) {
    const sql = `select * from todo where is_delete=0 limit ${(pageIndex - 1) * pageSize},${pageSize}`;
    const [result] = await this.mysql2.execute(sql);
    console.log('sq', result);
    return result;
  }

  // 根据id获取一个
  findById(id) {
    return this.todos.find(todo => todo.id === id);
  }

  // 更新
  update(id, data) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    this.todos[index] = { ...this.todos[index], ...data };
    return this.todos[index];
  }

  // 删除
  delete(id) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    this.todos.splice(index, 1);
    return true;
  }

  /* 获取todo表的所有条数 */
  async getTotal() {
    const sql = `select count(*) as total from todo`;
    const [[{ total }]] = await this.mysql2.execute(sql);
    return total;
  }
}

export default new TodoModel();
