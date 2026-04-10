switch (用于比较的值) {
  case 第一个值:
    alert('用于比较的值为第一个值的情况');
    break;

  case 第二个值:
    alert('用于比较的值为第二个值的情况');
    break; // 打断

  default:
    alert('剩余情况');
    break;
}

// 请输入一个分数
// 分数 等于80 输出优等生守门员
// 分数 等于60 输出中等生守门员
// 分数 等于0  输出差生守门员
var score = +prompt('分数'); // 'number'

switch (score) {
  // case 相当于 ===
  case 80:
    alert('优等生守门员');
    break;
  case 60:
    alert('中等生守门员');
    break;
  case 0:
    alert('差生守门员');
    break;

  default:
    break;
}
