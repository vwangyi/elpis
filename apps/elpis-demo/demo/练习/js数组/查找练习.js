var nums = [123, 5, 9, 1, 45, 10, 66]

// // 1.
// var result = nums.filter(item => item % 2 === 1);

// // 2.
// var hasTriple = nums.some(item => item >= 100);

// // 3.
// var result = nums.filter(item => item > 10).length;

// // 4.
// var result = nums.find(item => item % 5 === 0 && item !== 0);
// // var result = nums.find(item => item % 5 === 0 && !item);

// 5.
// var result = nums.findIndex(item => item < 10 && item > 0);
// 查找数组中，有没有个位数，如果有，打印第一个匹配的数字的索引，否则打印-1
var result = nums.findIndex((item) => item % 10 === item)
console.log(result)
