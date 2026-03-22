# this


arguments对象
● argument是一个伪数组对象，表示所有的参数列表，现在用 es6 的剩余参数取代。
```js
function a(...args) {
  console.log( Array.from(arguments) )
  console.log(args)
}
```




 