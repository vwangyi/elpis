for (var i = 2; i > 0; i--) {
  new Promise((resolve) => {
    console.log(i)
    resolve(i)
  })
    .then((i) => {
      console.log(i)
    })
    .then(() => {
      console.log(i)
    })
}
console.log('a')
setTimeout(() => {
  console.log('b')
}, 0)
setTimeout(() => {
  console.log('c')
})
console.log('d')
// 同: 2, 1, a, d
// 微: 2, 1, 0, 0
// 宏: b, c
