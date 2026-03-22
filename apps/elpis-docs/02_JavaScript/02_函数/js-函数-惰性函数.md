# 惰性函数 


```js
// 惰性函数 就是函数的功能 第一次执行的时候就确定了 以后不会再改变
// 只有第一次调用的时候才会进行if判断 后续调用 不会再进行if判断  因为第一次已经确定了函数的功能 是个优化手段
function getPrice() {
  const isVip = true
    if (isVip) { 
      // 重新给函数赋值 后续调用不会再进行if判断
      getPrice = () => 9.9
    } else {
      // 重新给函数赋值 后续调用不会再进行if判断
      getPrice = () => {
        // 打开弹窗 充值vip  充值成功后 价格变为9.9 充值失败 继续弹窗充值
      }
    }
}
// 比如说 一些兼容性问题  只需要判断一次就可以了 不需要每次都判断
function isPromise(obj) {
  if(window.Promise) {
    // 第一次就判断是否支持Promise 以后就不需要判断了
    isPromise = function(obj) {
      return obj instanceof Promise;
    }
  } else { 
  }
}

```

