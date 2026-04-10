// babel 是 编译器 编译工具
// rollup和webpack是打包工具
// 编译工具和 打包工具 不是一个纬度的东西
module.exports = {
  plugins: [
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-transform-react-jsx'
  ],
  presets: ['@babel/preset-env', '@babel/preset-react']
};
