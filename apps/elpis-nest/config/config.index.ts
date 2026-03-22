// 当前项目 目前就定义 3种环境： dev开发 beta测试 prod生产

export default {
  name: 'elpis-core-prod',
  // 数据库配置
  database: {
    type: 'mysql', // 数据库类型
    host: '127.0.0.1', // mysql地址
    port: 3306, // mysql端口号
    /* 数据库账号密码 可以存在当前电脑根目录 然后通过node去拿到 这样就不用放在项目里面 推送到代码托管平台了 */
    username: 'root', // 数据库账号
    password: 'elpis123456@', // 数据库密码
    database: 'elpis-prod', // 数据库名
    autoLoadEntities: true,
    synchronize: false, // 可以通过实体类 直接修改数据库表 生产环境不建议使用 写实体类就是写数据表
    logging: true,
  },
  // 静态资源配置
  static: {
    prefix: '/static', // 访问前缀 http://localhost:3000/static/xxxx.jpg
    dir: 'static', // 静态资源目录名称，项目根目录下的 static 目录
  },
};
