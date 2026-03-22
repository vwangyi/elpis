new Promise((resolve) => {
  console.log('a')
  resolve('b')
})
  .then((res) => {
    setTimeout(() => {
      console.log(res)
    })
  })
  .then((res) => {
    console.log(res)
  })
console.log('c')
for (var i = 0; i < 2; i++) {
  setTimeout(() => {
    console.log(i)
  })
}
console.log('d')

// 同步: a, c, d
// 0s微: undefined
// 0s宏: 2, 2
// 0s微+宏: b
