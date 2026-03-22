if (条件表达式1) {
  // do sth
} else if (条件表达式2) {
  // do sth
} else if (条件表达式3) {
  // do sth
} else {
  // 否则
}

// 输入一个分数
// 0-60分: 差生
// 60-80: 中等生
// 80-100: 优等生
var score = +prompt('输入分数')

if (score < 60) {
  alert('差生')
} else if (score < 80) {
  alert('中等生')
} else {
  alert('优等生')
}
