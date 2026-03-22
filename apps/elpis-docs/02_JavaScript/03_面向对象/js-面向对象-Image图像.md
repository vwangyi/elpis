# 图像

## 创建img图像
```js
const img1 = new Image(100, 50);// 宽度100px，高度50px

console.log(img1.constructor.name); // "HTMLImageElement"
console.log(img1 instanceof HTMLImageElement); // true
console.log(img1.width);  // 100
console.log(img1.height); // 50


const img2 = document.createElement('img');
img2.width = 100;  // 需要单独设置
img2.height = 50;
console.log(img2.constructor.name); // "HTMLImageElement"
console.log(img2 instanceof HTMLImageElement); // true
console.log(img2.width);  // 100
console.log(img2.height); // 50


// 两者创建的对象类型完全一样
console.log(Object.getPrototypeOf(img1) === Object.getPrototypeOf(img2)); // true
```
## 区别
```js 
 
const img = new Image();  
img.src = 'image-url'; 

img.onload = function() {
  console.log('图片加载完成');
};


const img2 = document.createElement('img');
img2.src = 'image-url';
document.body.appendChild(img2);


// new Image() 等同于 document.createElement('img')，它们都创建了 HTMLImageElement 对象。

// 主要区别在于使用场景： 
// Window.Image 通常用于在内存中预加载图片，而不立即显示在页面上 
// <img> 元素用于在页面上显示图片
```