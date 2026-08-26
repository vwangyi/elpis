
## 数组 和 元组

```ts
/* 数组 Array */
let stringArr: string[] = ['1', '2']; // string数组 表示 数组项的类型只能是string 

let objArr: object[] = [{},{}]; // 对象数组 表示数组项的类型是object

let numberArr: number[] = [1,1,1]; // snumber数组 表示 数组项的类型只能是number



/* 元组 Tuple： 固定长度的数组 */
let t: [string, number] = ['1', 2]; // 只能赋值长度为2 且 第一项为string 第二项为数字 的数组
t.push(1) // 虽然可以push已经存在的类型 但不建议  

let t1: readonly [number, number] = [1 ,2]; // 只读的 不能修改
t1[0] = 11; // 报错
t1.push(3) // 报错 


``` 