import BaseService from './baseService.js';

class UserService extends BaseService {
  /**
   * 获取用户列表
   * @param {number} page     页码，从1开始
   * @param {number} limit    每页条数
   * @returns {Promise<{list: Array, total: number}>}
   */
  async getUserList(page = 1, limit = 10) {
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

export default new UserService();

// services/userService.js
class UserService1 {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // ✅ Service 包含业务逻辑：分页计算、数据过滤、业务规则
  async getUserList(page = 1, limit = 10) {
    // 1. 参数验证和规范化（业务逻辑）
    page = Math.max(1, parseInt(page));
    limit = Math.min(100, Math.max(1, parseInt(limit))); // 限制最大100条

    // 2. 计算偏移量（业务逻辑）
    const offset = (page - 1) * limit;

    // 3. 调用 Model 获取数据
    const list = await this.userModel.findList({ limit, offset });
    const total = await this.userModel.getTotalCount();

    // 4. 业务逻辑：数据转换/过滤（已经在 Model 层过滤了 password）
    // 如果需要额外的业务处理，在这里做

    // 5. 计算分页信息（业务逻辑）
    const totalPages = Math.ceil(total / limit);

    // 6. 返回格式化的数据
    return {
      list,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  // 其他业务方法
  async createUser(userData) {
    // 业务规则：密码强度验证
    // if (userData.password.length < 6) {
    //     throw new Error('密码长度不能少于6位');
    // }
    // // 业务规则：用户名唯一性验证
    // const existingUser = await this.userModel.findByUsername(userData.username);
    // if (existingUser) {
    //     throw new Error('用户名已存在');
    // }
    // 业务逻辑：密码加密
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    // 调用 Model 创建用户
    // const userId = await this.userModel.create({
    //     ...userData,
    //     password: hashedPassword
    // });
    // 业务逻辑：发送欢迎邮件
    // await emailService.sendWelcome(userData.email);
    // return { id: userId };
  }
}
