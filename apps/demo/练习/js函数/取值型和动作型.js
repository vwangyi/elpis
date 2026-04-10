// 动作型
// 函数是帮忙执行一些代码，仅此而已
function fn(x) {
  console.log(2 * x + 1);
}

fn(1);

// 取值型
// 拿函数运行的结果去做事情
function getResult(x) {
  return 2 * x + 1;
}

console.log(getResult(1)); // 3
