console.log('a')

for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    setTimeout(() => {
      console.log(i) // 3
    }, 1000 * i) // 3, 3, 3
  }, 1000 * i) // 0, 1, 2
  // 3s, 4s, 5s时打印3
}

new Promise((resolve, reject) => {
  console.log('c')
  setTimeout(() => {
    resolve('e')
  }, 1000)
  setTimeout(() => {
    console.log('d')
  }, 1000)
}).then((res) => {
  console.log(res)
})

console.log('f')

// 同: a, c, f
// 1s: e, d
// 3, 3, 3
