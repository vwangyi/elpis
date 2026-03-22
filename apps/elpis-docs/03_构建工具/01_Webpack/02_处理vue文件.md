# 处理.vue文件

> webpack.config.js

```js
// npm i vue-loader -D
const { VueLoaderPlugin } = require("vue-loader");
module.exports = {
  //...
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.vue$/,
            use: { loader: "vue-loader" },
          },
          {
            test: /\.jsx?$/,
            use: { loader: "babel-loader" },
          },
        ],
      },
    ],
  },
  plugins: [
    /**
     * 将 /\.js$/ 中的规则 应用到 .vue文件中的 <script> 模块里
     * 因为 <script> 里面写的东西就是js
     */
    new VueLoaderPlugin(),
  ],
};
```
