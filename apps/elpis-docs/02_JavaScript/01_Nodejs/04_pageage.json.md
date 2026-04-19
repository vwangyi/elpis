# package.json
```js
npm init
npm init -y # 生成默认的 package.json 
name 表示 npm包名
version 表示 npm包版本
main 表示 esmodule语法的入口文件相对路径 当 require导入时 就会从这个目录导入
module 表示 commonjs语法的入口文件相对路径 当  import xx from 'vue' 


scripts 表示一个映射对象， npm run key名 执行 value的语句

dependencies 表示生产依赖 npm i xxx -S // -S 等价 --save   是默认的 可以不写 
devDependencies 表示开发依赖 npm i xxx -D // -D 等价 --save-dev 
files: ["index.js", "dist"] // 发布npm时 只上传这2个文件 

```

## 包版本号 
```json
{
    "version": "0.0.1", 
}
```
```js 


版本号是什么：用点分隔的三个数字，分别表示 主版本、次版本、补丁版本。
主版本：表示重大变更。可能存在不兼容情况
次版本：表示新增功能，并且向后兼容。
补丁版本：表示一些bug修复

"^3.2.0" 表示：^（插入符）表示允许 次版本和补丁版本 自动更新，不允许主版本自动更新 

"~3.2.0" 表示：~（波浪号）表示 补丁版本自定更新 主版本和次版本都不会更新。

"3.2.0" 表示：无符号表示精确版本，不自动更新。

某一位+1；后面所有位都归0；

存在package-lock.json文件 会优先读取lock文件的锁定版本


npm list vue # 查看已安装的版本
npm outdated # 查看哪些包可以更新
npm update # 更新到最新兼容版本
npm update vue # 更新指定包

npm i i5ting_toc -g # i5ting_toc是一个可以把md文件转为html文件的包 
i5ting_toc -f md文件路径 -o

```


 
## 包依赖
- 生产依赖和开发依赖区别 devDependencies 和 dependencies
```js  
https://juejin.cn/post/6844904167513784333

开发的是前端的SPA项目 打包出来是 html css js 生产依赖和开发依赖就没啥区别


dependencies 和 devDependencies 是package.json里面的配置，而package.json和node_modules这套依赖包加载机制是node设计出来的。

我们如果开发一个node服务，这个后端服务需要部署上线，确实要尽量严格区分dependencies和devDependencies，
因为项目本身就是运行态，如果部署上线我们不会希望把开发态的一些工具，例如测试框架等，带到线上。

如果开发npm包也是有区别的，假设我们开发npm包A，并把它发布，在某个项目中引入了依赖包A，
  A下载的话也有自身的node_modules，如果A的依赖里有B，B在dependencies的话就会一起被下载到A的node_modules，
    如果是开发的话，就不会下载，这样我们写npm包A的时候，要把webpack或者gulp或者jest等开发依赖放到devDependencies，
      来减少别人使用A时下载的包大小。

如果是普通的SPA前端项目，那确实没啥区别，因为我们实际上是用的项目生产出来的静态页面文件，
  部署的时候部署的页面也只是webpack打包生产出来的产品，所以依赖包放在dependencies和devDependencies没啥区别。
但是多说一嘴：有些自动构建工程build脚本会加上--production的参数，这个时候不会拉devDependencies的包，
  导致build流程异常，所以丹建议我们尽量都放到dependencies里面!
拓展
有兴趣的还可以了解一下 peerDependencies、bundledDependencies、optionalDependencies这些是什么依赖，不过注意要慎用！
 
```
