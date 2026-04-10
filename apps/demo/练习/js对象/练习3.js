// // 1. 计算平均分
var students = {
  张三: 89,
  李四: 10,
  王五: 96
};
// function getAvg (students) {
//     var sum = 0; // 和
//     var count = 0; // 次数
//     for (var key in students) {
//         // key: '张三' / '李四' / '王五'
//         // value: students[key] 89, 10, 96
//         sum += students[key];
//         count++;
//     }
//     return sum / count;
// }
// console.log( getAvg(students) );

// // 2. 处理以下数组 生成students对象
// var studentList = [
//     ['张三', 89],
//     ['李四', 10],
//     ['王五', 96],
// ];

// function arr2obj (studentList) {
//     var result = {};
//     for (var i = 0; i < studentList.length; i++) {
//         var student = studentList[i]; // ['张三', 89]
//         var name = student[0]; // '张三'
//         var score = student[1]; // 89
//         result[name] = score; // result['张三'] = 89;
//     }
//     return result;
// }

// console.log( arr2obj(studentList) );

// 3. 将students变为以下数组
function obj2arr(students) {
  var result = [];
  for (var key in students) {
    // key: '张三'
    // students[key]: 89
    var item = {
      name: key,
      score: students[key]
    };
    result.push(item);
  }
  return result;
}

console.log(obj2arr(students));

// var result = [
//     {
//         name: '张三',
//         score: 89,
//     },
//     {
//         name: '李四',
//         score: 10,
//     },
//     {
//         name: '王五',
//         score: 96,
//     },
// ];
