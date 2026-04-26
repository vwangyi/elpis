// src/utils/env.tsWebpack 通常使用 process.env.NODE_ENV，而 Vite 使用 import.meta.env。为了共用代码，你可以封装一个统一的环境变量工具：
export const env = (key: string) => {
  // Vite 环境
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // Webpack 环境
  return process.env[key];
};

env('Node_env');
