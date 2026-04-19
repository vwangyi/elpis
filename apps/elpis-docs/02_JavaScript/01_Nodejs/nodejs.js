// function* fibonacci() {
//   let [a, b] = [0, 1];
//   while (true) {
//     yield a;
//     [a, b] = [b, a + b];
//   }
// }

// const gen = fibonacci();
// const result = [];

// // 手动实现 take(20)
// for (let i = 0; i < 20; i++) {
//   const value = gen.next().value;
//   if (value % 2 === 0) {  // 过滤偶数
//     result.push(value ** 2);  // 平方
//   }
// }

// console.log(result);  // [0, 4, 64, 1024, 7744]
// 需要理解这些概念的实际表现
// 1. 变量环境（Variable Environment）
// 2. 词法环境（Lexical Environment）
// 3. 执行上下文栈（Execution Context Stack）
// 4. 作用域链（Scope Chain）
// 5. 闭包（Closure）
// 事件循环（Event Loop）
// v8
// 渲染流程



// const now = Temporal.Now.instant();
// const birthday = Temporal.PlainDate.from('2024-01-15');
// const meeting = Temporal.ZonedDateTime.from('2024-12-25T10:30:00[Asia/Shanghai]');

// // 人性化的时间运算
// const nextWeek = now.add({ days: 7 });
// const projectDeadline = meeting.add({ hours: 2, minutes: 30 });

// // 时间段计算
// const vacation = Temporal.Duration.from({ days: 10 });
// const returnDate = now.add(vacation);

// import path from 'path';

const path = require('path');

console.log(globalThis.process === process)

console.log(this === module.exports)

