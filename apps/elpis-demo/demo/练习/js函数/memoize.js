// 装饰者
function memoize(fn) {
  let lastArgs = ''
  return function (...args) {
    const argsStr = JSON.stringify(args)
    // console.log(lastArgs, argsStr);
    if (lastArgs !== argsStr) {
      fn.apply(this, args)
      lastArgs = argsStr
    }
  }
}

function f1(arg) {
  console.log(arg)
}

const mf1 = memoize(f1)
mf1(1) // 打印1
mf1(1) // 没效果
mf1(1) // 没效果
mf1(1) // 没效果
mf1(2) // 没效果

// react hooks中的useMemo
