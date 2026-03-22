new Promise((resolve) => {
  console.log(1)
  new Promise((resolve) => {
    console.log(2)
    setTimeout(() => {
      resolve(3)
      console.log(4)
    })
  }).then((d) => {
    setTimeout(() => {
      console.log(5)
    })
    console.log(d)
  })
  setTimeout(() => {
    resolve(6)
    console.log(7)
  })
}).then((d) => {
  console.log(d)
  setTimeout(() => {
    console.log(8)
  })
  console.log(9)
})
