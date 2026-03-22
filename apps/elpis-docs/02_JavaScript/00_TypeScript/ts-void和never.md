# void 和 never



- 定义void类型的变量
- 当函数没有返回值 或 返回undefined 时 使用 
```ts
let a: void = undefined; // 只能赋值 undefined
function fn(): void {} // 默认返回undefined
```

- 定义never类型变量
- 当函数报错 永远不会有返回值 就用never 
```ts 
// 函数内部报错 永远不会有返回值 就用 never 
function sum12(): never{
    throw new Error('');
}
```