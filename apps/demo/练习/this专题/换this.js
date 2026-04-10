function run() {
  console.log(this); // window
}

// document.addEventListener('click', () => {
//     console.log(this); // window
//     // run();
//     run.call(document);
// });

document.addEventListener('click', run.bind(window));

// fn.call(新的this, 实参1, 实参2, 实参3, ...);
// .call直接调用函数 并且换this

// fn.apply(新的this, 实参数组);
// .apply直接调用函数 并且换this

// fn.bind(新的this)
// .bind不调用函数 只换this

function fn(a, b, c) {
  return a + b + c;
}

console.log(fn.apply(window, [1, 2, 3])); // 6
console.log(fn(1, 2, 3)); // 6
