function fn(cb) {
  cb()
}

// 不确定fn能否执行成功
try {
  fn(() => {
    throw 'Err'
  })
} catch (error) {
  // 失败处理
}

console.log(123)
