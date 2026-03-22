# Number 
- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number

- number是一个基础数据类型 不是对象，也就没有属性和方法。
- js提供了 原始值包装对象（Primitive Wrapper Objects） 把 number string boolean 都包装成对象了

- 创建数字


## 创建数字
```js 
const n = 0; // 字面量方式
const n = Number(1);
const n = Number(1); // 一个原始值 当一个原始值访问属性或方法时 就回转为包装类型对象 
const n = new Number(1); // 返回一个 number对象  




// 整数 小数 负数 正数 无穷大 NaN 八进制 16进制

const n = 1;
const n = -1;
const n = -0;
const n = +0; 
const n = 1;
const n = .1; // 0.1 
const n = 123_123; // 123123
const n = 1e3; // 1000 e后面多少数字 就是多少个0 
const n = NaN; 
const n = Infinity; // 正无穷大
const n = -Infinity;  // 负无穷大 
const n = 0xff; // 十进制为255 十六进制表示
const n = 0b11111111; // 二进制为255  
const n = 0o12; // 0o12 === 10 // true 
```


## 数字判断
```js
// 判断是数字 
typeof 123 === 'number'; // true 
toString.call(123) === '[object Number]'; // true 
 

// 判断整数 Number.isInteger() 
console.log(Number.isInteger(42));     // true
console.log(Number.isInteger(42.0));   // true（注意：42.0 也是整数）
console.log(Number.isInteger(42.5));   // false
console.log(Number.isInteger(-42));    // true
console.log(Number.isInteger(0));      // true
console.log(Number.isInteger(NaN));    // false
console.log(Number.isInteger(Infinity)); // false
console.log(Number.isInteger("42"));   // false（字符串不是数字）

// 判断小数
function isDecimal(num) {
  return typeof num === 'number' && isFinite(num) && num % 1 !== 0;
}

// 判断正数（大于0）
function isPositive(num) {
  return typeof num === 'number' && num > 0;
}

// 判断负数（小于0）
function isNegative(num) {
  return typeof num === 'number' && num < 0;
}
// 判断 NaN
isNaN(NaN); // true  判断是否是数字中的NaN 
isNaN(1); // false

Number.parseInt === window.parseInt; // true 
Number.isNaN === window.isNaN // false  两者有什么区别

// 判断是否是 合法的价格
function isPrice(n) {
    n = Number(n) // 必须是数字 
    const result = 
      !isNaN(n) && // 不能是 NaN 
      n !== Infinity && // 不能是  Infinity
      n !== -Infinity && // 不能是  -Infinity 
      n >= 0; // 不能为负数 
    return result; 
}
// 格式化为金额 显示
funciton price2money(n) {
   return String(n)
}
```


## 数字存储
```js
0.1 + 0.2 !== 0.3 // true  为什么不等于 因为精度问题
```


## 
```js 
22..toString() // 调用方法
(22).toString() // 调用方法 
  

```