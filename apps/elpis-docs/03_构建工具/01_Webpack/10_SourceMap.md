
## sourceMap
- 源码映射 

- 开发环境和生产环境都需要 区别是
- 区别是 开发环境只需要定位到错误的行信息就行  生产环境则是需要定位到完整的行列信息 且 生产环境的map文件单独存放在服务器 不能给用户
- 现实情况是 生产环境往往也会出现问题 有了soucemap文件就比较好排查 但需要注意安全问题

```js
// 场景：比如 业务文件源码中 手动写一个错误 null.xxx 就会报错 但浏览器控制台的错误信息 行数是 编译后的代码位置 而不是源码位置

// 多生成 xxx.map文件  浏览器会自动识别map映射文件 从而浏览器控制台的错误信息是 正确的源码位置

module.exports = {
  devtool: "", // 取值 看官网  ai问区别
  // 一般用下面两个
  devtool: "cheap-module-source-map", //  开发使用 只包含行 没有列  打包速度稍快
  devtool: "source-map", //  生产环境使用 包含行列 打包速度较慢
};
```







## devtool （源码映射 source map）
+ [https://webpack.docschina.org/configuration/devtool/](https://webpack.docschina.org/configuration/devtool/) 







+ sourceMap
    - sourcemap是打包后的代码和源代码的映射文件
    - 有了打包后的代码和sourcemap文件 就可以还原成 源码 所以在chrome浏览器中可以查看源码报错的位置
    - 在生产环境下 sourcemap 通常不会发布到线上 而是上传到异常监控服务器用于解析线上的错误信息
    - 是什么
        * sourceMap是源代码映射 可以方便调试 提供源代码报错位置 而不是打包后的位置
    - 怎么用
        * devtool: 'cheap-module-source-map',
        * devtool: 'source-map',

<!-- 这是一张图片，ocr 内容为：SOURCEMAP是打包后的代码和源代码的映射文件 有了打包后的代码和SOURCEMAP文件就可以还原成 源码 所以在CHROME浏览 器中可以查看源码报错的位置 在生产环境下SOURCEMAP通常不会发布到线上而是上传到异常监控服务器 SOURCEMAP 用于解析线上的错误信息 SOURCEMAP是源代码映射可以方便调试提供源代码报错位置而不是打包后的位置 是什么 DEVTOOL:'CHEAP-MODULE-SOURCE-MAP', 怎么用 DEVTOOL:'SOURCE-MAP', -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1757041462817-40b2d690-798a-4f44-a131-566d9bdbc683.png)

