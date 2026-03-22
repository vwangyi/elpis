+ **MDN 之 HTML：**[**https://developer.mozilla.org/zh-CN/docs/Web/HTML**](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
+ **MDN 之 CSS：**[**https://developer.mozilla.org/zh-CN/docs/Web/CSS**](https://developer.mozilla.org/zh-CN/docs/Web/CSS)** **
+ **侧重点在 htmlcss 但不是没有js  **
+ **scss：**
+ **less：**
+ **stylus**
+ **taiwass**

## **三维坐标系是什么**
+ **三维坐标系是由三个相互垂直的坐标轴构成，X 轴就是箭头朝右，Y 轴箭头朝下，Z 轴箭头朝向自己。xyz可以确定空间任意一点位置。**

## **节点、元素、标签有什么区别**
+ **节点是包含元素的 比如 注释算一个节点 但注释不算元素**

## **引入css 的 2 种方式**
+ **Link标签，而@import 是 CSS 中提供的(只能加载 CSS)**
+ **在页面加载的时候，link 会同时被加载，而@import 引用的 CSS 会在页面加载完成后才会加 载引用的 CSS**
+ **@import 只有在 ie5 以上才可以被识别，而 link 是 html 标签，不存在浏览器兼容性问题**
+ **Link 引入样式的权重大于@import 的引用（@import 是将引用的样式导入到当前的页面中）**

## **引入js的 3 种方式**
```html
外链式 通过script标签的src属性引入外部js文件 <script src="../xx.js"></script>

内嵌式 通过script标签的innerHTML属性引入js代码 <script>console.log('hello world')</script>

行内式 通过标签的事件属性引入js代码 <button onclick="alert('hello world')">点击</button>

```

## 
