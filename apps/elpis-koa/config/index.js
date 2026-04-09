/* 根据当前启动的环境 来获取环境对应的配置对象 */
const path = require('path');
const { sep } = path;
module.exports = app => {
  // 获取 default.config 和 env.config
  let defaultConfig = {},
    envConfig = {};
  const configPath = path.resolve(process.cwd(), `.${sep}config`);
  try {
    defaultConfig = require(
      path.resolve(configPath, `.${sep}config.default.js`)
    );
    envConfig = require(
      path.resolve(configPath, `.${sep}config.${app.env.get()}.js`)
    );
  } catch (err) {
    console.error(`-- [exception] there is no config file --`);
  }
  app.config = Object.assign({}, defaultConfig, envConfig);
  console.info(`-- [init] load config done --`);
};
