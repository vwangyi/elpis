// 打印
// 1, 1, 1,
// 2, 2, 2,
// 3, 3, 3
// for (var i = 0; i < 3; i++) {
//     // 第一轮 i: 0
//     // 第二轮 i: 1
//     for (var j = 0; j < 3; j++) {
//         // 第一轮 1, 1, 1
//         // 第二轮 2, 2, 2
//         console.log(i + 1);
//     }
// }

// 练习1:
// 打印
// 1, 1.1, 1.2, 1.3,
// 2, 2.1, 2.2, 2.3,
// 3, 3.1, 3.2, 3.3

// 打印1, 2, 3
// for (var i = 0; i < 3; i++) {
//     console.log(i + 1);
//     // 先打印0.1, 0.2, 0.3
//     // 再打印1.1, 1.2, 1.3
//     for (var j = .1; j < .4; j += .1) {
//         console.log(i + 1 + j);
//     }
// }

// 练习2:
// 输入行数r
// 输入列数c
// 打印r行c列的效果
// 如:
// 3行4列
// 控制台输出效果
// 'aaaa'
// 'aaaa'
// 'aaaa'

// 2行8列
// 控制台输出效果
// 'aaaaaaaa'
// 'aaaaaaaa'

var r = +prompt('行数') // 3
var c = +prompt('列数') // 5

for (var i = 0; i < r; i++) {
  // 通过c 造出'aaaaa'
  var tmp = ''
  for (var j = 0; j < c; j++) {
    tmp += 'a'
  }
  console.log(tmp) // 'aaaaa'
}
