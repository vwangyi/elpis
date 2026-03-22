
```ts
/* ========================== */
/* ===== 兼容移动端宽度 ======= */ 避免使用构造函数作为类型 

string // 能接收 '1' `1` "1" `dddd${a}`   不能赋值 new String(1)
String // 不仅可以赋值字符串 还可以 赋值 字符串对象 new String(1)
number // 能接收 1 NaN -Infinity -2 -1.0 0 1.0 2 Infinity  6 0xf00d 0b1010 0o744
Number 
boolean // true false  注意Boolean(1)返回true
Boolean // true false new Boolean(1) 注意 new Boolean(1)返回 布尔实例对象


```

## number类型 
- 定义number类型变量
```ts
var n: number;
var n1: number = 1;
var n2 = 1; // 类型推导
 

```

## string类型
- 定义string类型变量
```ts
var str: string;
var str1: string = '';
var str2 = ''; // 类型推导
```

```ts  
let b: boolean;
b = false; // 编译通过
b = true; // 编译通过
b = "1"; // 编译报错 

// 编译后的js
let b;
b = true; 
```