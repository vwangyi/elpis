function a() {
  console.log(1)
  Promise.resolve().then(function () {
    console.log(2)
  })
}

setTimeout(function () {
  console.log(3)
  Promise.resolve().then(a)
  console.log(6)
}, 0)

Promise.resolve().then(function () {
  console.log(4)
})

console.log(5)

// 渲染主线程 执行 按以下顺序执行代码
// 1 同步代码
// 2 异步的微任务
// 3 异步的宏任务的 交互队列
// 4 异步的宏任务的 延时队列

// 渲染主线程 申请内存 存放函数
function a() {
  console.log(1)
  Promise.resolve().then(function () {
    console.log(2)
  })
}

// 渲染主线程 把函数添加到 延时线程 由延时线程计时 并且到时间后(满足调用条件才去排队) 把函数添加到 延时队列排队
setTimeout(function () {
  console.log(3)
  Promise.resolve().then(a)
  console.log(6)
}, 0)

// 渲染主线程 直接把函数添加到 微任务队列
Promise.resolve().then(function () {
  console.log(4)
})

console.log(5)

// 5 4 3 6 1 2
