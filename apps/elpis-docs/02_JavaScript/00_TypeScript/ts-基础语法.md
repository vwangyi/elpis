# 基础语法

- 理论和实践都要过关 ，前端 配合 vue3 写项目, 后端 nestjs 写项目。
 
- ts源码：https://github.com/microsoft/TypeScript 
- ts官网：https://www.typescriptlang.org/
- ts环境：https://www.typescriptlang.org/play
- ts环境：https://www.typescriptlang.org/zh/play/
- TS 练习：https://typescript-exercises.github.io/ 
- 中文 TS 官网：http://www.tslang.cn/docs/home.html

- ts虽然是一个nodejs写的js库 但把ts当成一门语言来学更好。



## ts是什么
- ts是js的超集，

TS 是 JavaScript 的超集，JS 的值是有类型的，但声明的变量没有类型，TS 就是让声明的变量有类型。

TS 编译器 可以把 TS 编译成 任意版本的 JS 比如 es5 的 js es6 的 js。
TS是用开发成本换取维护成本, 项目规模越大, TS要求更严格, 像框架、和库, 几乎都会上TS，像一些小项目 维护成本本身就不高，就不用上TS或TS 不严格。

TS 环境搭建
npm i -g typescript # 拿到tsc命令 

tsc xxx.ts # 编译TS文件得到JS文件
tsc xxx.ts -w # watch 实时编译 单个文件


tsc -w # watch 实时编译当前目录 多个文件 前提是 必须有 tsconfig.json配置文件
