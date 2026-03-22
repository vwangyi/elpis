# history



 

```js

const history = window.history; // 单例模式 

// history可以实现多页面的跳转 单页面跳转用vue-router
history.forward() 
history.back() 

history.go(1) 
history.go(-1) 

history.pushState({ page: 1 }, "title 1", "?page=1");

// 使用 replaceState 修改历史记录，并更新URL
window.history.replaceState({ page: 2 }, "title 2", "?page=2");

// 当前 URL 会变成类似 https://example.com/?page=2
window.onpopstate = function(event) {
  console.log("历史记录变化，当前状态是：", event.state);
};
5.history 对象：

history.back()：与在浏览器点击后退按钮相同

history.forward()：与在浏览器中点击按钮向前相同

history.go(参数)：前进后退功能，参数如果是1前进一个页面，如果是-1后退一个页面，如果是N则前进或后退N个页面

history.length(): 保存历史记录的数量  
window.history.back()   // 后退
window.history.forward()   // 前进
window.history.go(整数)   //  1表示前进1个页面 -1表示后退一个页面
```