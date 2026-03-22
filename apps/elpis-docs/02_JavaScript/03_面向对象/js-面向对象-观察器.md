```js
 

// IntersectionObserver 观察器

// 当元素DOM滚动到视野中时, dispatch
const domObserver = new IntersectionObserver(
  (entries) => {


    // 连续解构 [{isIntersecting}] 等同于 entries[0].isIntersecting
    if([{isIntersecting}]){
      // 应该自己写的内容
      // 触发的逻辑
      // to do
    } 
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  },
);
// 启动观察元素DOM是否进入视野
domObserver.observe(元素DOM);







const PerformanceObserver = window.PerformanceObserver;

new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry);
  }
}).observe({ type: 'paint', buffered: true });
```