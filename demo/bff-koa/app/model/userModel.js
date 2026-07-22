// models/userModel.js
class UserModel {
  constructor(mysql2) {
    this.mysql2 = mysql2;
  }

  // ✅ Model 只做数据库查询，不包含业务逻辑
  async findList({ limit, offset }) {
    // 数据库层面分页，而不是内存分页
    const sql = `SELECT id, username, email, role, created_at FROM user LIMIT ? OFFSET ?`;
    const [rows] = await this.mysql2.execute(sql, [limit, offset]);
    return rows;
  }

  // 获取总数
  async getTotalCount() {
    const sql = `SELECT COUNT(*) as total FROM user`;
    const [rows] = await this.mysql2.execute(sql);
    return rows[0].total;
  }

  // 根据ID查询
  async findById(id) {
    const sql = `SELECT id, username, email, role, created_at FROM user WHERE id = ?`;
    const [rows] = await this.mysql2.execute(sql, [id]);
    return rows[0];
  }

  // 创建用户
  async create(userData) {
    const sql = `INSERT INTO user (username, password, email) VALUES (?, ?, ?)`;
    const [result] = await this.mysql2.execute(sql, [
      userData.username,
      userData.password,
      userData.email
    ]);
    return result.insertId;
  }
}
