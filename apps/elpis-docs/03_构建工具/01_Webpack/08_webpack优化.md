# 

css - 代码压缩

js - 代码压缩 代码分割 多进程打包 指定处理范围 使用缓存 使用浏览器缓存

图片 - 小图转base64 

字体 - 


## 指定处理范围
- exclude include 

## 使用缓存
- 

## 

# Promise 



模块分包怎么做



代码压缩 怎么做



解析编译怎么做 loader ·



用 express 启动开发服务器 实现 webpack-dev-server	


## 脑图
```js
● webpack优化
  ○ 是什么
    ■ webpack优化 主要从 构建速度和产物体积 两个维度进行优化
    ■ 构建速度 主要是 影响开发效率，可以用多线程打包、缩小处理范围、使用缓存等提升速度。
    ■ 产物体积主要是影响用户体验，可以先用可视化插件 查看整体的体积大小，然后使用 代码分割、代码压缩、等手段进行优化。
```
 
 代码分割怎么做的？





每一点怎么做的？


+ 对 webpack 的理解
+ 说说 webpack 的构建流程
+ webpack 中常见的 loader
+ Webpack 中常见的 Plugin
+ Loader和Plugin的区别，以及如何自定义Loader和Plugin
+ Webpack 热更新 实现原理
+ Webpack Proxy工作原理
+ 如何借助Webpack来优化性能
+ 提高Webpack的构建速度
+ webpack 实践经验
+ https://zhuanlan.zhihu.com/p/443964387






### 13. 如何用**webpack**来优化前端性能？
⽤webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运行快速高效。

+ **压缩代码**：删除多余的代码、注释、简化代码的写法等等方式。可以利用webpack的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩JS⽂件， 利用 cssnano （css-loader?minimize）来压缩css
+ **利用CDN加速**：在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。可以利用webpack对于 output 参数和各loader的 publicPath 参数来修改资源路径
+ **Tree Shaking**：将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数 --optimize-minimize 来实现
+ **Code Splitting：**将代码按路由维度或者组件分块(chunk)，这样做到按需加载，同时可以充分利用浏览器缓存
+ **提取公共第三⽅库**：SplitChunksPlugin插件来进行公共模块抽取，利用浏览器缓存可以长期缓存这些无需频繁变动的公共代码



### 14. 如何提高**webpack**的打包速度**?**
+ happypack: 利用进程并行编译loader，利用缓存来使得 rebuild 更快，遗憾的是作者表示已经不会继续开发此项目，类似的替代者是thread-loader
+ 外部扩展(externals): 将不怎么需要更新的第三方库脱离webpack打包，不被打入bundle中，从而减少打包时间，比如jQuery用script标签引⼊
+ dll: 采用webpack的 DllPlugin 和 DllReferencePlugin 引入dll，让⼀些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间
+ 利用缓存: webpack.cache 、babel-loader.cacheDirectory、 HappyPack.cache 都可以利用缓存提高rebuild效率缩小文件搜索范围: 比如babel-loader插件,如果你的⽂件仅存在于src中,那么可以 include: path.resolve(__dirname,'src') ,当然绝大多数情况下这种操作的提升有限，除非不小心build了node_modules文件



### 15. 如何提高**webpack**的构建速度？
1. 多入口情况下，使用 CommonsChunkPlugin 来提取公共代码
2. 通过 externals 配置来提取常用库
3. 利用 DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。
4. 使用 Happypack 实现多线程加速编译
5. 使用 webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。 原理上 webpack-uglify-parallel 采用了多核并行压缩来提升压缩速度
6. 使用 Tree-shaking 和 Scope Hoisting 来剔除多余代码


### 17. webpack如何实现持久化缓存
+ 服务端设置http缓存头（cache-control）
+ 打包依赖和运行时到不同的chunk，即作为splitChunk,因为他们几乎是不变的
+ 延迟加载：使用import()方式，可以动态加载的文件分到独立的chunk,以得到自己的chunkhash
+ 保持hash值的稳定：编译过程和文件内通的更改尽量不影响其他文件hash的计算，对于低版本webpack生成的增量数字id不稳定问题，可用hashedModuleIdsPlugin基于文件路径生成解决



### 18. 如何用webpack来优化前端性能？
⽤webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运⾏快速⾼效。



+ **压缩代码**：删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤webpack的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩JS⽂件， 利⽤ cssnano （css-loader?minimize）来压缩css
+ **利⽤****CDN****加速**: 在构建过程中，将引⽤的静态资源路径修改为CDN上对应的路径。可以利⽤webpack对于 output 参数和各loader的 publicPath 参数来修改资源路径
+ **Tree Shaking**: 将代码中永远不会⾛到的⽚段删除掉。可以通过在启动webpack时追加参数 --optimize-minimize 来实现
+ **Code Splitting:** 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存
+ **提取公共第三⽅库**: SplitChunksPlugin插件来进⾏公共模块抽取,利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码

