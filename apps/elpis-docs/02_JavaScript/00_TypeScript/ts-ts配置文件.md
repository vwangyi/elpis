# tsconfig
- ts配置文件
```json
{ 
    /* 需要编译哪些文件 */
    "include": [
        "./**/*", //  **表示任意文件夹 *表示任意文件
    ],
    /* 需要排除哪些 文件不编译 */
    "exclude": [
        // "./dist/**/*",
        // "./project/**/*",

    ],
    // "extends": "./config/base",  继承某个文件配置 继承多个就传数组
    // "files": []  // 和include 类似 这里是指定文件 一般demo项目就只有2个文件 就可以用 files来指定
    
    
    "compilerOptions": {
        "target": "es6", // 编译后的js版本 比如 es5 se6 可以给一个错误的值 报错提示支持哪些值
        "module": "es6",
        // // 写一个错误的值 就会提示支持哪些值  浏览器环境一般不用管lib 默认就是浏览器环境 比如 dom 浏览器环境用 nodejs环境就没有dom 
        // "lib": ["xxxxxxxxxx"], 

        "outDir": "./dist", // 编译后的产物放哪里  

        // "outFile": "./dist/app.js", // outFile设置一个路径后 会把所有的全局作用域下的代码 合并到一起

        "allowJs": false, // 是否把 js文件 也编译到 最终目录里面 
        "checkJs": false, // 是否检测 js 文件的语法错误
        "removeComments": false, // 是否移除注释
        "noEmit": false, // 是否 不生成产物到硬盘上  设置true就没有任何js产物了
        "noEmitOnError": false, // 设置为true 当有错误时就不会生成js产物了


        "strict": true, // 所有严格的总开关  建议打开 设置为true 注意设置为true 将会更严格 
        "alwaysStrict": false, // 是否 使用js的严格模式 
        "noImplicitAny": false, // 是否允许 默认值是 any  设置true后 变量不给类型就会报错 
        "noImplicitThis": false, // 不允许 未明确类型的this 
        "strictNullChecks": false, // 是否严格检测 空值 比如 getElementById获取元素 获取不到就是null 获取到就是 Document 

    }
}
```

```ts
// cd 进入当前目录 
// npm i -g typescript # 得到tsc命令
// tsc # 会读取当前目录下tsconfig.json 配置 进行编译 生成dist文件
```


```ts
{
  // exclude 配置项 指定哪些文件不需要被编译 
  // 默认值为 ["node_modules", "bower_components", "jspm_packages"]
  "exclude": ["./src/hello/**/*"],


  // extends 配置项 继承其他配置文件 相当于 引用过来
  "extends": ["./xxx.json"],



  // include 配置项 指定哪些文件需要被编译  **表示任意目录 *表示任意文件
  "include": ["./src/**/*"], 

  // files 配置项 指定哪些文件需要被编译 优先级高于include
  "files": ["./src/index.ts"],




  "compilerOptions": {
    // 用于指定编译为 es 的哪个版本 不知道可选值 可以乱写一个让它报错 看看报错信息 也可以百度
    "target": "es5",
    // 指定编译后的代码的模块化规范 es2015 commonjs ...
    "module": "commonjs",
    // 用来指定编译前 ts文件 使用哪些库 一般不需要设置 同样的看可选值 看报错信息
    "lib": ["es2015", "dom"],
    // 用来指定编译后的js代码放在哪个目录下
    "outDir": "./dist",
    // 把多个ts文件编译为一个js文件
    "outFile": "./dist/bundle.js",
    // 是否对js文件进行编译 默认值为false不编译
    "allowJs": true,
    // 是否对js文件进行ts类型检查 默认值为false不检查
    "checkJs": true,
    // 是否移除编译后的js代码中的注释 默认值为true 移除
    "removeComments": false,
    // 是否生成编译后的js文件 可以不生成 相当于只做类型检查
    "noEmit": false,
    // 当有错误时 是否生成编译后的js文件 非常重要建议开启 有错误 编译就通不过
    "noEmitOnError": true,


    // 所有严格模式总开关 建议开启 为true 下面的都会true
    "strict": true, 




    // 是否对编译后的js代码使用严格模式 默认值为false 不使用   
    // js中 使用 "use strict" 表示当前作用域使用严格模式 
    // js中有严格模式 开启严格模式 要比普通模式严格一些 性能会好一些
    "alwaysStrict": false,




    // 是否不允许隐式的any类型 默认值为false  
    "noImplicitAny": true,




    // 是否不允许this不明确类型 默认值为false  
    // function fn2(this: Window) {
    //   console.log(this)
    // }
    "noImplicitThis": true,




    // 是否严格检查null值 默认值为false 非常建议开启 有些变量有存在null的情况
    "strictNullChecks": true, 
  }
}
```