# commonjs


- nodejs环境 支持两种模块化 
 - commonjs
 - esm  （package.json 设置 type:module）





● 模块化 (包）
  ○ 是什么
    ■ 模块化是指解决一个复杂问题时，自顶向下逐层把系统划分成若干模块的过程。对于整个系统来说，模块是可组合、分解和更换的单元。
    ■ 编程领域中的模块化，就是遵守固定的规则，把一个大文件拆成独立并互相依赖的多个小模块。
  ○ 好处
    ■ 提高了代码的复用性提高了代码的可维护性可以实现按需加载
    ■ 模块化规范就是对代码进行模块化的拆分与组合时，需要遵守的那些规则。例如:使用什么样的语法格式来引用模块在模块中使用什么样的语法格式向外暴露成员模块化规范的好处:大家都遵守同样的模块化规范写代码，降低了沟通的成本，极大方便了各个模块之间的相互调用利人利己。

* 1.什么是模块作用域
 * 模块作用域本质就是一个函数作用域
 * 和函教作用域类似在自定义模块中定义的变量、方法等成员，只能在当前模块内被访问，
 * 这种模块级别的访问限制，叫做模块作用域。
 * 
 * 
 * 
 * require()函数 返回的就是 module.exports的值
 * 
 * NodeJS中 遵循的就是 CommonJS规范
 * CommonJS规范规定 
 * 每个模块内部 都有一个module对象 module变量代表当前模块
 * module对象有一个exports属性 默认值是一个空对象 {} 用于导出模块
 * require()函数返回的就是 module.exports的值 用于加载模块
 * 
 * 浏览器JS 遵循的是ES6模块化规范 import export 
 * 

 */

// 1. AMD  require.js 
// 2. CMD  sea.js 
// 3. CommonJS  node.js 
// 4. ES6  es6模块化 
// 5. UMD  统一模块化规范 
// 6. ESM  es6模块化 
// 7. SystemJS  es6模块化

```js

// node 中一个 js 文件就是一个模块，可以理解为 一个 js 文件所有内容 都用一个函数包裹。 

function (exports, require, module, __filename, __dirname) {  
 
    /**
     * 模块化: 将复杂的文件按照一定的规范(Common.js)拆分成多个文件的过程
     * 模块: 拆分出的文件就是一个模块
     * 在Node中 一个模块就是一个文件 一个文件本质就是一个函数
     */ 
    console.log(arguments.callee + '')// 只有函数内部才有arguments对象 
    console.log('global', global, globalThis) // node中的全局对象 相当于 浏览器的window对象
    console.log('exports', exports) // {} 
    console.log('require', require) // function require() { [native code] }
    console.log('module', module) // module: { ... }    
    console.log('__filename', __filename) // /Users/wy/nodejs/Nodejs/global/模块作用域.js
    console.log('__dirname', __dirname) // /Users/wy/nodejs/Nodejs/global 
    // 推荐使用`path.join()`来辅助拼接 ???????????????? 
    // 这里的this 指向 module.exports
    console.log(this === module.exports) // true 



    // 导出   module.exports就是一个变量  
    module.exports = {} // 默认导出一个空对象
    module.exports = 'hello'  // 导出一个
    module.exports = { foo1: 'hello', foo2: 'world' } // 导出多个 

    exports = module.exports // exports 也是一个变量 默认值是 module.exports的引用地址 exports指向module.exports
    exports = 'hello' // 重新赋值 会切断对module.exports的引用 不再指向module.exports
    exports.foo1 = 'hello' // 对foo1赋值 不会切断引用关系 
    exports = module.exports // 重新建立引用关系 为啥exports指向module.exports 为了简写
     
    // 导入  require
    const 自定义变量名 = require('核心模块名')      // const fs = require('fs')
    const 自定义变量名 = require('第三方模块名')    // const _ = require('lodash');
    const 自定义变量名 = require('自定义模块路径')  // const { mass } = require('./index1')  
    
 
}
```

 