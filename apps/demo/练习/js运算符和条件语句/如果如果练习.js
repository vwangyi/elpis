// var score = +prompt('分数');

// if (score >= 90) {
//     alert('A');
// } else if (score >= 80) {
//     alert('B');
// } else if (score >= 70) {
//     alert('C');
// } else if (score >= 60) {
//     alert('D');
// } else {
//     alert('E');
// }

// no-else
// kms pico

// 请输入一个分数
// 分数 等于80 输出优等生守门员
// 分数 等于60 输出中等生守门员
// 分数 等于0  输出差生守门员
var score = +prompt('分数'); // 'number'

if (score === 80) {
  alert('优等生守门员');
} else if (score === 60) {
  alert('中等生守门员');
} else if (score === 0) {
  alert('差生守门员');
}
