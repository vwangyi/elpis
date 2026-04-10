function run() {
  console.log('hello world');
}

// 异步: 下班>>吃饭/烧水>>洗澡>>睡觉
// 同步: 下班>>吃饭>>烧水>>洗澡>>睡觉

// 一秒之后执行run函数
// setTimeout(run, 1000);
// console.log('heihei');

// setTimeout(() => {
//     run();
// }, 1000);

// 每秒执行run函数
const timer = setInterval(run, 1000);

// 清除定时器
setTimeout(() => {
  clearInterval(timer);
}, 5000);
