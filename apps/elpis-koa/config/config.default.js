module.exports = {
  name: "默认",
  jwtSecreKey: "b2ed84cb601f464fbf584db1c3206b3a", // 生成一个uuid 作为jwt的key
  database: {
    client: "mysql2",
    connection: {
      host: "codewy.top", // 云数据库上粘贴过来的
      port: "3306", // 云数据库上粘贴过来的
      database: "elpis_dev", // 数据库名称
      user: "elpis_dev", // 数据库用户名 一般是root
      password: "elpis_dev@123" // 数据库密码
    },
    // 连接池 最大连接数20 最小连接数5
    pool: {
      min: 5,
      max: 20
    }
  },
  email: {
    host: "smtp.qq.com", // QQ邮箱SMTP服务器
    port: 465, // SSL端口
    secure: true, // 465端口必须为true
    auth: {
      user: "codewy@qq.com", // 你的QQ邮箱
      pass: "nvcwyjuvtjugcjjh" // 你的SMTP授权码（16位）
    },
    // 连接池配置（提升性能）
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  }
};
