console.log('a')

for (var i = 1; i <= 5; i++) {
  setTimeout(() => {
    console.log(i)
  }, i * 1000) // 1s - 5s 等4个6
  console.log(i)
}

new Promise(function (resolve) {
  console.log('b')
  resolve()
}).then(function () {
  console.log('c')
})

setTimeout(() => {
  console.log('d')
  new Promise(function (resolve) {
    console.log('e')
    resolve()
  }).then(function () {
    console.log('f')
  })
}, 1000)

// 同: a, 1, 2, 3, 4, 5, b
// 0s微: c
// 1s宏: 6, d, e, f
// 6, 6, 6, 6
