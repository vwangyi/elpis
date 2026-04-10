var arr = [1, 2, 3, [4, 5, [6, 7, [8, 9]]]];

// 把1-9打印出来
// function log(arr) {
//     for (var i = 0; i < arr.length; i++) {
//         // 1, 2, 3, [4, 5, ...]
//         // 遇到数字直接打印
//         if (typeof arr[i] === 'number') {
//             console.log(arr[i]);
//         } else {
//             // 遇到数组就递归
//             // 要循环的数组: arr[i]
//             log(arr[i]);
//         }
//     }
// }

// log(arr);

// 1. 生成arr中所有数字组成的一维数组[1, 2, 3, 4, 5, 6, 7, 8, 9]
// var result = [];
// function log(arr) {
//     for (var i = 0; i < arr.length; i++) {
//         // 1, 2, 3, [4, 5, ...]
//         // 遇到数字直接打印
//         if (typeof arr[i] === 'number') {
//             result.push(arr[i]);
//         } else {
//             // 遇到数组就递归
//             // 要循环的数组: arr[i]
//             log(arr[i]);
//         }
//     }
// }
// log(arr);
// console.log(result);

// 2. 求arr中所有数字的最大值
var result = [];
function log(arr) {
  for (var i = 0; i < arr.length; i++) {
    // 1, 2, 3, [4, 5, ...]
    // 遇到数字直接打印
    if (typeof arr[i] === 'number') {
      result.push(arr[i]);
    } else {
      // 遇到数组就递归
      // 要循环的数组: arr[i]
      log(arr[i]);
    }
  }
}
log(arr);
console.log(Math.max(...result));

// 3. 封装一个函数，输入arr，返回arr中所有数字组成的一维数组
// 4. 封装一个函数，输入arr，返回arr中所有数字的最大值
