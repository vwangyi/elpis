module.exports = app => {
  const { database: dbConfig } = app.config;
  if (!dbConfig) return;
  // 为什么要用knex来操作数据库？
  // knex是一个node库 帮我们做了很多事情 比如 防止SQL注入、简化SQL语句的编写、支持事务等 可以 避免xss攻击
  // 提升我们的开发效率 比我们手写SQL语句要好很多 knex也支持原生sql knex.raw('select * from `user`')
  const knex = require("knex")(dbConfig);
  app.knex = knex;
  console.info(`-- [init] load knex done --`);
};
