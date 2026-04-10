module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset',

    '@babel/preset-env' // 支持最新的 JavaScript 语法
    // "@vue/babel-preset-jsx", // 添加 Vue JSX 支持
  ],
  env: {
    development: {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
      plugins: ['dynamic-import-node']
    }
  },

  plugins: [
    // "@vue/babel-plugin-jsx", // 使用 Vue JSX 插件
  ]
};
