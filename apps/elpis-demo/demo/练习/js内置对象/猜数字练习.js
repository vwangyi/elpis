// 随机整数
var num = Math.floor(Math.random() * 10 + 1) // [1, 10]
console.log(num)
// 用户输入的数字
var inputNum = +prompt('输入数字')

while (inputNum !== num) {
  if (inputNum > num) {
    alert('大了')
  } else {
    alert('小了')
  }
  // 继续猜
  inputNum = +prompt('输入数字')
}

console.log('猜对了')
