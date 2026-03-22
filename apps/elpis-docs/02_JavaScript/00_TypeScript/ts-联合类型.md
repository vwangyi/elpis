## 联合类型
- 定义联合类型的变量
- 联合类型 把两个字面量类型 联合在一起 或者的意思
```ts 
let a: string | number; // 只能赋值string或number

let a1: 10; // 只能赋值 10 

let flag: true | false = true; // 只能赋值 true或false 

let str: '' = ''; // 只能赋值 空字符串

let sex: 'male' | 'female'; // 只能赋值 'male' 或 'female'

  

let obj: {a: number} & {b: number} = {a:1, b:1}; // 只能赋值对象 并且必须有a和b属性 且a和b属性必须是number 
 

```