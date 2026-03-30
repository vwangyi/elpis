// 单式：所买号码个数 和 出奖个数 一致

// 复式：所买号码个数 大于 出奖个数

// 胆拖：胆码小于 出奖个数  拖码补足 和出奖个数一致  胆码必须全中 拖码补齐个数就行

// （胆3比较好中 剩下拖


// $36

// 前区胆 10 11 26
// 前区拖 9 23 18 25

// 后区胆 01
// 后区拖 06 08 12


// 套餐票如何买 




const left = [
  15,27,29,30,34,
  9, 10, 11, 12, 16, 10, 11, 22, 26, 32, 3, 15, 24, 28, 29, 2, 4, 8, 10, 21, 9, 25, 26, 27, 28, 5, 9, 10, 18, 26, 5, 8,
  12, 14, 17, 1, 10, 21, 23, 29, 12, 13, 14, 16, 31, 9, 11, 19, 30, 35, 4, 5, 10, 23, 31, 8, 9, 12, 19, 24, 1, 4, 10,
  13, 17, 16, 18, 23, 34, 35, 3, 5, 6, 23, 26, 1, 2, 9, 22, 25, 14, 21, 23, 29, 33, 2, 3, 13, 18, 26, 5, 12, 13, 14, 33,
  3, 6, 17, 21, 33, 1, 2, 13, 20, 26, 5, 12, 18, 23, 35, 2, 4, 16, 23, 35, 5, 18, 23, 25, 32, 2, 9, 11, 15, 16, 4, 8,
  15, 20, 31, 7, 9, 23, 27, 32
];

const right = [
  1,10,1, 11, 1, 8, 3, 7, 9, 12, 1, 8, 5, 6, 4, 5, 10, 12, 4, 12, 1, 12, 7, 12, 1, 6, 3, 11, 1, 6, 1, 2, 1, 6, 2, 10, 2, 9,
  5, 8, 5, 11, 3, 10, 6, 12, 6, 11, 5, 9, 2, 4, 7, 8, 2, 8
];

const totalLeft = left
  .reduce((prev, curr) => {
    if (!prev[curr]) {
      prev[curr] = { key: curr, value: 0 };
    }
    if (prev[curr].key === curr) {
      prev[curr] = { key: curr, value: prev[curr].value + 1 };
    }
    return prev;
  }, [])
  .reduce((prev, curr, index, arr) => {
    if (!prev[curr.value]) {
      prev[curr.value] = "";
    }
    prev[curr.value] += prev[curr.value] === "" ? `${curr.key}` : `, ${curr.key}`;
    return prev;
  }, {});
console.log(totalLeft);

const totalRight = right
  .reduce((prev, curr) => {
    if (!prev[curr]) {
      prev[curr] = { key: curr, value: 0 };
    }
    if (prev[curr].key === curr) {
      prev[curr] = { key: curr, value: prev[curr].value + 1 };
    }
    return prev;
  }, [])
  .reduce((prev, curr, index, arr) => {
    if (!prev[curr.value]) {
      prev[curr.value] = "";
    }

    prev[curr.value] += prev[curr.value] === "" ? `${curr.key}` : `, ${curr.key}`;
    return prev;
  }, {});
console.log(totalRight);

// console.log([{ 9: [1, 2, 3, 4,1, 2, 3, 41, 2, 3, 4] }, { 9: [1, 2, 3, 4] }, { 9: [1, 2, 3, 4] }, { 9: [1, 2, 3, 4] }])

// 1. 算出每一期的  冷热号  3热2冷  3大2小（以18为界）

// 冷热号
// 奇偶号
// 大小号

function arrSlice() {
  const step = 5;
  const res = [];
  for (let i = 0; i < left.length; i += step) {
    const sub = left.slice(i, i + step);
    res.push(sub);
  }
  return res;
}

const resultSlice = arrSlice();
// console.log(resultSlice);
/**
 * 算出每期的大小号分布  比如 3大2小（以18为界）
 * getBigSmall(left, 18)
 * getBigSmall(right, 12)
 */
function getBigSmall(arr, value) {
  return resultSlice.map(item => {
    const res = {};

    res.list = item;

    return res;
  });
}



