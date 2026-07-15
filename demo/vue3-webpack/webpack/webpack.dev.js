// webpack/webpack.dev.js - 精简版
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

const rootPath = process.cwd();

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    host: 'localhost',
    static: {
      directory: path.resolve(rootPath, './dist')
    },
    client: {
      overlay: true,
      progress: true
    },
    proxy: [
      {
        context: ['/api'], // 注意：属性名从 key 改为 context 数组
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    ],
    // SPA 路由支持
    historyApiFallback: true
  },

  // 开发环境优化
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all'
    }
  },

  // 输出配置
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
    publicPath: '/'
  },

  // 缓存加速
  cache: {
    type: 'filesystem'
  },

  // 性能提示
  performance: {
    hints: false
  }
});
