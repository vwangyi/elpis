function a(msg) {
  console.log(msg);
}

function b() {
  const msg = 'hello world';
  a(msg);
}

// 1. 全局msg
// 2. 在b中return msg;
// 3. 回调函数
