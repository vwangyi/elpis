# 过渡动画

- 过渡动画可以 实现 平移 旋转 缩放 倾斜 等效果  transform 可以进行 块盒的 平移 旋转 缩放 倾斜 等效果而且是脱离文档流的

```css
/* 需要触发 只动一次 */
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  /* 属性名 变换时长 变换方式 延迟时长 */
  transition: width 1s ease 1s, height 2s ease 1s;
}

.box:hover {
  width: 200px;
  height: 200px;
}
```



```css

.css {
	transform-origin: center; /* 原点 */
	/* 平移 */
	transform: translate(20px, 30px);
	transform: translateX(50%); /* 百分比是相对自己 */
	transform: translateY(-50%);


	/* 旋转 */
	transform: rotate(180deg, 180deg, 180deg);
	transform: rotateX(180deg);
	transform: rotateY(180deg);
	transform: rotateZ(180deg);
	/* 缩放 */
	transform: scale() 
	/* 倾斜 */
	transform: xxx

	/* transform复合写法 */
	transform: translateX(600px) rotate(360deg); /* 先平移 再旋转 */


	/* 过渡 */
	transition: all .3s; /*  过渡效果 谁做过渡给谁加 */
	transition: 过渡属性 持续时间 速度曲线 延迟时间
	/* 
		过渡属性： all 其他css属性
	  持续时间： .5s 
	  速度曲线： setups(3) ease linear ease-in ease-out ease-in-out cubic-bezier(x1, y1, x2, y2);
	*/
}





perspective 透视 实现 近大远小效果 （所有的子元素都有 近大远小的效果）有两种用法
1 给父元素添加 perspective: 1000px; 这个父元素的所有子元素 都有 近大远小效果 
2 给自己添加 transform:perspective(1000px) rotate(45deg); 只有自己才有透视效果 


transform: translate3d(x, y, z);

.container .css {
	transform-style: preserve-3d; /*  开启子元素的3D空间 默认值是 flat扁平的 */
}
.css { 
	transform: translateZ(200px); /* 需要给父元素添加 transform-style: preserve-3d; 才能实现z轴平移 */
}

backface-visibility: hidden; /* 旋转到背后就隐藏文字 */


```

