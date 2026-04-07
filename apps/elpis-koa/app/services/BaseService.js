const superagent = require('superagent'); // 类似前端的axios

module.exports = app =>
  class BaseService {
    /**
     * service 基类
     * 统一封装 service层 服务层 的公共方法
     *
     * service层 统一处理 读写数据库 日志  调用外部服务 其他能力 等等
     * 日志一般会收集到 文件或数据里面 针对生产上的问题排查
     */

    constructor() {
      this.app = app;
      this.config =
        app.config;
      this.curl = superagent;
    }
  };
