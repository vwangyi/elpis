# TypeScript 

- github：https://github.com/microsoft/TypeScript
- 官网：https://www.typescriptlang.org/zh/
- 在线环境：https://www.typescriptlang.org/play/

- 社区中文版：https://ts.nodejs.cn/


## 环境搭建
- 


```ts
// Ts
// 1 global.d.ts 是用来声明ts类型的文件，.d.ts是区分普通ts文件

// 2. 三斜杠语法是扩展ts类型  写了三斜杠语法 表示告诉ts 你之前找不到类型，现在可以在vitest/globals 里面找到类型
/// <reference types=“vitest/globals”>
```


```sh
npm install typescript --save-dev
npm add -D -w typescript @types/node

npx tsc xxxx.ts 
```



tsconfig.json 

