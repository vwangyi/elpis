// // 全局作用域
// var a = 1;

function f1() {
  var a = 1;

  function fn() {
    // 局部作用域
    // 相当于子作用域
    console.log(a);
    var b = 2;
  }

  fn();
}

console.log(b);

// if (true) {
//     // 局部作用域
//     // var的坑
//     var c = 3;
// }

// console.log(c);
