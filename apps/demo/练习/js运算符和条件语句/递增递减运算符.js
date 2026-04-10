// var num = 0;

// 0 + 1
// num + 1;

// num = 右面表达式的结果
// num = num + 2;
// num = num - 2;

// 常用
// num += 2;
// num -= 2;

// 只能加1
// num++;
// num--;
// console.log(++num); // ++写在前面 表达式的结果为+1之后的值
// console.log(num++); // ++写在后面 表达式的结果为+1之前的值

// console.log(num); // 1

// 案例1
// var n = 0;
// var result = n++ + ++n; // 0 + 2
// console.log(result); // 2
// console.log(n); // 2

// 案例2
// var n = 0;
// var result = n++ - n-- + --n;
// console.log(result); // 0 - 1 + -1
// console.log(n); // -1

// 案例3
var n = 100;
var result = --n - --n - n++;
console.log(result); // 99 - 98 - 98
console.log(n); // 99
