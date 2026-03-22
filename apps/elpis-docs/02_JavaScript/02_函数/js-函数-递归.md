# 递归
- 递归是什么
- 递归就是函数自己调用自己


```js
 
// 用递归函数 求 5的阶乘= 5*4*3*2*1 
function fn(n) {
    if (n == 1) {
        return 1;
    }
    return n * fn(n - 1);
}
console.log(fn(3));

// 用递归函数 求斐波那契数列 规律就是 当前项 等于 前两项之和  [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
 
// 求第n个数
function fib(n) {
    if (n < 2) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2)
}
console.log(fib(5));

```

