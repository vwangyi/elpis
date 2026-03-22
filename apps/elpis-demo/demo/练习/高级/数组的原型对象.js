const arr = [1, 2, 3] // >>> [1, 4, 9]

// 数组没有求和功能
Array.prototype.getSum = function () {
  // 检查数组项能不能计算
  // 如果不能就报错

  let sum = 0
  for (const item of this) {
    if (isNaN(item)) {
      // throw new Error('数组项无法进行运算');
      throw new Error('Unexpected array item.')
    }
    sum += item
  }
  return sum
}

// Array.prototype.getSum = function () {
//     return this.reduce((p, c) => p + c, 0);
// };

// ['hello world', 1, 2].getSum();
