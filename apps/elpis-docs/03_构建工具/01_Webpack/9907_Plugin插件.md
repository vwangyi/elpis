# 插件


### 16. webpack 插件如何实现
+ compiler对象代表了完整的webpack环境配置。这个对象在启动webpack时被一次性建立，并配置好所有可操作 的设置，包括options、loaderffiplugin。当在webpack环境中应用一插件时，插件将收到此compiler的引 用。可以使用它来访问webpack的主环境
+ compilation对象代表了一次资源版本构建。当运行webpack开发环境中间件时，每当检测到一个文件变化，就会 创建一个新的compilation,从而生成的编译资源，<sup>     </sup>compilation对象表现了当前的模块资源、编译生成 资源变化的文件、以及被跟SS依赖的状态的信息。compilation对象也提供了很多关键脚的回调，以供插件使用
+ 创建一个插件函数，在其prototype上定义apply方法，指定一 ebpack自身的事件钩子
+ 函数内部处理webpack内部实例的特箴据
+ 处理完成后，调用webpack提供的回调函数

```js
function MyWebpackPlugin()(
}；
//prototype 上定义 apply 方法
MyWebpackPlugin, prototype.apply=function(){
〃指定一个事件函数挂载到webpack
compiler.pluginCwebpacksEventHook"funcion (compiler)( console. log(H 这是一个插件”)；
〃功能完成调用后webpack提供的回调函数
callback()
})
```





### 8. 有哪些常见的**Plugin**？


+ define-plugin：定义环境变量
+ html-webpack-plugin：简化html⽂件创建
+ uglifyjs-webpack-plugin：通过 UglifyES 压缩 ES6 代码
+ webpack-parallel-uglify-plugin: 多核压缩，提⾼压缩速度
+ webpack-bundle-analyzer: 可视化webpack输出⽂件的体积
+ mini-css-extract-plugin: CSS提取到单独的⽂件中，⽀持按需加载



### 9. **Loader**和**Plugin**的不同？
**不同的作用：**

+ **Loader**直译为"加载器"。Webpack将⼀切⽂件视为模块，但是webpack原⽣是只能解析js⽂件，如果想将其他⽂件也打包的话，就会⽤到 loader 。 所以Loader的作⽤是让webpack拥有了加载和解析⾮JavaScript⽂件的能⼒。
+ **Plugin**直译为"插件"。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运⾏的⽣命周期中会⼴播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。



**不同的用法：**

+ **Loader**在 module.rules 中配置，也就是说他作为模块的解析规则⽽存在。 类型为数组，每⼀项都是⼀个 Object ，⾥⾯描述了对于什么类型的⽂件（ test ），使⽤什么加载( loader )和使⽤的参数（ options ）
+ **Plugin**在 plugins 中单独配置。 类型为数组，每⼀项是⼀个 plugin 的实例，参数都通过构造函数传⼊。

