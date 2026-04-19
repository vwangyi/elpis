// 单式：所买号码个数 和 出奖个数 一致

// 复式：所买号码个数 大于 出奖个数

// 胆拖：胆码小于 出奖个数  拖码补足 和出奖个数一致  胆码必须全中 拖码补齐个数就行

// （胆3比较好中 剩下拖

// $36

// 3 + 3 + 1 + 2

// 前区胆： 死守3个号 10 11 26
// 前区拖： 死守3个号 9 26 27 可多加

// 前区胆 10 11 26
// 前区拖 9 23 18 25 2   （9 和 26 都不买） （23和5 次数大）

// 后区胆 05
// 后区拖 06 08 12 (6和8都不买) 5 2 6 1

// 后区要次数倒数第三梯队

// 01 02 03 04 05 06 07 08 09 10 11
// 12 13 14 15 16 17 18 19 20 21 22 23
// 24 25 26 27 28 29 30 31 32 33 34 35

// 前区胆：02 10 12
// 前区拖：05 22 23 25

// 01 02 03 04 05 06 07 08 09 10 11 12
// 后区胆 05
// 后区拖 02 12

// 需求 除以三  热号 温号 冷号

// 大中小号
// 1 - 11 小号
// 12 -23 // 中号
// 24 - 35 大号

// 计算每期的 大中小号 几个
// 计算每期的 冷热温号 几个
//

const left = [
  24, 25, 27, 29, 34, 9, 11, 20, 26, 27, 8, 17, 21, 33, 35, 7, 12, 13, 28, 32,
  4, 7, 16, 26, 32, 2, 22, 30, 33, 34, 11, 12, 25, 26, 27, 3, 5, 7, 9, 18, 3, 4,
  19, 26, 32, 2, 13, 22, 28, 34, 3, 5, 17, 33, 35, 15, 27, 29, 30, 34, 9, 10,
  11, 12, 16, 10, 11, 22, 26, 32, 3, 15, 24, 28, 29, 2, 4, 8, 10, 21, 9, 25, 26,
  27, 28, 5, 9, 10, 18, 26, 5, 8, 12, 14, 17, 1, 10, 21, 23, 29, 12, 13, 14, 16,
  31, 9, 11, 19, 30, 35, 4, 5, 10, 23, 31, 8, 9, 12, 19, 24, 1, 4, 10, 13, 17,
  16, 18, 23, 34, 35, 3, 5, 6, 23, 26, 1, 2, 9, 22, 25, 14, 21, 23, 29, 33, 2,
  3, 13, 18, 26, 5, 12, 13, 14, 33, 3, 6, 17, 21, 33, 1, 2, 13, 20, 26, 5, 12,
  18, 23, 35, 2, 4, 16, 23, 35, 5, 18, 23, 25, 32, 2, 9, 11, 15, 16, 4, 8, 15,
  20, 31, 7, 9, 23, 27, 32
];

const right = [
  2, 6, 6, 9, 6, 7, 6, 8, 5, 8, 8, 12, 8, 11, 2, 10, 1, 12, 5, 12, 5, 7, 1, 10,
  1, 11, 1, 8, 3, 7, 9, 12, 1, 8, 5, 6, 4, 5, 10, 12, 4, 12, 1, 12, 7, 12, 1, 6,
  3, 11, 1, 6, 1, 2, 1, 6, 2, 10, 2, 9, 5, 8, 5, 11, 3, 10, 6, 12, 6, 11, 5, 9,
  2, 4, 7, 8, 2, 8
];

function count(arr, num) {
  const tmp = arr.reduce((prev, index) => {
    if (!prev[index]) {
      prev[index] = { key: index, value: 0 };
    }
    if (prev[index]?.key === index) {
      prev[index] = { key: index, value: prev[index].value + 1 };
    }
    return prev;
  }, []);

  for (let i = 1; i <= num; i++) {
    if (!tmp[i]) {
      tmp[i] = { key: i, value: 0 };
    }
  }
  return tmp.reduce((prev, curr, index, arr) => {
    if (!prev[curr.value]) {
      prev[curr.value] = '';
    }
    prev[curr.value] +=
      prev[curr.value] === '' ? `${curr.key}` : `, ${curr.key}`;
    return prev;
  }, {});
}

console.log('统计前区出现次数');
console.log(count(left, 35));
console.log('统计后区出现次数');
console.log(count(right, 12));

console.log('统计每一期的结果 和 历史数据的次数统计');

function count1(left, right) {
  const leftEachLength = 5;
  const rightEachLength = 2;
  const countNum = left.length / leftEachLength;
  console.log('期数', countNum);
  let prevLeft = 0,
    prevRight = 0;
  for (let i = 0; i < countNum; i++) {
    const hisLeft = left.slice(prevLeft + leftEachLength);
    const hisRight = right.slice(prevRight + rightEachLength);
    const currentLeft = left.slice(prevLeft, prevLeft + leftEachLength);
    const currentRight = right.slice(prevRight, prevRight + rightEachLength);
    prevLeft = prevLeft + leftEachLength;
    prevRight = prevRight + rightEachLength;
    console.log(`第${i + 1}期号码`, currentLeft, count(hisLeft, 35));
    console.log(currentRight, count(hisRight, 12));
  }
}
console.log(count1(left, right));

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
