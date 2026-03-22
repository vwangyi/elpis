setTimeout(function () {
  console.log(1)
}, 0)

function delay(duration) {
  var start = Date.now()
  while (Date.now() - start < duration) {}
}
delay(3000)
console.log(2)

// 打印顺序是什么：2 1
