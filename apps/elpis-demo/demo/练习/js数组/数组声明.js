// var arr = [3, 2, 1];
// var arr1 = ['a', 'b', 'c'];
// console.log(arr1);

// 查
// 取值
// console.log( arr[3] ); // undefined
// console.log( arr[索引] );

// 取长度(数组元素个数)
// console.log(arr1.length);

// 取数组最后一项
// var idx = arr1.length - 1;
// console.log( arr1[idx] );
// console.log( arr1[arr1.length - 1] );

// 增: arr.push(新元素)
// 生成一个数组, 长这样[1, 2, 3, ..., 100]
// var arr = [];
// for (var i = 1; i < 101; i++) {
//     arr.push(i);
// }
// console.log(arr);

// var arr = [1, 2, 3];
// // arr.push(0); // [1, 2, 3, 0]
// arr.unshift(0); // [0, 1, 2, 3]
// console.log(arr);

// // [100, 99, 98, ..., 1]
// var arr = [];
// for (var i = 1; i < 101; i++) {
//     arr.unshift(i);
// }
// console.log(arr);

// 删
// var arr = [1, 2, 3, 4];

// arr.pop(); // 删最后一项
// arr.shift(); // 删第一项
// arr.splice(从哪个索引开始删, 删几个元素); // 删中间
// arr.splice(2, 1);

// var a = arr.pop(); // 4
// var b = arr.shift(); // 1
// var c = arr.splice(2); // [3, 4]

// console.log(arr);
// console.log(c);

// 改
// var arr = [1, 2, 3]; // 2 >>> 'hello world'
// arr[1] = 'hello world';
// console.log(arr);

// 先生成 [1, 2, 3, 4, 5, 6, 7, 8]
// 再把2, 4, 6, 8项换为'x'
var arr = []
for (var i = 1; i < 9; i++) {
  arr.push(i)
}
// arr: [1, 2, 3, 4, 5, 6, 7, 8]
for (var i = 1; i < 8; i += 2) {
  // 索引 1, 3, 5, 7
  // 值   2, 4, 6, 8
  arr[i] = 'x'
}
