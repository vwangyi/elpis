/**
 * 根据当前环境 process.env.ELPIS_NODE_ENV 计算出 环境对应的配置对象
 * 使用配置对象 只需要 import config form 导入此文件即可
 *
 * 通常我们不会在业务代码中直接使用 process.env，而是集中在一个 config 模块中读取并导出结构化对象。
 */
import defaultConfig from './config.default.js';

const env = process.env.ELPIS_NODE_ENV || 'dev'; // 获取当前环境 默认dev
let envConfig = {};

try {
  // 动态导入对应环境的配置文件（注意：需使用动态 import 或 require）
  envConfig = await import(`./config.${env}.js`);
} catch (error) {
  // 当导入文件不存在时 这里就被触发
  console.warn(`No config file found for environment: ${env}, using defaults`);
}

// 合并配置：环境配置覆盖默认配置
export default {
  ...defaultConfig,
  ...envConfig.default
};
