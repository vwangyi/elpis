const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  lintOnSave: false, // 关闭eslint
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          // modifyVars: {
          //   // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          //   hack: `true; @import "${ path.join(__dirname, './src/assets/theme') }.less";`,
          // },
        }
      }
    }
  }
});
