module.exports = app => {
  // _ENV是 npm run xxx 启动时 传递的变量
  const env = {
    get: () => process.env._ENV ?? 'dev', // 获取当前环境
    isDev: () => process.env._ENV === 'dev', // 是否开发环境
    isProd: () => process.env._ENV === 'prod' // 是否生产环境
    // isBeta: () => process.env._ENV === 'beta', // 是否测试环境
  };
  app.env = env;
  console.info(`-- [init] load env done --`);
};
