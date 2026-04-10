/**
 * g
 */
function observe(obj) {
  for (const key in obj) {
    let internalValue = obj[key];

    let fns = new Set(); // 依赖收集过程中 可能会重复 这里需要去重 所以用set
    Object.defineProperty(obj, key, {
      get() {
        // 收集依赖：收集依赖函数 把使用这这个变量的函数都收集起来
        fns.add(abc);
        return internalValue;
      },
      set(val) {
        internalValue = val;

        // 派发更新： 把之前收集的函数都执行一次 ； 实现自动调用依赖该数据的函数
        for (let i = 0; i < fns.length; ++i) {
          fns[i]();
        }
      }
    });
  }
}

function autorun(fn) {
  window.__fn = fn;
  fn();
  window.__fn = null;
}

// 定义: 响应式数据是什么 数据响应式是 数据发生变化 自动运行依赖该数据的函数
