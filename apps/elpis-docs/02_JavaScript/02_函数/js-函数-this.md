# this



```js
● this指向
  ○ 是什么
    ■ this 在全局作用域下 是全局对象window
    ■ this 在局部作用域下 一般是调用者
      ● 特殊情况
        ○ 箭头函数没有this，是外层的this
        ○ 构造函数的this 是 实例对象
        ○ 通过 call apply bind 调用 this是第一个参数
```





```js
window.a = 100
function fn() {
    return {
        a: 200,
        callback: () => {
            console.log(this.a) // 考察this指向 输出什么 
        }
    }
}

const fn0 = fn();
fn0.callback()
```

