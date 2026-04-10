var n1 = 1.1;
var n2 = 1.7;

// 向下取整
// 地板floor
console.log(Math.floor(n1)); // 1
console.log(Math.floor(n2)); // 1

// 向上取整
// 天花板ceil
console.log(Math.ceil(n1)); // 2
console.log(Math.ceil(n2)); // 2

// 四舍五入
// round
console.log(Math.round(n1)); // 1
console.log(Math.round(n2)); // 2

// 随机数
console.log(Math.random()); // [0, 1)
console.log(Math.random() + 1); // [1, 2)
console.log(Math.random() * 10); // [0, 10)
console.log(Math.random() * 10 + 5); // [5, 15)
// 万能公式
// [start, end)
// Math.random() * (end - start) + start
console.log(Math.random() * 2 - 1); // [-1, 1)
console.log(Math.random() * 20 + 50); // [50, 70)
console.log(Math.random() * 40 + 60); // [60, 100)
console.log(Math.floor(Math.random() * 40 + 61)); // [60, 100]的随机整数
// [0, 9]的随机整数
console.log(Math.floor(Math.random() * 10));

// 平方/三次方/四次方/n次方
// 幂: power
// 2的平方 2 * 2
// 2的30次方 2 * 2 * 2
console.log(Math.pow(2, 30));
console.log(2 ** 30);
// 2的三次方: 8
console.log(Math.pow(2, 3));
console.log(2 ** 3);
// 2的四次方: 16
console.log(Math.pow(2, 4));
console.log(2 ** 4);

// 开平方
// 根号2
console.log(Math.sqrt(2)); // 1.414..
// 根号3
console.log(Math.sqrt(3)); // 1.732..
// 根号5
console.log(Math.sqrt(5)); // 2.232..

// π
console.log(Math.PI); // 3.14159265358979...

// 最大值/最小值
// 求1, 2, 3的最大值
console.log(Math.max(1, 2, 3)); // 3
// 求[1, 2, 3]的最大值
var arr = [1, 2, 3];
console.log(Math.max(...arr)); // es6【数组解构】，打散数组，传给Math.max, 相当于Math.max(1, 2, 3)

// min
console.log(Math.min(...arr));

// 绝对值
// -1 >> 1
// 1 >> 1
console.log(Math.abs(-1)); // 1

// 三角函数
// sin cos tan arcsin arccos
console.log(Math.sin(Math.PI / 4)); // 1 / 根号2
console.log(Math.asin(1));
