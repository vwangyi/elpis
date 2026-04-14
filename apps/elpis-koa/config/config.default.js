export default {
  name: '默认',
  PORT: process.env.ELPIS_PORT,
  NODE_ENV: process.env.ELPIS_NODE_ENV,
  jwtSecreKey: 'b2ed84cb601f464fbf584db1c3206b3a', // 生成一个uuid 作为jwt的key

  MYSQL2: {
    host: process.env.ELPIS_DB_HOST,
    user: process.env.ELPIS_DB_USER,
    database: process.env.ELPIS_DB_DATABASE,
    password: process.env.ELPIS_DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10, // 连接池最大连接数
    queueLimit: 0
  },
  KNEX: {
    client: 'mysql2',
    connection: {
      host: process.env.ELPIS_DB_HOST, // 云数据库上粘贴过来的
      port: process.env.ELPIS_DB_PORT, // 云数据库上粘贴过来的
      database: process.env.ELPIS_DB_DATABASE, // 数据库名称
      user: process.env.ELPIS_DB_USER, // 数据库用户名 一般是root
      password: process.env.ELPIS_DB_PASSWORD // 数据库密码
    },
    // 连接池 最大连接数20 最小连接数5
    pool: {
      min: 5,
      max: 20
    }
  },
  EMAIL: {
    host: 'smtp.qq.com', // QQ邮箱SMTP服务器
    port: 465, // SSL端口
    secure: true, // 465端口必须为true
    auth: {
      user: 'codewy@qq.com', // 你的QQ邮箱
      pass: 'nvcwyjuvtjugcjjh' // 你的SMTP授权码（16位）
    },
    // 连接池配置（提升性能）
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || ''
  }
};
