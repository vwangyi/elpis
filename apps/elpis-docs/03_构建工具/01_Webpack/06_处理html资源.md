# 处理.html文件

> webpack.config.js

```js
// npm i html-webpack-plugin -D
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"), // 模板文件路径
    }),
  ],
};
```


## 引入html模版
```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: '', // 使用html模版的位置在哪
            // 模版的输出路径， 可以不和 js css 放一起 但为了规范还是放一起
            filename: path.resolve(process.cwd(), './dist', 'index.html'),
            // 注入代码块 比如 <script src="xxx.bundle.js"></script> 
            chunks: ['entry.page1'], // 这个需要和入口的key 一致 
        })
    ]   
}
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    vendor: ['react', 'react-dom']
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      // 基础配置
      title: '企业官网',
      filename: 'index.html',
      template: './src/template.html',
      
      // 资源注入
      inject: 'body',
      publicPath: process.env.NODE_ENV === 'production' 
        ? 'https://cdn.example.com/' 
        : '/',
      scriptLoading: 'defer',
      
      // 页面元素
      favicon: './src/favicon.ico',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        'X-UA-Compatible': 'IE=edge',
        description: '企业官网 - 专业的服务提供商',
        keywords: '企业,服务,专业'
      },
      
      // 模板参数
      templateParameters: {
        appVersion: '1.0.0',
        buildTime: new Date().toLocaleString(),
        environment: process.env.NODE_ENV
      },
      
      // 优化
      minify: process.env.NODE_ENV === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      } : false,
      
      hash: true,
      cache: true,
      
      // chunk 配置
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      excludeChunks: ['test'],
      
      // 调试
      showErrors: true
    })
  ]
};
```
