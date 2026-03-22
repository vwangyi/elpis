# 箭头函数普通函数区别




```js

● 箭头函数和普通函数的区别
  ○ 是什么
    ■ 箭头函数没有this，箭头函数使用this是外层的this。
    ■ 箭头函数没有 arguments，批量获取参数 只能使用es6的剩余参数 
    ■ 箭头函数没有 prototype，所以不能作为构造函数也不能 new 调用
      ●  Array.prototype.constructor 
```





```js
● 箭头函数 有 __proto__ 但没有 prototype 所以不能作为构造函数使用
● (a => 0).__proto__  === Function.prototype // true 
● (a => 0).prototype  // undefined 
```

