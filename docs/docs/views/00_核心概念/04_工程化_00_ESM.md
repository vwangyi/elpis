# es module 

[ESM官网](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
 
# module模块
- module是模块，一个包可以拆分为多个模块，一个模块就是一个js
 
- MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules
- V8：https://v8.dev/features/modules


## export语句 import语句  
- 使用 export 语句导出
- 使用 import 语句导入
- 只能在顶层（最外层）使用export，不能在函数内部使用export   导入导出 export export default 只能顶层使用（最外层） 
- 每个模块 可以多个具名导出 但只能有一个默认导出
```js 
// a.js
export var a = 1;
export let b = 2;
export const c = 3;
export function d() {}
export class e {} 
// export { a, b, c, d, e }; // 具名导出 和上面的方式 二选一

export default { a, b, c, d, e }; // 默认导出 default就是默认名字

// b.js 
import { a, b, c, d, e, default as all1 } from './a.js'; // 拿了所有的具名导出和默认导出
import { a as aa, default as all2 } from './a.js'; // 只拿了一个具名导出 和 默认导出

import { default as all3 } from './a.js'; // 只拿了默认导出
import all4 from './a.js'; // 只拿了默认导出

import all6, { a as aaa, b as bbb } from './a.js'; // all6是默认导出 a和b是具名导出 用as是重命名防止命名冲突

import * as all from './a.js'; // 同时拿了默认导出和具名导出 all.a 和 all.default 
```
## 重命名避免命名冲突
```js
// module.js 中
export { function1, function2 };

// main.js 中
import {
  function1 as newFunctionName,
  function2 as anotherNewFunctionName,
} from "./modules/module.js";
```


## 合并模块
```js
export * from "x.js";
export { name } from "x.js"; 
// 合并模块 就是 单独写一个js 里面导入所有模块 然后统一导出； 
// 用于解决 某个文件有大量的import 比如 有 2000 个 满屏import 
```

## 动态导入
```js
import("/modules/mymodule.js").then((module) => {
  // 使用模块做一些事情。
});
```

## 支持顶层await
```js
// fetch 请求
const colors = fetch("../data/colors.json").then((response) => response.json());
export default await colors;
```

## 导入有变量提升
```js
// …
const myCanvas = new Canvas("myCanvas", document.body, 480, 320);
myCanvas.create();
import { Canvas } from "./modules/canvas.js";
myCanvas.createReportList();
// …
```
## .mjs和js



## esm和commonjs的区别

```js  
// 1. 导出不同， esm的导出（export 或 export default）是值的引用， commonjs（module.exports或exports）是值的浅拷贝
// 2. 导入不同， esm的import from 是 异步导入， commonjs的require函数 是 同步导入
// 3. this指向不同，esm中 this指向 undefined 因为是严格模式，  commonjs 中 this指向 module.exports 对象
```