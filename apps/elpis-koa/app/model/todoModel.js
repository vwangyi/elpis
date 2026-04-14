// ==================== 1. Model 层 (数据模型与持久化) ====================
// 职责：定义数据结构，直接操作数据库（此处用内存数组模拟）
class TodoModel {
  constructor() {
    this.todos = [
      { id: 1, title: '学习 Koa2 架构', completed: false },
      { id: 2, title: '编写接口代码', completed: true }
    ];
    this.nextId = 3; // 模拟自增 ID
  }

  // 获取所有
  findAll() {
    return this.todos;
  }

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
}
