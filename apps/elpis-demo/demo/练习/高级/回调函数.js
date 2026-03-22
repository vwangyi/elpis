// // 回调函数
// function fn(callback, cb2) {
//     const msg = 'hi:';
//     callback(msg);
// }

// fn((msg) => {
//     console.log(msg + 'zs');
// });

// // fn: 吉他手
// // callback: 谱

// // fn: 厨师
// // callback: 菜谱

// // fn: 键盘侠
// // callback: 词典

// // fn: 装修队
// // callback: 图纸

// // 自制映射
// Array.prototype.map1 = function (getNewArrItem) {
//     // getNewArrItem: 得到新数组项的逻辑
//     const result = [];
//     for (let i = 0; i < this.length; i++) {
//         // 数组项: this[i]
//         // 索引: i
//         const newItem = getNewArrItem(this[i], i, this);
//         result.push(newItem);
//     }
//     return result;
// };

// // console.log( [1, 2, 3].map1(item => item ** 2) );

// // 自制some
// Array.prototype.some1 = function (getCondition) {
//     for (let i = 0; i < this.length; i++) {
//         // 数组项: this[i]
//         // 索引: i
//         const condition = getCondition(this[i], i, this);
//         if (condition) {
//             return true;
//         }
//     }
//     return false;
// }

// console.log( [1, 3, 5].some1(item => item % 2 === 0) );

// // filter
// Array.prototype.filter1 = function (getCondition) {
//     const result = [];
//     for (let i = 0; i < this.length; i++) {
//         const condition = getCondition(this[i], i, this);
//         if (condition) {
//             result.push(this[i]);
//         }
//     }
//     return result;
// };

// console.log( [1, 2, 5].filter1(item => item % 2 === 1) ); // [1, 5]

// // find
// /**
//  * @param { function } callback 输入数组项 输出条件表达式
//  */
// Array.prototype.find1 = function (callback) {
//     for (let i = 0; i < this.length; i++) {
//         const condition = callback(this[i], i, this);
//         if (condition) {
//             return this[i];
//         }
//     }
//     // return undefined;
// };

// console.log( [1, 2, 5].find1(item => item % 2 === 1) ); // 1

// // findIndex
// /**
//  * @param { function } callback 输入数组项 输出条件表达式
//  */
// Array.prototype.findIndex1 = function (callback) {
//     for (let i = 0; i < this.length; i++) {
//         const condition = callback(this[i], i, this);
//         if (condition) {
//             return i;
//         }
//     }
//     return -1;
// };

// console.log( [1, 2, 5].findIndex1(item => item % 2 === 1) ); // 0

// // reduce
// Array.prototype.reduce1 = function (getNextPrev, initValue) {
//     for (let i = 0; i < this.length; i++) {
//         // 数组项: this[i]
//         // 索引: i
//         initValue = getNextPrev(initValue, this[i], i, this);
//     }
//     return initValue;
// };

// console.log( [1, 2, 5].reduce1((p, c) => p + c, 0) );

// // every
// function every(arr, getCondition) {
//     for (let i = 0; i < arr.length; i++) {
//         // 数组项: arr[i]
//         // 索引: i
//         const condition = getCondition(arr[i], i, arr);
//         if (!condition) {
//             return false;
//         }
//     }
//     return true;
// }

// console.log( every([1, 2, 3], item => item % 2 === 1) ); // false
// console.log( every([1, 5, 3], item => item % 2 === 1) ); // true

// // lodash: minBy
// function minBy(arr, mapFunc) {
//     return Math.min(...arr.map(mapFunc));
// }

// const arr = [
//     { name: 'zs', age: 18 },
//     { name: 'ls1', age: 19 },
//     { name: 'ww22', age: 99 },
// ];
// console.log( minBy(arr, item => item.name.length) ); // 2
// console.log( minBy(arr, item => item.age) ); // 18

// lodash: sumBy
function sumBy(arr, cb) {
  return arr.map(cb).reduce((p, c) => p + c, 0)
}

function sumBy(arr, cb) {
  let sum = 0
  for (const item of arr) {
    const num = cb(item)
    sum += num
  }
  return sum
}

const arr = [
  { name: 'zs', age: 1 },
  { name: 'ls1', age: 2 },
  { name: 'ww22', age: 3 },
]
console.log(sumBy(arr, (item) => item.name.length)) // 9
console.log(sumBy(arr, (item) => item.age)) // 6
