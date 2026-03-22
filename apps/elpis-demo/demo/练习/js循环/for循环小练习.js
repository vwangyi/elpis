// 1. 求100以内偶数和，含100
// 2. 求100以内奇数和，含100
// var oddSum = 0; // 奇数和
// var evenSum = 0; // 偶数和
// for (var i = 0; i < 101; i++) {
//     // 0, 1, 2, ..., 100
//     if (i % 2 === 1) {
//         // 1, 3, 5, ...
//         oddSum += i;
//     } else {
//         evenSum += i;
//     }
// }

// 3. 输入数字个数
//    如:
//    输入5, 输出'ababa'
//    输入8: 输出'abababab'
//    输入2: 输出'ab'
//    输入1: 输出'a'
// var count = +prompt('输入个数');

// var str = '';
// for (var i = 0; i < count; i++) {
//     // i: 0 >>> 'a'
//     // i: 1 >>> 'b'

//     // i: 2 >>> 'a'
//     // i: 3 >>> 'b'

//     var n = i % 2; // 0 / 1
//     switch (n) {
//         case 0:
//             str += 'a';
//             break;
//         case 1:
//             str += 'b';
//             break;

//         default:
//             break;
//     }
// }
// console.log(str);

// 4. 输入数字个数
//    如:
//    输入5, 输出'abcab'
//    输入8: 输出'abcabcab'
//    输入2: 输出'ab'
//    输入1: 输出'a'
//    输入10, 输出'abcabcabca'
var count = +prompt('输入个数')

var str = ''
for (var i = 0; i < count; i++) {
  // i: 0 >>> 'a'
  // i: 1 >>> 'b'
  // i: 2 >>> 'c'

  // i: 3 >>> 'a'
  // i: 4 >>> 'b'
  // i: 5 >>> 'c'

  switch (
    i % 3 // 0 / 1 / 2
  ) {
    case 0:
      str += 'a'
      break
    case 1:
      str += 'b'
      break
    case 2:
      str += 'c'
      break

    default:
      break
  }
}
console.log(str)
