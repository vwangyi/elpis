## any 和 unknown
- 定义any类型的变量
- 定义unknown类型的变量
```ts
let a; // 默认就是 any类型
let a1: any;
let a2: any = 123;
let a3: any = '';

 
let b1: unknown;
let b2: unknown = 123;
let b3: unknown = '';

// any和unknow的区别 面试题 
// any类型的变量 可以赋值给 任意类型的变量 
// unknown类型的变量 只能赋值 unknow类型的变量


unknown类型的变量是 可以赋值任意类型的值;
any类型的变量不仅可以解释


// 相同点：都可以接收任意值的类型 
// 不同点：

// 注意区分： 值的类型 和 变量的类型


// any类型变量 会污染 其他变量， unknown只会污染自己 不会污染别人  能用unknow 就不用any 

let e: unknown;
let str: string; 
if (typeof e === 'string') { // 把unknown 赋值给string 
    str = e;
} 
str = e as string; // 类型断言     应用场景 ts编译器不知道e的类型 但我知道是string  那么就用类型断言 告诉ts编译器 你不用管了 这就是string 以后有错也不怪你
str = <string>e; // 类型断言的另一种用法 常用是as 
```

问：any 和 unknown 区别
● 相同点都 any 类型或 unknown 类型的变量 都可以  接收  任意类型的数据
● 不同点：
  ○ any 类型的变量 可以  赋值 给 任意类型的变量 但是 unknown 类型的数据 只能赋值给 unknown 类型的变量
  ○ any类型的对象 可以访问对象的属性方法 unknown类型的对象 不能访问对象的属性方法
● 一般推荐使用 unknown  不推荐使用 any