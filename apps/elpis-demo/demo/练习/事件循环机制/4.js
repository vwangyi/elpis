for (var i = 3; i > 0; i--) {
  new Promise((resolve) => {
    console.log(i)
    resolve(i)
  }).then(() => {
    console.log(i) // 0
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

// 同: 3, 2, 1, a, d
// 微: 0, 0, 0
// 宏: b, c

//    同： 3 2 1 a d
//    微： 0 0 0
//   宏： b c
