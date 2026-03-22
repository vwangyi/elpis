# js数据类型





## 脑图

- 是什么
  - JS 数据类型是 7 个基本类型和 1 个引用类型。
  - 分别是 string number boolean、 null undefined、 bigint symbol 和 object 


- js中数据有类型，变量没有类型，ts中变量才有类型。

## string number boolean
- 原始包装对象

## null
```js
typeof null; // 'null' 
```

## undefined
```js
typeof undefined; // 'undefined' 
``` 
## BigInt
```js
// 方式一：使用 n 后缀（字面量）
let bigInt1 = 9007199254740993n; // 超过 Number.MAX_SAFE_INTEGER 9007199254740991

// 方式二：使用 BigInt() 函数
let bigInt2 = BigInt("9007199254740993");
let bigInt3 = BigInt(9007199254740993);

// TypeScript 中指定类型
let bigIntVar: bigint = 12345678901234567890n;


typeof bigInt2; // 'bigint'


```

## symbol 
- 
```js
typeof symbol; // 'symbol'
```