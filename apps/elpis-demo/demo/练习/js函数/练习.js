// 1.
// 封装一个函数, 输入一个数字, 输出一个这个数字的平方
function power(n) {
  return n * n
  // return n ** 2;
  // return Math.pow(n, 2);
}

// power: 力量/幂
console.log(power(1)) // 1
console.log(power(2)) // 4
console.log(power(3)) // 9

// 取值型
// function 洗衣机(脏衣服, 洗衣液) {
//     // 一系列操作
//     return 干净衣服;
// }

// // 榨汁机
// function 榨汁机(水果, 砒霜) {
//     return 果汁;
// }

// // 电饭煲
// function 电饭煲(米, 水) {
//     return 米饭;
// }

// 2.
// 封装一个函数 输入两个数字 输出较大的一个
function getMax(n1, n2) {
  return n1 > n2 ? n1 : n2
}

console.log(getMax(1, 2)) // 2
console.log(getMax(4, 2)) // 4

// 3.
// 封装一个函数 输入一个数字数组 输出数组的和
function getSum(arr) {
  var sum = 0
  // 制作sum过程
  for (var i = 0; i < arr.length; i++) {
    // var item = arr[i];
    // sum += item;
    sum += arr[i]
  }
  return sum
}

console.log(getSum([1, 2, 3])) // 6
console.log(getSum([0, 2, 3])) // 5
console.log(getSum([])) // 0

// 4.
// 封装一个函数 输入一个数字数组 输出数组中最小的数字
// 数组的两种常见命名方式
// num >>> nums
// num >>> numList
// apples >>> applesList

function getMin(nums) {
  var min = Infinity // infinite 无穷的 // 1
  for (var i = 0; i < nums.length; i++) {
    // 第一轮
    // num: 1
    // min: Infinity >>> 1
    // 第二轮
    // num: 2
    // min: 1
    var num = nums[i]
    // 拿num跟min比
    if (num < min) {
      min = num
    }
  }
  return min
}

console.log(getMin([1, 2, 3])) // 1
console.log(getMin([1, 2, 999, -999])) // -999
