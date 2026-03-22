# 包依赖



- 生产依赖和开发依赖区别
```js  
https://juejin.cn/post/6844904167513784333

开发的是前端的SPA项目 打包出来是 html css js 生产依赖和开发依赖就没啥区别


dependencies和devDependencies是package.json里面的配置，而package.json和node_modules这套依赖包加载机制是node设计出来的。

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
