// 打乱数组
// var arr = [1, 2, 3, 4, 5];
// // -0.5 ~ 0.5
// var mass = arr.sort(() => Math.random() - .5);
// console.log(mass);

// 练习1
// var arr = [
//     [1, 2, 3, 4],
//     [1, 2, 3],
//     [1, 2, 3, 4, 5],
// ];
// // a: [1, 2, 3, 4]
// // b: [1, 2, 3]
// arr.sort((a, b) => a.length - b.length);
// console.log(arr);
// 把arr变成
// [
//     [1, 2, 3],
//     [1, 2, 3, 4],
//     [1, 2, 3, 4, 5],
// ]

// 练习2
// var arr = ['aaa', 'b', 'ccccc'];
// 把arr变成['b', 'aaa', 'ccccc'];
// arr.sort((a, b) => a.length - b.length);
// console.log(arr);

// // 练习3
// var students = [
//     { name: 'zs', score: 59 },
//     { name: 'ls', score: 69 },
//     { name: 'ww', score: 79 },
//     { name: 'll', score: 89 },
// ];
// students.sort((a, b) => b.score - a.score);
// console.log(students);

// // 练习4
// var students = [
//     { name: 'zs', score: 59 },
//     { name: 'ls', score: 69 },
//     { name: 'ww', score: 79 },
//     { name: 'll', score: 89 },
// ];
// // [89, 79, 69, 59]
// // ['ll', 'ww', 'ls', 'zs']

// // 1.
// // [59, 69, 79, 89]
// var result = students
//     .map(item => item.score) // { name: 'zs', score: 59 } >>> 59
//     .sort((a, b) => b - a);

// // 这个好
// var result = students
//     .sort((a, b) => b.score - a.score)
//     .map(item => item.score)

var arr = [5, 3, 4, 11, 2, 1, 111, 22, 'aa1', 'aaa'];
arr.sort();
console.log(arr);
