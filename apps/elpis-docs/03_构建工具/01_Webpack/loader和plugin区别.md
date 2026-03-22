

loader 是什么



plugin 是什么

区别是什么



如何自定义 loader 和 plugin 

### 问：Plugin 
<!-- 这是一张图片，ocr 内容为：是什么 PLUGIN就是带有APPLY方法的类,APPLY函数可以接收COMPILER和COMPILATION参数用来绑定钩子函数 将CSS单独用LINK引入 MINI-CSS-EXTRACT-PLUGIN PLUGIN 清空DIST目录 CLEAN-WEBPACK-PLUGIN 生成HTML文件自动引入 常见PLUGIN HTML-WEBPACK-PLUGIN 压缩JS代码 UGLIFY-JS-PLUGIN 静态资源直接输出不做处理 COPY-WEBPACK-PLUGIN -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1756978525372-19130827-a1cc-441a-bff0-2e9d03ca4a88.png)

plugin 和 loader 区别

<!-- 这是一张图片，ocr 内容为：LOADER是加载器WEBPACK中一切文件都是模块WEBPACK默认只能处理JS文件 LOADER 扩展了 WEBPACK 可以处理其他文件的功能.比如 CSS VUE等 PLUGIN是插件.WEBPACK就像一个流水线在特定的阶段调用对应的方法从而 LOADER和PLUGIN区别 扩展WEBPACK的功能 总的来说LOADER针对的是文化 是WEBPACK整个流水线功能 文件模块PLUGIN针对的是 -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1756978860129-b67108f4-3d13-4ab4-8f85-7f3947b382de.png)

### 问：Loader 
<!-- 这是一张图片，ocr 内容为：是什么 LOADER是一个函数,接收上一个LOADER传递的内容经过处理传递给下一个LOADER 可以通过THIS.CALLBACK()THIS.ASYNC())等API 来处理同步异步操作 还可以添加RAW属性为TRUE.来处理第一个参数就是BUFFER数据 底层原理 脑海想象3个LOADER组成的数组3个LOADER的PITCH方法从左到右执行 多个PITCH方法 从左到右执行且优先于NORMAL方法执行 LOADER 然后 LOADER的普通方法 从右到左执行 某一个PITCH进行RETURN 后面的PITCH就 不再执行 还可以添加PITCH方法 某一个PITCH进行了RETURN就会中断后面PITCH方法不在执行 CSS-LOADER STYLE-LOADER LESS-LOADER SCSS-LOADER 常见LOADER IMAGE-LOADER URL-LOADER FILE-LOADER BABEL-LOADER ESLINT-LOADER VUE-LOADER TS-LOADER -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1756978501797-f8e70e51-c320-4a52-b9f3-ada258f6ba6e.png)

<!-- 这是一张图片，ocr 内容为：PRE 前置LOADER 常用 普通LOADER NORMAL IMPORT STYLES FORM'STYLE-LOADER!CSS-LOADER?MODULESL./STYLES.CSS 含义就是 使用CSS-LOADER和STYLE-LOADER 处理 STYLES.CSS文件 IMPORT STYLES FORM'!STYLE-LOADER!CSS-LOADER?MODULES!./STYLES.CSS'; 用法 INLINE行内LOADER 跳过NORMAL LOADER IMPORT STYLES FORM'-!STYLE-LOADER!CSS-LOADER?MODULES!./STYLES.CSS LOADER分类 可以使用不同的前缓跳过其他类型的LOADER 跳过PRE LOADER 和 NORMAL LOADER IMPORT STYLES FORM !!STYLE-LOADER!CSS-LOADER?MODULES!./STYLES.CSS 跳过PRE LOADER NORMAL LOADER POST LOADER POST后置LOADER 优先级 同级LOADER 从右到左 从下到上 PRE> NORMAL > INLINE >POST 除了INLINE LOADER 其他LOADER 都是在 MODULE.RULES里面配置 用法 -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1756978987500-6fed3110-a8e6-4a1b-b3fe-7d028d694abc.png)





## loader 「 module.rules 」
+ 官网：[https://webpack.docschina.org/concepts/#loaders](https://webpack.docschina.org/concepts/#loaders) 
+ 官网： [https://webpack.docschina.org/concepts/loaders/](https://webpack.docschina.org/concepts/loaders/) 
+ webpack 本身只认识js和json文件，提供loader是为了让webpack可以处理其他类型文件 比如 .css .vue
+ loader本质是一个函数 plugins本质是一个类 
+ 可以使用的一些loader [https://webpack.docschina.org/loaders/](https://webpack.docschina.org/loaders/) 



```javascript
const path = require('path');
// pnpm i vue-loader -D 需要安装才能使用

module.exports = {
  // 注意loader 在 module.rules这个数组里面
  module: { 
    rules: [
      // 告诉webpack 当遇到「在 require()/import 语句中被解析为 '.vue' 的路径」时，
      // 在你对它打包之前，先 use(使用) vue-loader 转换一下。 
      { test: /\.vue$/, use: 'vue-loader' }
    ],
  }
};


```







## plugins 
+ 官网： [https://webpack.docschina.org/concepts/plugins/](https://webpack.docschina.org/concepts/plugins/)
+ 官网： [https://webpack.docschina.org/concepts/#plugins](https://webpack.docschina.org/concepts/#plugins) 
+ [https://webpack.docschina.org/concepts/under-the-hood/](https://webpack.docschina.org/concepts/under-the-hood/) 
+ [https://webpack.docschina.org/configuration/plugins/](https://webpack.docschina.org/configuration/plugins/) 
+ 一些常用的插件 [https://webpack.docschina.org/plugins/](https://webpack.docschina.org/plugins/) 





+ 如何使用

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // 用于访问内置插件

module.exports = { 
  plugins: [
    // 使用插件 
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ],
};

```

+ 如何自定义plugin



