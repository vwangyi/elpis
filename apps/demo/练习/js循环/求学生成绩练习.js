var count = +prompt('班级人数'); // 3

var sum = 0;
for (var i = 0; i < count; i++) {
  // 取值
  var score = +prompt(`请输入第${i + 1}个学生的成绩`); // '请输入第0/1/2个学生的成绩'
  sum += score;
}

console.log(`总成绩为${sum}`); // '总成绩为xxx'
console.log(`平均成绩为${sum / count}`); // '平均成绩为xxx'
