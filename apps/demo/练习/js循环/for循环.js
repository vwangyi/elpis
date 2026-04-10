/**
 * 1. 吃饭
 * 2. 写代码
 * 3. 睡觉
 */

// 不写重复的代码
// for (设置初始值; 保持循环的条件表达式; 改变初始值) {

// }

// i: 0 1 2
// for (var i = 0; i < 3; i++) {
//     console.log('吃饭');
//     console.log('写代码');
//     console.log('睡觉');
//     console.log('-----------------')
// }

// 打印0-9
// for (var i = 0; i < 10; i++) {
//     console.log(i);
// }

// 打印0 2 4 6 8
for (var i = 0; i < 9; i += 2) {
  console.log(i);
}

for (var i = 0; i < 9; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}
