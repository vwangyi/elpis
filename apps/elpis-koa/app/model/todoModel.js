import BaseModel from './baseModel.js';

class TodoModel extends BaseModel {
  // 获取所有
  findAll() {}

  // 根据id获取一个
  findById(id) {
    return this.todos.find(todo => todo.id === id);
  }

  // 创建
  create(data) {
    const newTodo = { id: this.nextId++, ...data };
    this.todos.push(newTodo);
    return newTodo;
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
  async getTodoTotal() {
    const sql = `select count(*) as total from todo`;
    const [[{ total }]] = await this.mysql2.execute(sql);
    return total;
  }
  /* 分页查询 */
  async getTodoList(pageIndex, pageSize) {
    const sql = `select * from user limit ${(pageIndex - 1) * pageSize},${pageSize}`;
    const [result] = await this.mysql2.execute(sql);
    return result;
  }
}

export default new TodoModel();
