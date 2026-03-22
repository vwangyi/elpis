// 与或非

// 与(并且)
// 所有为真 结果是真
// 只要有一个假 结果就是假
// console.log(true && false); // 假
// console.log(true && true); // 真
// console.log(false && false); // 假
// console.log(false && true); // 假

// var score = '79';
// // 0-60分: 差生
// // 60-80: 中等生
// // 80-100: 优等生

// console.log(score > 60 && score < 80);
// // console.log(60 < score < 80); // 错误写法

// var year = 2000;

// var age = 2022 - year;

// // 0-18:小屁孩
// // 18-22:中年人
// // 22+:老年人
// // 打印是否为中年人
// console.log(age >= 18 && age <= 22); // [18, 22] 闭区间
// console.log(age > 18 && age <= 22); // (18, 22] 左开右闭

// 或(或者) ||
// console.log(true || false); // true
// console.log(false || false); // false
// console.log(true || true); // true
// console.log(false || true); // true

// var score = 79;
// 0-40: 卧龙
// 40-50: 凤雏
// 50-60: 普通人
// 60-80: 一般人
// 80+: 优等生 v

// console.log(score < 60 || score > 80);
// isAaaBbb: 表示布尔值
// var isBadStudent = score < 60;

// 打印是否为凤雏或者一般人
// // 是否为凤雏
// var isFengChu = score > 40 && score <= 50;
// // 是否为一般人
// var isYiBan = score > 60 && score <= 80;
// console.log(isFengChu || isYiBan);

// 非(取反)
// 不是一般人
// console.log(!isYiBan);
// console.log(   !(score > 60 && score <= 80)   );

// 打印是否 不是一般人 也不是卧龙

// // 是一般人
// var isYiBan = score > 60 && score <= 80;
// // 是卧龙
// var isWoLong = score < 40;

// console.log(!isYiBan && !isWoLong);

// 逻辑中断
// var a = console.log(123);
// console.log(a);

// !console.log(123) || console.log(123);

// 与的逻辑中断(提前结束)
// var result = false && 1 > 2 && 2 > 3; // false
console.log(1) && console.log(2) // 2不会打印

// 或的逻辑中断
!console.log(1) || console.log(2) // 2不会打印
