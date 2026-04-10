var nums = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]; // ...
// 求第n个数
function fib(n) {
  // n: 0 / 1
  if (n < 2) {
    return 1;
  }
  // return n前边的值 + n前边的前边的值
  return fib(n - 1) + fib(n - 2);
}

console.time('fib');
fib(100);
console.timeEnd('fib');
// fib(2):2 + fib(1):1
// fib(2):2 >>> fib(1):1 + fib(0):1
