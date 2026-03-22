// 面试题
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i) // 5
  }, 0)
}

// es6
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i) // 5
  }, 0)
}

// es5
for (var i = 0; i < 5; i++) {
  ;(function (i) {
    setTimeout(function () {
      console.log(i) // 5
    }, 0)
  })(i)
}
