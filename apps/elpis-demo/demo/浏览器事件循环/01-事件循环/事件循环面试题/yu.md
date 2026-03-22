# JS事件循环机制 5\*

> js的异步处理
>
> setTimeout / setInterval 宏任务
>
> Promise 微任务

```js
console.log(1)
setTimeout(() => {
  console.log(3)
}, 0)
new Promise((resolve) => {
  console.log(4)
  resolve(5)
}).then((res) => {
  console.log(res) // 5
})
console.log(2)

// 同步: 1, 4, 2
// 微任务: 5
// 宏任务: 3
```

## 案例1

```js
console.log(1)
setTimeout(() => {
  console.log(3) // 宏0s >>> 3
})
new Promise((resolve) => {
  console.log(4)
  setTimeout(() => {
    resolve(5) // 宏0s + 微0s >>> 5
  })
}).then((res) => {
  console.log(res) // 5
})
console.log(2)
```

## 案例2

```js
console.log(1)
new Promise((resolve) => {
  console.log(4)
  setTimeout(() => {
    resolve(5)
  })
}).then((res) => {
  console.log(res)
})
new Promise((resolve) => {
  console.log(6)
  setTimeout(() => {
    resolve(7)
  })
}).then((res) => {
  console.log(res)
})
console.log(2)

// 1, 4, 6, 2
// 5, 7
```

## 案例3

```js
console.log('a')
for (var i = 0; i < 3; i++) {
  console.log(i)
  setTimeout(() => {
    console.log(i) // 3
  }, i * 1000) // 0, 1, 2秒
}
new Promise((resolve) => {
  console.log('b')
  setTimeout(() => {
    resolve('c')
  })
}).then((res) => {
  console.log(res)
})
console.log('d')

// 同步: 'a', 0, 1, 2, 'b', 'd'
// 0s宏任务: 3
// 0s微任务+宏任务: c
// 1s: 3
// 2s: 3
```

## 案例4

```js
console.log('a')
for (var i = 0; i < 3; i++) {
  console.log(i)
  setTimeout(() => {
    console.log(i)
  }, i * 1000)
}
new Promise((resolve) => {
  console.log('b')
  setInterval(() => {
    console.log('e')
  }, 1000)
  resolve('c')
}).then((res) => {
  console.log(res)
  setTimeout(() => {
    console.log('f')
  })
})
console.log('d')

// 0s宏: 3
// 0s微: c
// 0s微+0s宏: f

// 1s宏: 3
// 1s宏: e

// 同步: a, 0, 1, 2, b, d
// 0s: c, 3, f
// 1s: 3, e
// 2s: 3, e
// 3s: e, ...
```

## 案例5

```js
console.log('a')
for (var i = 0; i < 2; i++) {
  console.log(i)

  setTimeout(() => {
    setTimeout(() => {
      console.log(i)
    }, i * 1000) // 2s
  }, i * 1000) // 0s

  new Promise((resolve) => {
    console.log('b:', i)
    resolve('c' + i)
  }).then((res) => {
    console.log(res)
    console.log(res + i)
  })
}

// 同步: a, 0, b: 0, 1, b: 1
// 0s微: c0, c02, c1, c12
// 0s宏+2s宏: 2
// 1s宏+2s宏: 2
```
