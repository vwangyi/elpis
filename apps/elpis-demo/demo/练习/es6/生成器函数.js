function step1() {
  console.log(1)
}

function step2() {
  console.log(2)
}

function step3() {
  console.log(3)
}

function* projectGen() {
  yield step1()
  yield step2()
  yield step3()
}

// 生成器
const gen = projectGen()
// 封装好生成器函数后 使用者只需在合适时机.next()调用即可
gen.next()
gen.next()
gen.next()
