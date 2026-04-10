function fn() {
  // 参数'数组'
  for (var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

// console.log(arguments);

fn(1, 2, 3);
// fn(1, 2, 3, 4, 5, 6);
// fn();

// 封装一个函数，求所有参数的最大值
function getMax() {
  var max = -Infinity;
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] > max) {
      max = arguments[i];
    }
  }
  return max;
}
console.log(getMax(2, 3, 11, -1)); // 11
