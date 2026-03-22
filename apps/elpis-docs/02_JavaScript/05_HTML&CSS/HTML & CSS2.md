

### 66. 回流和重绘是什么，有什么区别?
#### （1）回流
当渲染树中部分或者全部元素的尺寸、结构或者属性发生变化时，浏览器会重新渲染部分或者全部文档的过程就称为**回流**。



下面这些操作会导致回流：

+ 页面的首次渲染
+ 浏览器的窗口大小发生变化
+ 元素的内容发生变化
+ 元素的尺寸或者位置发生变化
+ 元素的字体大小发生变化
+ 激活CSS伪类
+ 查询某些属性或者调用某些方法
+ 添加或者删除可见的DOM元素



在触发回流（重排）的时候，由于浏览器渲染页面是基于流式布局的，所以当触发回流时，会导致周围的DOM元素重新排列，它的影响范围有两种：

+ 全局范围：从根节点开始，对整个渲染树进行重新布局
+ 局部范围：对渲染树的某部分或者一个渲染对象进行重新布局

#### （2）重绘
当页面中某些元素的样式发生变化，但是不会影响其在文档流中的位置时，浏览器就会对元素进行重新绘制，这个过程就是**重绘**。



下面这些操作会导致重绘：

+ color、background 相关属性：background-color、background-image 等
+ outline 相关属性：outline-color、outline-width 、text-decoration
+ border-radius、visibility、box-shadow

#### （3）如何避免回流与重绘？
**减少回流与重绘的措施：**

+ 操作DOM时，尽量在低层级的DOM节点进行操作
+ 不要使用`table`布局， 一个小的改动可能会使整个`table`进行重新布局
+ 使用CSS的表达式
+ 不要频繁操作元素的样式，对于静态页面，可以修改类名，而不是样式。
+ 使用absolute或者fixed，使元素脱离文档流，这样他们发生变化就不会影响其他元素
+ 避免频繁操作DOM，可以创建一个文档片段`documentFragment`，在它上面应用所有DOM操作，最后再把它添加到文档中
+ 将元素先设置`display: none`，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。
+ 将DOM的多个读操作（或者写操作）放在一起，而不是读写操作穿插着写。这得益于**浏览器的渲染队列机制**。



浏览器针对页面的回流与重绘，进行了自身的优化——**渲染队列**



**浏览器会将所有的回流、重绘的操作放在一个队列中，当队列中的操作到了一定的数量或者到了一定的时间间隔，浏览器就会对队列进行批处理。这样就会让多次的回流、重绘变成一次回流重绘。**



上面，将多个读操作（或者写操作）放在一起，就会等所有的读操作进入队列之后执行，这样，原本应该是触发多次回流，变成了只触发一次回流。

### 


### 69. 伪类和伪元素区别
+ 伪元素：在内容元素的前后插入额外的元素或样式，但是这些元素实际上并不在文档中生成。它们只在外部显示可见，但不会在文档的源代码中找到它们，因此，称为“伪”元素。例如：

```css
p::before {content:"第一章：";}
p::after {content:"Hot!";}
p::first-line {background:red;}
p::first-letter {font-size:30px;}
```

+ 伪类：将特殊的效果添加到特定选择器上。它是已有元素上添加类别的，不会产生新的元素。例如：

```css
a:hover {color: #FF00FF}
p:first-child {color: red}
```

**总结：**伪类是通过在元素选择器上加⼊伪类改变元素状态，⽽伪元素通过对元素的操作进⾏对元素的改变。 

### 70. 如何计算 CSS 优先级？
| **选择器** | **格式** | **优先级权重** |
| :---: | :---: | :---: |
| id选择器 | #id | 100 |
| 类选择器 | .classname | 10 |
| 属性选择器 | a[ref=“eee”] | 10 |
| 伪类选择器 | li:last-child | 10 |
| 标签选择器 | div | 1 |
| 伪元素选择器 | li:after | 1 |
| 相邻兄弟选择器 | h1+p | 0 |
| 子选择器 | ul>li | 0 |
| 后代选择器 | li a | 0 |
| 通配符选择器 | * | 0 |


对于选择器的**优先级**：

+ 标签选择器、伪元素选择器：1；
+ 类选择器、伪类选择器、属性选择器：10；
+ id 选择器：100；
+ 内联样式：1000；



**注意事项：**

+ !important声明的样式的优先级最高；
+ 如果优先级相同，则最后出现的样式生效；
+ 继承得到的样式的优先级最低；
+ 通用选择器（*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0 ；
+ 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。

## 绝对路径相对路径
```html
<script src="../xx.js"></script>

<link rel="stylesheet" href="../xx.css">
<img src="../xx.png">
<a href="../xx.html"></a>

<audio src="../xx.mp3"></audio>

<video src="../xx.mp4"></video>

<!-- 
  不管写相对路径或绝对路径 目的只有一个 就是得到完整的url 因为只有完整的url才可以发请求

  绝对路径
    1 http://www.baidu.com/xx.js   直接写完整的url地址
    2 //www.baidu.com/xx.js         可以省略协议    （会帮我们自动补全协议 把当前页面的协议搬过来 好处就是 开发环境是http 生产环境就是https了）
    3 /xx.js                       可以省略 协议 域名 端口（这仍然是一个绝对路径 会帮我们自动补全协议 域名 端口 同样是 沿用当前页面的 协议 域名 端口）
    以上3种都是绝对路径 因为跟当前页面的path部分 没有关系  path部分都是重新书写的 
    页面的url为： http://www.baidu.com/aa/bb/cc.html
    资源为：/1.png
    得到的完整url为：http://www.baidu.com/1.png
    所以说 为什么叫绝对路径 因为路径是完全重写的 不是相当于当前页面的path 

  相对路径
    1 相对当前页面的路径 ../xx.js   （相对于当前页面的path倒数第二个/之前的路径path部分）
    2 相对当前页面的路径 ./xx.js   （相对于当前页面的path最后一个/之前的路径path部分）
    3 相对当前页面的路径 xx.js     xx.js和./xx.js是等价的 
    以上3种都是相对路径 因为跟当前页面的path部分 有关系  path部分都是沿用当前页面的 
    页面的url为： http://www.baidu.com/aa/bb/cc.html
    资源为：../1.png
    得到的完整url为：http://www.baidu.com/aa/1.png
    所以说 为什么叫相对路径 因为路径是相对当前页面的path部分的


    页面的path和 文件的目录 不是一个东西 不要搞混淆

    当资源和当前页面的path部分 是相对稳定的 就用相对路径
    当资源和当前页面的path部分 是没关系的 就用绝对路径


     相对于路径的叫相对路径 不是相对路径的叫绝对路径
    //www.baidu.com/xx.js  相对于协议 https: 的URL
    /xx.js                 相对于域名 https://www.baidu.com:3000 的URL
    ./xx.js                相对于路径path https://www.baidu.com:3000/aa/bb/ 的URL
 -->
```



CSS是样式语言 <font style="color:rgb(51, 51, 51);">Cascading Style Sheets</font>不是标记语言 更不是编程语言

CSS，全称<font style="color:rgb(51, 51, 51);">Cascading Style Sheets 层叠样式表 </font>  







 





## grid布局
```css
.container {
    display: grid;
    
}
```

 

## 圣杯布局有几种实现方式?都是什么?
# css面试题
> 14*
>

+ [设置元素为display:flex后，哪些属性会失效呢？为什么？](https://github.com/haizlin/fe-interview/issues/3581) 1
+ [使用纯的css如何定义变量？请举例说明 ](https://github.com/haizlin/fe-interview/issues/3521)1
+ [解释下为什么说通配符选择器要慎用？ ](https://github.com/haizlin/fe-interview/issues/2976)1
+ [举例说明BFC有什么应用场景](https://github.com/haizlin/fe-interview/issues/2957) 5
+ [你认为sass和less的最大区别是什么呢？你喜欢哪个？为什么？](https://github.com/haizlin/fe-interview/issues/1739) 1
+ [如何让一个块元素居中？](https://github.com/haizlin/fe-interview/issues/1707) 3
+ [说说display:none和visibility:hidden的区别](https://github.com/haizlin/fe-interview/issues/1699) 1
+ [请说说在什么时候用transition？什么时候使用animation？](https://github.com/haizlin/fe-interview/issues/1198)5
+ [什么是脱离文档流？有什么办法可以让元素脱离标准的文档流？ ](https://github.com/haizlin/fe-interview/issues/1179)1
+ [说说你对媒体查询的理解](https://github.com/haizlin/fe-interview/issues/174) 5
+ [写出你知道的CSS水平和垂直居中的方法](https://github.com/haizlin/fe-interview/issues/145) 5
+ [请描述css的权重计算规则](https://github.com/haizlin/fe-interview/issues/103) 1
+ [CSS3有哪些新增的特性？](https://github.com/haizlin/fe-interview/issues/5) 1
+ [圣杯布局和双飞翼布局的理解和区别，并用代码实现](https://github.com/haizlin/fe-interview/issues/2) 5

## 
 





```css
css {
  user-select: none; 禁止用户选中文字
  pointer-events: none; 禁止鼠标事件 

  // object-fit 一般用于 img 或 video 标签
  object-fit: fill; // 会拉伸元素来填满容器 （默认值）
  object-fit: contain; // 会保持比例缩放，直到元素适合容器的最大边。
                       // 适用于需要确保图像在容器内完全可见的场景（如缩略图、相册图片等）。
  
  object-fit: cover; // 会按比例缩放，并确保元素完全覆盖容器，可能裁剪内容。
                     //  常用于让背景图像完全覆盖容器（如头像或封面图）。
 
  object-fit: none; // 会保持元素的原始尺寸，可能导致溢出或空白。
  object-fit: scale-down; // 会缩小元素，但不会放大，最多缩小到原始尺寸

}
```



## 
###  
###  
 

### 盒子模型
```css
  
  /* 内边距 padding */
  padding: 10px 10px 10px 10px; /* 上 右 下 左 */ 
  padding: 10px 10px 10px; /* 上 左右 下 */ 
  padding: 10px 10px; /* 上下 左右 */ 
  padding: 10px; /* 都是10px */ 


  /* 盒子背景 background   范围是 内容到边框的区域  边框会把背景遮住 */
  
  background-color: transparent;
  background-image: url('');
  background-image: linear-gradient(to right,  red, green, red);   
  background-image: linear-gradient(45deg, red, green, red);  
  background-image: radial-gradient(颜色1, 颜色n);  
  background-image: radial-gradient(red 0%, blue 50%, yellow); 

  background-repeat: repeat; /* 默认平铺 */
  background-repeat: no-repeat; /* 不平铺 */
  background-repeat: repeat-x; /* x轴平铺 */
  background-repeat: repeat-y; /* y轴平铺 */ 

  background-attachment: scroll; /* 默认 */
  background-attachment: fixed; 
    
  background-position: x轴 y轴; 
  background-position: 50% 50%;
  background-position: center;
  background-position: center(x);
  background-position: center(y);

  
  /* background-size 设置 背景大小尺寸  一个值指图片宽度 两个值指图片宽高 */
  /* contain 保证y轴拉伸到最大(x轴可能坏了 留白或丢失 ) */
  /* cover   保证x轴拉伸到最大(y轴可能坏了 留白或丢失 ) */
  background-size: 20px 20px  20px/20px; 


  background-origin: padding-box; /* 默认 */
  background-origin: border-box;
  background-origin: content-box;

  background-clip: border-box; /* 默认 */
  background-clip: padding-box;
  background-clip: content-box;

  background-color: transparent;

  

  /* size只能写在 position后面用 / 分隔  color颜色只能放最后  */ 
  background: image repeat  attachment position/size origin clip color;


   
  /*背景留白: 当打开F12 屏幕视口宽度变窄 右侧背景图片会留白 添加 min-width: 版心宽度就好（1240px） 使背景图片不留白 */  


  /* 盒子阴影 box-shadow */
 
  /* 盒子阴影  盒子阴影和文本阴影用法一样  */ 
  /* x y z(投影距离) 阴影缩放 颜色 */
  box-shadow: 1px 2px 3px 4px pink;
  text-shadow: 0 0 20px black;  
  /* 内阴影 */
  box-shadow: inset 1px 2px 3px pink;

  /* 多阴影 */
  box-shadow: 
      1px 2px 3px red,
      1px 2px 10px green,
      1px 2px 30px blue,
      inset 1px 2px 3px pink;

  box-shadow: 左阴影，上阴影，下阴影，右阴影;  (从左开始，顺时针);


  /* 盒子溢出 */
  /* 注意 必须有height或width 且border之外叫溢出 */
  overflow: visible; /* 默认值 显示滚动条 */
  overflow: hidden;  /* 隐藏溢出部分 */
  overflow: scroll;  /* 始终显示滚动条 */
  overflow: auto;    /* 只有溢出才会显示滚动条 */
  overflow: inherit; 
  overflow: initial; 
  overflow: unset; 

  /* 盒子内容 content */
  /* 块级盒子内部可以放 文本 图片 音频 行内盒子 行内盒子 内部可以放文字 图片等 */
}

```



### 字体文本
> 字体 文本 大多数都可以继承 这就是继承性
>

```css

行高：line-height: 160px;
行高的高度中有 4条线 顶线 中线 基线 底线

—————————————————— 最顶线
—————————————————— 顶线
—————————————————— 中线
—————————————————— 基线
—————————————————— 底线
—————————————————— 最底线

字符所占位置一般是 顶线和底线之间 并不是占行高的全部高度


  行高: 是由 内容高度（顶线 中线 基线 底线）  + 上半间距 和 下半间距 组成的

  文本内容默认 基线对齐 

  不同的字体 行高不一样

  基线的位置是  x的下边缘 (大小写一样) 

  我们可以通过 vertical-align: top | middle | baseline | bottom; 来改变文字以哪条线对齐 

  行内块 默认基线对齐

  块级元素 默认 左上靠齐
.box {
  vertical-align: top;      /* 让文字 顶线对齐 */
  vertical-align: middle;   /* 让文字 中线对齐 */
  vertical-align: baseline; /* 让文字 基线对齐 */
  vertical-align: bottom;   /* 让文字 底线对齐 */
}

.box {
  color: inherit; /* 默认值 继承父元素颜色 */
  color: transparent; /* 透明色 */
  color: red;     /* 颜色 */
  color: #ff0000; /* 颜色 */
  color: rgb(255, 0, 0); /* 颜色 */
  color: rgba(255, 0, 0, 0.5); /* 颜色 */

 
  /* 文本 */
  text-align: left;   /* 文本对齐方式 */
  text-align: center; /* 文本对齐方式 */
  text-align: right;  /* 文本对齐方式 */
  text-decoration: none; /* 文本装饰 默认值 */
  text-decoration: underline; /* 下划线 */
  text-decoration: overline;   /* 上划线 */
  text-decoration: line-through; /* 删除线 */
  text-indent: 2em; /* 首行缩进2个字符 */ 
  vertical-align: top;      /* 让文字 顶线对齐 */
  vertical-align: middle;   /* 让文字 中线对齐 */
  vertical-align: baseline; /* 让文字 基线对齐 */
  vertical-align: bottom;   /* 让文字 底线对齐 */
  word-break: break-all; /* 英文长单词 打断换行 */
  text-shadow: 1px 1px 1px red; /* 文本阴影 常用弹幕 弹幕背景是变化的 */ 
  text-indent: 2em;   /* 首行缩进2个字符 */ 
  text-indent: 2px;   /* px单位是 字体的几倍大小 */ 


  /* 字体 */
  font-style: normal; /* 默认值 */
  font-style: italic; /* 斜体 */
  font-weight: 400; /* 默认值  normal */
  font-weight: 600;   /* 加粗 blob */
  font-size: 16px; /* 字体大小 */
  line-height: 1.5; /* 行高 */  
  font-family: Arial, "字体n";   /* 英文字体必须放中文字体前 中文还要加引号 */

      /*
        文本上下对齐方式  通过 line-height  属性
        字体高度: 50px的字 高度就是50px
        行距（行高） 一行的高度 = 字体高度 + 上下半行间距
        行高 等于 高  字体上下居中
        行高 小于 高  字体上下居上
        行高 大于 高  字体上下居下
    */

  font: font-style font-weight font-size/line-height font-family; /* 简写属性 */
  font: italic 600 16px/30px Arial, "微软雅黑"; /* 简写属性 */



}


.ellipsis{
  /* 必须给宽度 */
  width: 100%;  
  /* 强制一行显示 */
  white-space: nowrap;
  /* 溢出隐藏 */
  overflow: hidden;
  /* 溢出显示省略号 */
  text-overflow: ellipsis; 
}


/* 注意：多行文本有较大兼容性问题适合webkit或者移动端 */
.ellipsis {
  /* 1.超出影藏 */
  overflow: hidden;
  /* 2.用省略号代替超出的部分 */
  text-overflow: ellipsis;
  /* 3.设置弹性伸缩盒子模型 */
  display: -webkit-box;
  /* 4.限制在一个块级元素显示的文本行数 */
  -webkit-line-clamp: 2;
  /* 5.设置或检查伸缩对象的子元素的排列方式 */
  -webkit-box-orient: vertical;
  /* 6.解决只有英文才能换行，中文不能换行 */
  word-break: break-all; 
}

```



### css单位 css变量 函数 css导入
```css

单位 

px  像素 绝对单位  
%   相对于父亲 或 相对于 自己 
em  相对父亲的字体大小的倍数   2em    父元素字体的2倍
rem 相对html根标签的 字体大小的倍数   2rem  根元素的2倍数  (页面元素的px / html 的大小  = 几倍数rem)
 
vh  视口单位 视口高度 一屏高度
vw  一屏宽度 视口宽度  相对当前视口的 百分比    把视口(375px)分为 100份  1vw 就是1份（3.75px） 
rpx 小程序单位  1rpx = 0.5px  1px = 2rpx


运算符 + - * /  可以跨单位计算  运算符左右必须是空格

 /* 内外边距 圆角  都是 4的倍数  */


--color: red;
--size: 100px;
--bg: url(./bg.jpg);
.box {
  color: var(--color);
  width: var(--size);
  background: var(--bg);
  width: calc(var(--size) + 100px);
}
```





###  BFC 块级格式化上下文
它是一块独立的渲染区域, 它规定了在该区域中 常规流块盒的布局(不是行盒 浮动 定位)

什么叫独立的？  
不同的BFC区域, 它们各自进行渲染时互不干扰  
创建了BFC的元素, 隔绝了内部和外部的联系, 内部渲染不会影响外部

常规流在水平方向上 必须撑满包含块  在标准流中 水平方向上排列是 撑满包含块的 撑满自动换行  
常规流块盒在包含块的垂直方向上依次摆放  
常规流块盒 若外边距发生重叠 则取最大的外边距 (外边距合并)

视觉格式化模型 包含 块级格式化上下文 和 行级格式化上下文  
块级格式化上下文 里面 包含了这些具体的规则

bfc里面有什么规则？  
1 块级盒子在垂直方向上 一个接一个的放置  
2 块级盒子垂直方向的距离由margin决定  
3 每个元素的margin box的左边 与包含块border box的左边相接触  
4 bfc的区域不会与float box重叠  
5 bfc就是页面上的一个隔离的独立容器, 容器里面的子元素不会影响到外面的元素  
6 计算bfc的高度时, 浮动元素也参与计算

```css
触发bfc的元素：
html 根标签 天生的bfc
float: left | right; 浮动脱标的元素 天生的bfc
position: absolute | fixed; 定位脱标的元素 天生的bfc
overflow: hidden | auto | scroll;  overflow不为visible的元素
display: inline-block | table-cell | table-caption | flex | inline-flex; 行内块元素 天生的bfc


```

### 圣杯布局
```css
> https://alistapart.com/article/holygrail/
> https://segmentfault.com/a/1190000004524159

1. 两边带有固定宽度中间可以流动：三个盒子 左右两个盒子固定宽度 中间盒子自适应宽度

2. 允许中间一栏最先出现：中间盒子写上面 左右盒子写下面  保证中间盒子优先渲染 因为代码是从上到下执行

3. 允许任何列最高： 任何一列（左侧、中间或右侧列）都可以在高度上是最高的，而其他列将根据最高的列来自适应高度。因为某些情况下 三列中某一列内容可能比其他列多 内容多那么高度就是最高的 不会因为某一列高度高而影响布局

4. 仅需一个额外的 `div` 标签：三列用一个额外的div包裹

5. 仅需非常简单的 CSS，带上最少的兼容性补丁：满足用最少的css和最少的兼容性css（浮动兼容性最好）

   注意 header和footer并不属于圣杯布局必要因素 只是为了展示效果

```vue
<template>
    <header></header>

    <div>
    
  </div>

    <footer></footer>

</template>

<style>
    
</style>

双飞翼布局 rem布局
响应式布局： flex grid 

块级元素 横着排列5种
 1 浮动 
 2 inline-block  
 3 定位 
 4 flex 
 5 grid

原子化css
>  把常用的属性 封装为一个类  y-center  | xy-center  这叫原子化css
 
.center {
   position: absolute;
   top: 0;
   left: 0;
   transform: translate(-50%, -50%)
}
https://www.cnblogs.com/yangjunyi/articles/6214146.html
```

圣杯布局 负margin

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /*
         * 圣杯布局
         * 用浮动+margin实现 
         */
        body {
            margin: 0;
            padding: 0;
        }
        #container{
            width: 100%;
            height: 100vh;
            background-color: #ccc;
        }
        .center, .left, .right {
            height: 100vh;
            /* 三个盒子都开启浮动 都会依次 向左靠齐 一行不够 自动换行 */
            float: left; 
        }

        .center {
            width: 100%;
            background-color: yellow; 
            /* 下面三句话也很重要 */
            padding-left: 200px;
            padding-right: 150px;
            box-sizing: border-box;
        }
        .left {
            width: 200px;
            background-color: red; 
            /* 我们期待left盒子 向左移动 所以给 负左margin 100% */
            /* 为什么是100% 因为我们想移动到父盒子最左边 而100%就是父盒子的宽度 */
            margin-left: -100%; 
        }
        .right {
            width: 150px;
            background-color: rgb(0, 128, 0);
            /* 我们期待right盒子 向左移动 所以给 负左margin  */ 
            /* 为什么是 150px 因为我们想移动到父盒子最右边 而我们自身的宽度就是 150px */
            margin-left: -150px;
        }
    </style>
</head>
<body>
    <div id="container"> 
        <div class="center">456</div>
        <div class="left">123</div>
        <div class="right">789</div>
    </div>
</body>
</html>
```

### 溢出 滚动条
```css
.box {
  overflow: hidden | auto | scroll; 
  overflow-y: xx;
  overflow-x: scroll; // 溢出显示滚动条
}
```



### 全局CSS类 原子化CSS
```css
/* flex居中 */
.flex-center {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
```



## 图 








---





## 12312


## nth-child和nth-of-type的区别
1、:nth-child() 选择器  
:nth-child(n) 选择器匹配属于其父元素的第 N 个子元素，不论元素的类型，n 可以是数字、关键词或公式。

2、:nth-of-type(n)  
:nth-of-type(n) 选择器匹配属于父元素的特定类型的第 N 个子元素的每个元素，n 可以是数字、关键词或公式。

## 请描述一下浏览器渲染的过程？
当浏览器的网络线程收到 HTML 文档后，会产生一个渲染任务，并将其传递给渲染主线程的消息队列。 在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。 整个渲染流程分为多个阶段，分别是： HTML 解析、样式计算、布局、分层、绘制、分块、光栅化、画 每个阶段都有明确的输入输出，上一个阶段的输出会成为下一个阶段的输入。 这样，整个渲染流程就形成了一套组织严密的生产流水线。

[图片]

1. 渲染的第一步是解析 HTML文档
2. 解析的过程中遇到HTML元素会解析HTML元素最终生成DOM树
3. 解析的过程中遇到style标签、link元素、行内样式等CSS样式，会解析CSS生成CSSOM树  
CSS不会阻塞HTML解析  
如果主线程解析到link位置，此时外部的 CSS 文件还没有下载解析好，主线程不会等待，继续解析后续的 HTML。这是因为下载和解析 CSS 的工作是在预解析线程中进行的。这就是 CSS 不会阻塞 HTML 解析的根本原因。  
JS会阻塞HTML解析  
如果主线程解析到script位置，会停止解析 HTML，转而等待 JS 文件下载好，并将JS代码解析执行完成后，才能继续解析 HTML。这是因为 JS 代码的执行过程可能会修改当前的 DOM 树，所以 DOM 树的生成必须暂停。这就是 JS 会阻塞 HTML 解析的根本原因。

此时，会得到 DOM 树和 CSSOM 树，浏览器的默认样式、内部样式、外部样式、行内样式均会包含在 CSSOM 树中。  
[图片]

渲染的下一步是样式计算  
主线程会遍历得到的 DOM 树，依次为树中的每个节点计算出它最终的样式，称之为 Computed Style。  
在这一过程中，很多预设值会变成绝对值，比如red会变成rgb(255,0,0)；相对单位会变成绝对单位，比如em会变成px  
这一步完成后，会得到一棵带有样式的 DOM树。

[图片]

接下来是布局， 布局完成后会得到布局树 layout。  
布局阶段会依次遍历 DOM 树的每一个节点，计算每个节点的几何信息。例如节点的宽高、相对包含块的位置。  
[图片]

下一步是分层 Layer  
主线程会使用一套复杂的策略对整个布局树中进行分层。  
分层的好处在于，将来某一个层改变后，仅会对该层进行后续处理，从而提升效率。  
滚动条、堆叠上下文、transform、opacity 等样式都会或多或少的影响分层结果，也可以通过will-change属性更大程度的影响分层结果。  
[图片]  
[图片]

再下一步是绘制 paint  
主线程会为每个层单独产生绘制指令集，用于描述这一层的内容该如何画出来。  
完成绘制后，主线程将每个图层的绘制信息提交给合成线程，剩余工作将由合成线程完成。  
[图片]  
[图片]  
接下来是合成线程的工作  
分块 tilling  
合成线程首先对每个图层进行分块，将其划分为更多的小区域。  
[图片]  
分块的工作是交给多个线程同时进行的  
[图片]  
[图片]

分块完成后，进入光栅化阶段 raster。  
合成线程会将块信息交给 GPU 进程，以极高的速度完成光栅化。  
GPU 进程会开启多个线程来完成光栅化，并且优先处理靠近视口区域的块。  
光栅化的结果，就是一块一块的位图  
[图片]

你模型的那些顶点在经过各种矩阵变换后也仅仅是顶点。而由顶点构成的图形要在屏幕上显示出来，除了需要顶点的信息以外，还需要确定构成这个图形的所有像素的信息。  
[图片]

最后一个阶段就是画了 draw  
合成线程拿到每个层、每个块的位图后，生成一个个「指引（quad）」信息。  
指引会标识出每个位图应该画到屏幕的哪个位置，以及会考虑到旋转、缩放等变形。  
变形发生在合成线程，与渲染主线程无关，这就是transform效率高的本质原因。  
合成线程会把 quad 提交给 GPU 进程，由 GPU 进程产生系统调用，提交给 GPU 硬件，完成最终的屏幕成像。

## 什么是回流 reflow？
[图片]  
reflow 的本质就是重新计算 layout 树。  
当进行了会影响布局树的操作后，需要重新计算布局树，会引发 layout。  
为了避免连续的多次操作导致布局树反复计算，浏览器会合并这些操作，当 JS 代码全部完成后再进行统一计算。所以，改动属性造成的 reflow 是异步完成的。  
也同样因为如此，当 JS 获取布局属性时，就可能造成无法获取到最新的布局信息。  
浏览器在反复权衡下，最终决定获取属性立即 reflow。

## 什么是重绘？
[图片]  
repaint 的本质就是重新根据分层信息计算了绘制指令。  
当改动了可见样式后，就需要重新计算，会引发 repaint。  
由于元素的布局信息也属于可见样式，所以 reflow 一定会引起 repaint。

## 为什么 transform 的效率高？
[图片]  
因为 transform 既不会影响布局也不会影响绘制指令，它影响的只是渲染流程的最后一个draw阶段  
由于 draw 阶段在合成线程中，所以 transform 的变化几乎不会影响渲染主线程。反之，渲染主线程无论如何忙碌，也不会影响 transform 的变化。

## 
## 如何减少回流重绘？
1. 尽量使用css属性简写:如：用boder代替boder-width，boder-style，boder-color
2. 批量修改元素样式 比如用：class
3. 尽量避免用table布局(table元素一旦触发回流就会导致table里所有的其它元素回流)
4. 需要创建多个DOM节点时,使用DocumentFragment创建。
5. 尽量不要在for循环里面获取元素的位置或者大小属性，这也会引起回流。一定要获取，最好能利用缓存。
6. 事件分级 DOM0  DOM2的区别？   
DOM事件绑定：  
DOM0级事件  
特点：所有的浏览器都支持；事件只能注册一次，后面的会覆盖旧的；  
注册方式：  
（1）在html上添加<div οnclick="alert('hello')">，其中this指向自身。 （2） 匿名函数d.οnclick=function(){}，其中 this 指向自身 （3）普通函数 οnclick="ok()"，相当于动态调用，没有时间参数e的传递。

 DOM2级事件  
注册方式：  
        添加：addEventListener(event,function,userCapture)

dom0级事件和dom2级事件的区别：  
如果分别定义了两个dom0级事件和2个dom2级事件：  
dom0级事件会覆盖；  
dom2不会覆盖，会依次执行；  
dom0和dom2可以共存，不互相覆盖，但是dom0之间依然会覆盖。

## addEventlistener的参数有哪些？
el.addEventListener(type, listener, useCapture)

+ el：事件对象。比如，某个标签，window，document 对象等等。
+ type：事件类型，click、mouseenter 等。
+ listener：事件处理函数，事件发生时，就会触发该函数运行。
+ useCapture：布尔值，规定是否是捕获型，默认为 false（冒泡）。 为true时捕获，false时冒泡。因为是可选的，往往也会省略它。  
addEventListener() 的第三个参数可为 {} 对象

el.addEventListener(type, listener, {  
    capture: false, // === useCapture  
    once: false,    // 是否设置单次监听,if true，会在调用后自动销毁listener  
    passive: false  // 是否让 阻止默认行为(preventDefault()) 失效，if true, 意味着listener永远不远调用preventDefault方法  
})  
// 新增参数的三个属性，默认值都是 false。

+ true 的触发顺序总是在 false 之前；
+ 如果多个均为 true，则外层的触发先于内层；
+ 如果多个均为 false，则内层的触发先于外层。

## HTML中DOCTYPE的作用？
是h5的声明。  
用于声明当前HTML版本，用来告知web浏览器该文档使用是哪种 HTML 或者 XHTML 规范来解析页面，以便浏览器更加准确的理解页面内容，更加良好地展现内容效果！  
只要我们对文档DOCTYPE做了正确的声明，浏览器就会进入标准模式；浏览器会按照W3C的标准来解析渲染页面，在所有浏览器下显示的样式效果会保持一致。  
如果不写，浏览器会以老旧的“怪异模式”去渲染页面。不同浏览器下显示样式效果会不一致。  
[图片]

## 什么是事件委托？
“事件代理”就是把原本需要绑定在子元素的响应事件委托给父元素，具体实现过程主要是：利用事件冒泡过程，并且利用事件对象event的target属性精准定位到触发事件的子元素对子元素进行操作。

## e.target和e.currentTarget的区别？
e.currentTarget始终是监听事件者，即 直接调用addEventlistener那个节点  
e.target是事件的真正发出者， 即 实际触发事件的节点，在click事件中就是被点击的节点。

## 如何获取用户的浏览器内核是什么？
navigator.appCodeName

## 为什么inline-block布局的时候存在一个空格的间距？
这实际上是换行引起的问题，默认会显示一个空格，所以需要给父级设置font-size=0

```html
<ul>
    <li>这是一个li</li><li>这是另一个li</li><li>这是另另一个li</li>
    <li>这是另另另一个li</li>
</ul>

```

## 在flex中justify-content的作用是什么?
   作用：设置同一行子元素在主轴的对齐方式（flex布局默认x轴为主轴，水平向右）  
   用法：写在父级，作用于子级

## 如何修改flex布局主轴方向
flex布局默认：主轴的方向是x轴的方向，水平向右  
修改主轴方向使用 flex-direction属性，具体规则如下

## position有哪几个属性？
```plain
    1.position: static 静态定位（默认）
    2.position:relative 相对定位
            参考物：元素的初始位置
            特点：不影响元素本身特性，元素不脱离文档流，相对于原位置进行偏移
    3.position:absolute 绝对定位
            参考物：距离最近的使用了定位的父级，没有时找body
            特点：元素脱离文档流 ，块级元素由内容撑开宽高，清除子集浮动
    4.position:fixed 固定定位
            参考物：浏览器窗口
            特点：清除子集浮动，脱离文档流
    5. postion: sticky 粘性定位
          参考物：根据用户的滚动位置进行定位
          特点：粘性元素根据滚动位置在相对（relative）和固定（fixed）之间切换。起先它会被相对定位，直到在视口中遇到给定的偏移位置为止 - 然后将其“粘贴”在适当的位置（比如 position:fixed）。
```

[图片]  
[https://blog.csdn.net/JiangLittleBai/article/details/108653463](https://blog.csdn.net/JiangLittleBai/article/details/108653463)

## 浮动和绝对定位的区别？
浮动元素清除浮动之后会撑开父元素。  
绝对定位脱离了文档流，不会撑开父元素

## 对行内元素设置margin-top生效吗？
不生效，只有左右margin生效

##  


## 浏览器下载资源是并行还是串行的？
并行，最多支持6个

## 了解过webp吗？
WebP 是一种现代的图片格式，用于在 web 上提供更好的有损和无损压缩图片。使用 WebP，网站管理员和网页开发人员可以创建更小、更丰富的图片，使网页更快。WebP 无损图像比 PNG 图像小 26%。¹

有损 WebP 压缩使用预测编码对图像进行编码，这种方法与 VP8 视频编解码器用于压缩视频关键帧的方法相同。预测编码使用相邻块的像素值来预测块中的值，然后仅对差异进行编码。¹

无损 WebP 压缩使用已经看到的图像片段来精确重建新像素。如果没有找到有趣的匹配，它还可以使用本地调色板。¹

## html使用的字符集是什么？有什么特点？
utf-8是由unicode演变而来的。  
通用性强，空间占用合理。  
计算机诞生 ASC编码，一百多个。  
Abcdef             老虎              西班牙语  
123456 - 100    20000 30000  
UTF-8 是一种针对 Unicode 的可变长度字符编码。由于 Unicode 包含了世界上几乎所有的字符，因此 UTF-8 支持世界上几乎所有国家和地区的语言。

## 什么是雪碧图？作用和原理了解吗？
把小图片利用工具合成一张，使用的时候通过css的background控制位置进行展示。  
可以节省网络请求数量。

## display:none和visible:hidden的区别？
一个占位一个不占位。  
visible:hidden占位  
display:none不占位

## css中的伪元素是什么？有什么作用？
CSS 中常用的伪元素有：

+ ::before：在元素内容前面插入内容。
+ ::after：在元素内容后面插入内容。
+ ::first-letter：选择文本的首字母。
+ ::first-line：选择文本的首行。
+ ::selection：选择用户选中的文本。

这些伪元素可以用来添加一些选择器的特殊效果，例如向文本的首行或首字母设置特殊样式，或者在元素内容前后插入新内容。

## flex布局可以设置item子元素的顺序吗？
可以  
可以使用 CSS 的 order 属性来控制 flex 容器中项目的顺序。默认情况下，项目的 order 值为 0，你可以为项目设置一个正数或负数的 order 值来改变它们的顺序。具有较小 order 值的项目会排在前面。

## background-size有哪些属性？
background-size 属性用于指定背景图片的大小。它可以接受以下值：

+ auto：默认值。保持背景图片的原始尺寸。
+ ：可以使用长度单位（如 px、em 等）来指定背景图片的宽度和高度。
+ ：可以使用百分比来指定背景图片的宽度和高度，相对于背景区域的大小。
+ cover：将背景图片缩放，使其完全覆盖背景区域，同时保持宽高比不变。如果背景图片和背景区域的宽高比不同，那么背景图片将被裁剪以适应背景区域。（图片会被裁剪，显示全）
+ contain：将背景图片缩放，使其完全适应背景区域，同时保持宽高比不变。如果背景图片和背景区域的宽高比不同，那么背景区域将被留白。（图片将展示完全）

## 伪元素和伪类的区别是什么？
伪元素和伪类都是 CSS 中的选择器，它们都允许你在不改变 HTML 结构的情况下为特定元素或元素的一部分应用样式。

伪类用于根据元素的状态来选择元素，例如鼠标悬停状态（:hover）、选中状态（:checked）或是否被访问过（:visited）等。伪类通常用于为元素添加一些交互效果。

伪元素用于创建一些不在文档树中的元素，并为它们应用样式。例如，你可以使用 ::before 和 ::after 伪元素在元素内容前后插入新内容，或者使用 ::first-letter 和 ::first-line 伪元素为文本的首字母或首行设置特殊样式。

总之，伪类和伪元素的主要区别在于它们选择的对象不同：伪类选择的是已经存在于文档树中的元素，而伪元素创建了一些新的元素。

## flex的子元素可以浮动吗？
不可以，冲突了，还是flex状态

## CSS如何实现一条0.5像素的线？
用scale缩小。  
浏览器最小只支持1像素

## 了解过shadow Dom吗？
Shadow DOM 允许将隐藏的 DOM 树附加到常规的 DOM 树中。它以 shadow root 节点为起始根节点，在这个根节点的下方，可以是任意元素，和普通的 DOM 元素一样。这样，你就可以创建一个独立的 DOM 子树，它与主文档隔离开来，拥有自己的样式和脚本。  
隔离性很强，但是不太好用，api比较反人类。  
Shadow DOM 的一个重要用途是封装。它允许组件拥有自己的“影子” DOM 树，这个树不能被主文档意外访问，可以有本地样式规则等。这样，你就可以创建一个组件，它的内部结构、样式和行为都被隐藏起来，与页面上其他部分隔离开来，避免冲突。¹

应用场景： web components, 微信小程序

## 可以怎么优化CSS动画性能？
最核心要开启gpu加速。  
requestAnimationFrame,如果用js修改元素的位置，推荐使用这个API。  
建议使用requestA  
利用css3 translate进行元素移动  
在 CSS3 中，可以使用 transform 属性的 translateZ 函数或 translate3d 函数来开启 GPU 加速。这些函数会创建一个新的图层，浏览器会使用 GPU 来渲染这个图层，从而提高性能。

例如，你可以使用以下代码来开启 GPU 加速：  
.element {  
  transform: translateZ(0);  
}

或者：

.element {  
  transform: translate3d(0, 0, 0);  
}

## 有一个高度自适应的 div，里面有两个 div，一个高度 100px，希望另一个填满剩下的高度，怎么实现？
利用css的calc（100% - 100px）

## line-height: 120% 和 line-height: 1.2有什么区别？
line-height 属性用于指定行高。当你使用百分比值（如 120%）时，行高是相对于该元素的字体大小计算的。例如，如果元素的字体大小为 14px，则 line-height: 120% 等同于 line-height: 16.8px。

当你使用数值（如 1.2）时，行高是相对于该元素的字体大小计算的，但是这个数值会被继承。例如，如果父元素的字体大小为 14px，则 line-height: 1.2 等同于 line-height: 16.8px。但是，如果子元素的字体大小为 18px，则它的行高将为 21.6px（即 18px * 1.2），而不是继承父元素的 16.8px。

因此，当你使用百分比值时，子元素会继承计算后的行高值；而当你使用数值时，子元素会继承这个数值，并根据自己的字体大小重新计算行高。





## HTML
1. [什么是重绘和回流？（浏览器绘制过程）](https://github.com/CavsZhouyou/Front-End-Interview-Notebook/blob/master/Html/Html.md#24-%E4%BB%80%E4%B9%88%E6%98%AF%E9%87%8D%E7%BB%98%E5%92%8C%E5%9B%9E%E6%B5%81%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BB%98%E5%88%B6%E8%BF%87%E7%A8%8B)



## CSS
1. [如何居中 div？](https://github.com/CavsZhouyou/Front-End-Interview-Notebook/blob/master/Css/Css.md#9%E5%A6%82%E4%BD%95%E5%B1%85%E4%B8%AD-div)
2. BFC
3. 重排重绘
4. 圣杯布局（4种方案）
5. flex和grid区别



## css面试题
> 14*
>

+ [设置元素为display:flex后，哪些属性会失效呢？为什么？](https://github.com/haizlin/fe-interview/issues/3581) 1
+ [使用纯的css如何定义变量？请举例说明 ](https://github.com/haizlin/fe-interview/issues/3521)1
+ [解释下为什么说通配符选择器要慎用？ ](https://github.com/haizlin/fe-interview/issues/2976)1
+ [举例说明BFC有什么应用场景](https://github.com/haizlin/fe-interview/issues/2957) 5
+ [你认为sass和less的最大区别是什么呢？你喜欢哪个？为什么？](https://github.com/haizlin/fe-interview/issues/1739) 1
+ [如何让一个块元素居中？](https://github.com/haizlin/fe-interview/issues/1707) 3
+ [说说display:none和visibility:hidden的区别](https://github.com/haizlin/fe-interview/issues/1699) 1
+ [请说说在什么时候用transition？什么时候使用animation？](https://github.com/haizlin/fe-interview/issues/1198)5
+ [什么是脱离文档流？有什么办法可以让元素脱离标准的文档流？ ](https://github.com/haizlin/fe-interview/issues/1179)1
+ [说说你对媒体查询的理解](https://github.com/haizlin/fe-interview/issues/174) 5
+ [写出你知道的CSS水平和垂直居中的方法](https://github.com/haizlin/fe-interview/issues/145) 5
+ [请描述css的权重计算规则](https://github.com/haizlin/fe-interview/issues/103) 1
+ [CSS3有哪些新增的特性？](https://github.com/haizlin/fe-interview/issues/5) 1
+ [圣杯布局和双飞翼布局的理解和区别，并用代码实现](https://github.com/haizlin/fe-interview/issues/2) 5



##  


## 父元素father使用flex布局，不设高度，子元素son2高度设置为200px，子元素son2撑开了父元素father，son1无法填满父级元素高度。
```html

align-items: stretch; 

flex
一个高度不固定的div，里面的文字如何垂直居中？

没有高度 意味着 line-height 不能实现
flex布局 好像也不能实现


        display: flex;
        flex-direction: column; // row不能实现
        justify-content: center;
        algin-items: center; 
        text-align: center;
==========================================
    .main .list .row {
        width: calc(100% - 66rpx);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: nowrap;
        margin: 4px 33rpx;
        align-items: stretch;
    }

    .main .list .row .card {
        flex: 1;
        height: inherit;
        padding: 4px 8rpx;
        background: #e2e2e2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        algin-items: center;
        text-align: center;
    }
    .main .list .row .card {
        margin-right: 8px;
        &:nth-child(3) {
            margin-left: 0;
            margin-right: 0;
        }
    }
```

## 
## 


## 如何清除float？
clear: both   
双伪元素 设置clear both  
给触发父元素的bfc overflow: hidden overflow: auto





## 实现一个自适应等比的正方形?
既然是正方形 那么宽高就是相等的  
1 根据浏览器的宽度变化而变化的话 可以用 css3的视口宽度 vw  
比如说 宽高都给 20vw 就是一个正方形

2 margin和padding的百分比单位是相对于父元素宽度为基准的特性



## 圣杯布局
圣杯布局 和 双飞翼布局 就是 左右固定 中间自适应  
圣杯布局 和 双飞翼布局 4种实现方式: float position flex grid   
float 配合 calc()   
定位 同时给left和right 相当于给了宽度  
flex 左右固定 中间flex 1   
grid grid-template-columns: 200px 1fr 200px;

##  


+ HTML&&CSS 听说读写 持续迭代 ：必须过关 

****

+ **MDN 之 HTML：**[**https://developer.mozilla.org/zh-CN/docs/Web/HTML**](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
+ **MDN 之 CSS：**[**https://developer.mozilla.org/zh-CN/docs/Web/CSS**](https://developer.mozilla.org/zh-CN/docs/Web/CSS)** **
+ ****
+ **以画页面敲代码的视角 总结 可调用的心智模型 最后总结一些 html css 优化**
+ ****





## css 三大特性是 继承性 优先级 层叠性
##  
## 左侧固定 右侧弹性 用几种方式实现
+ calc()计算剩余宽度
+ 绝对定位同时给 left 和right 不用给width 

## 引入 css 两种方式有什么区别
```html
<link rel="stylesheet" href="./main.css">
<style>
    @import url('./main.css');
</style>
```

##  
## CSS选择器和权重优先级


## 
## 


## html5新特性
## css3新特性


## BFC是什么
+ BFC 全称是 Block Formatting Conttext 块级格式化上下文，它规定了内部块盒如何布局，和外部互不影响。比如块盒应该独占一行。
+ 触发 BFC 的方式：overflow：hidden; 多准备几个
    - overflow: hidden; （overflow 不为 visible 的元素）
    - display: inline-block; （行内块元素）
    - 绝对定位和固定定位的盒子 （position: absolude; position: fixed;)
    - 浮动元素（float 不为 none ）
    - html标签 是天生的 BFC 盒子

BFC（块格式化上下文）是 Web 页面的可视 CSS 渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。简单来说，BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素¹²。  
创建 BFC 的常用方式有以下几种：

1. 浮动元素（元素的 float 不是 none，指定 float 为 left 或者 right 就可以创建 BFC）。
2. 绝对定位元素（元素的 position 为 absolute 或 fixed）。
3. display: inline-block，display: table-cell，display: flex，display: inline-flex。
4. overflow 指定除了 visible 的值¹。

这些方式都可以创建一个独立的块格式化上下文，使得容器内部的元素布局不会影响到外部元素。

+ BFC 块级格式化上下文
    - BFC是块级格式化上下文 规定了内部块盒如何布局，他是一个独立的渲染区域，和外部区域互不影响。
        * 块盒独占一行 从上到下 垂直排列 
            + 因为widht默认auto （auto 沾满剩余空间）
        * 两个块盒在垂直方向上会发生重叠
    - 如何触发BFC
        * html 是天生的BFC 不用触发
        * overflow不是visibe
            + overflow ：hidden
        * 浮动元素
            +  float不是none的元素
        * 绝对定位元素
            + position是absolude或fixed的元素
        * 行内块元素
            + display：inline-block
    - 解决什么问题
        * 解决外边距塌陷
        * 可以清除浮动等



##  
## 
## 
## 大屏适配方案
![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/34696752/1760542402841-f98a6dce-97ae-47c9-a09a-634c40aa9102.jpeg)

## 移动端适配方案
+ 移动端适配方案
    - 是什么
        * 移动端适配是PC端页面在移动端设备上也有合理的布局
    - 怎么做
        * 主流方案
            + vw
                - 缺点 需要单独写一套移动端代码
                - 好处 vw是直接相对视口
                - kaola.com 考拉官网移动端访问 kaola.com 重定向到 m.kaola.com
                - pvp.qq.com 王者荣耀官网移动端访问 pvp.qq.com/ 重定向 https://pvp.qq.com/m/
        * 过时方案
            + rem + js动态设置html的font-size
            + rem + 媒体查询设置html的font-size
            + 为什么大厂在用rem 因为他们改最新的vw 万一出错 后果很严重
        * 最方便方案
            + flex
                - 好处 和pc端共用一套代码



## CSS属性值的计算过程
![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/34696752/1760538993483-bf68c7cd-b5a1-4456-9f84-1faa030eacc0.jpeg)



## 视觉格式化模型
+ 视觉格式化模型 Visual Formatting Model
    - 定位模型 Positioning Model
        * 常规流
            + 块级盒必定参与块格式化上下文，行内级盒必定参与行内格式化上下文
            + 块盒独占一行 从上到下 垂直排列
            + 行盒 不独占一行 从左到右 水平排列 满行自动换行
        * 浮动
            + 脱离常规流
        * 绝对定位
            + 脱离常规流
    - 层叠上下文（Stacking Context）
        * 决定了元素的层叠顺序，即在页面上哪些元素会显示在其他元素的前面或后面。 z-index will-change
    - xxxxxx

## 盒模型和视觉格式化模型有什么区别
+ 盒模型和视觉格式化模型的区别
    - 盒模型是用来计算 盒子的尺寸大小
    - 视觉格式化模型是用来决定 盒子的类型和盒子的位置

## 
##  


##  HTML5新增了什么
+ html5 新特性：
    - 新增语义化标签
    - 音视频标签
    - canvas

<!-- h5新增了什么 h5新特性有哪些 -->



1 新增语义化标签 header footer nav article section aside main 有利于seo

2 新增媒体标签 audio video

3 新增canvas标签

4 新增本地存储 localStorage 本地存储 sessionStorage 会话存储

5 新增webworker 多线程 如果我们要下载一个很大的文件   这时候用webworker 单独开启一个新的线程去下载文件

6 新增webSocket 客户端和服务端可以双向通信

7 新增表单控件 date time email url number range color

css3新特性 css3新增了什么

HTML5有哪些新特性（至少5种）？

语义化标签 有助于seo, 样式没加载出来时页面结构更加清晰  
媒体标签: video audio  音视频 媒体标签  
拖放API

本地存储 localStorage, sessionStorage  客户端数据存储  
canvas 画布 绘图  
svg 绘图  
地图定位  
webSocket(长连接)  单个TCP连接上进行全双工通讯的协议。

## CSS3 新增了什么
+ CSS3新特性有哪些
    - 新增 子元素选择器 兄弟选择器 属性选择器
    - 新增 怪异盒模型 box-sizing：border-box；
    - 新增 变形和动画 transform和animation
    - 新增 flex布局
    - 新增 边框圆角
    - 新增 媒体查询
    - 新增 背景渐变色
+ 选择器新增 通用选择器(*) 属性选择器([attr])  子元素选择器(>) 
+ 动画新增了 **transform 属性 和 keyframes**
+ **响应式布局 新增 flex 和 媒体查询@media**
+ **边框新增了 border-radius 和 box-shadow **
+ **背景新增 backgound-image **
1. **文字和字体：CSS3 支持更多的字体和文字效果，包括自定义字体（@font-face）、文本阴影（text-shadow）、文本渐变（background-clip）等。**
2. **盒模型**：CSS3 引入了更多的盒模型特性，例如盒阴影（**box-shadow**）、盒模糊（**filter: blur()**）等，可以更加灵活地控制元素的样式。

圆角边框  
背景色渐变  
css3 转换和变形和动画  
transform 转换   
transition 变形  
animation 动画 

## seo
seo就是搜索引擎优化

seo的存在是为了提升网站在搜索引擎中的权重

dom结构尽量精简 不要写没必要的标签  
img标签 添加上 title 和 alt 属性  
使用语义化标签 避免使用 非语义化标签  
避免重排



## 选择器的伪类和选择器的伪元素区别
![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/34696752/1760539290968-365bbeb3-4154-4ae3-b5e9-1c444f476e8a.jpeg)

+ 伪元素：在内容元素的前后插入额外的元素或样式，但是这些元素实际上并不在文档中生成。它们只在外部显示可见，但不会在文档的源代码中找到它们，因此，称为“伪”元素。例如：

```css
p::before {content:"第一章：";}
p::after {content:"Hot!";}
p::first-line {background:red;}
p::first-letter {font-size:30px;}
```

+ 伪类：将特殊的效果添加到特定选择器上。它是已有元素上添加类别的，不会产生新的元素。例如：

```css
a:hover {color: #FF00FF}
p:first-child {color: red}
```

**总结：**伪类是通过在元素选择器上加⼊伪类改变元素状态，⽽伪元素通过对元素的操作进⾏对元素的改变。 

## <font style="color:rgb(38, 38, 38);background-color:rgb(243, 243, 246);">:nth-child和:nth-of-type区别</font>
## 语义化标签有哪些
header  
main  
footer  
aside  
nav  
article  
section

我们要尽可能的使用语义化标签   
避免大量的使用 div span 非语义化标签  
使用语义化标签 有利于seo搜索引擎爬虫抓取更多的有效信息  
使用语义化标签 代码结构比较清晰 可读性更高  
css命名语义化 

## CSS选择器和权重优先级
![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/34696752/1760890506464-28641c08-4dea-45ab-b61a-08d3955f9363.jpeg)

+ class 选择器 class="xx"
+ id 选择器 id="xx"
+ 标签选择器 div span
+ 后代选择器
+ 子代选择器 >
+ 相邻兄弟选择器

常见的CSS选择器包括以下几种：

1. 元素选择器（Element Selector）：根据元素的标签名匹配元素，例如 p、h1、div 等。
2. ID选择器（ID Selector）：根据元素的id属性值匹配元素，id值是唯一的，每个元素只能有一个id，例如 #header。
3. 类选择器（Class Selector）：根据元素的class属性值匹配元素，class值可以重复使用，一个元素可以有多个class，例如 .nav、.box。
4. 属性选择器（Attribute Selector）：根据元素的属性值匹配元素，例如 [type="text"]、[href^="https://"] 等。
5. 伪类选择器（Pseudo-class Selector）：根据元素的状态匹配元素，例如 :hover、:active、:first-child 等。
6. 伪元素选择器（Pseudo-element Selector）：用来匹配元素的某些部分，例如 ::before、::after。
7. 后代选择器（Descendant Selector）：选择某个元素下的所有后代元素，例如 #header p。
8. 子元素选择器（Child Selector）：选择某个元素下的直接子元素，例如 ul > li。
9. 相邻兄弟选择器（Adjacent Sibling Selector）：选择某个元素后面的相邻兄弟元素，例如 h1 + p。
10. 通用选择器（Universal Selector）：匹配所有元素，例如 *。 



+ 如何计算 CSS 优先级？

| **选择器** | **格式** | **优先级权重** |
| :---: | :---: | :---: |
| id选择器 | #id | 100 |
| 类选择器 | .classname | 10 |
| 属性选择器 | a[ref=“eee”] | 10 |
| 伪类选择器 | li:last-child | 10 |
| 标签选择器 | div | 1 |
| 伪元素选择器 | li:after | 1 |
| 相邻兄弟选择器 | h1+p | 0 |
| 子选择器 | ul>li | 0 |
| 后代选择器 | li a | 0 |
| 通配符选择器 | * | 0 |


对于选择器的**优先级**：

+ 标签选择器、伪元素选择器：1；
+ 类选择器、伪类选择器、属性选择器：10；
+ id 选择器：100；
+ 内联样式：1000；



**注意事项：**

+ !important声明的样式的优先级最高；
+ 如果优先级相同，则最后出现的样式生效；
+ 继承得到的样式的优先级最低；
+ 通用选择器（*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0 ；
+ 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。

###   
## 


## CSS如何实现三角形
+ 宽高设置为 0 ，设置 border 的宽度，三个边为透明色。
+ 盒子宽高设置为 0， 给 border 设置宽度和颜色，其他三边给透明色。
+ 如何实现三角形
    - 盒子宽高为0  给border宽度和颜色 其他三边给透明色
    - 一共4边宽度 至少要给2边宽度
    - 通过rotate旋转 可以得到指向任何方向的三角形

## CSS如何实现0.5px的线
+ 先画 1px 高度的盒子 然后缩放 0.5 倍，代码就是 height: 1px; transfrom: scaleY(0.5);
1. <font style="color:rgb(80, 161, 79);">transform</font><font style="color:rgb(56, 58, 66);">: </font><font style="color:rgb(193, 132, 1);">scale</font><font style="color:rgb(56, 58, 66);">(</font><font style="color:rgb(152, 104, 1);">0.5</font><font style="color:rgb(56, 58, 66);">,</font><font style="color:rgb(152, 104, 1);">0.5</font><font style="color:rgb(56, 58, 66);">);</font>
2. <font style="color:rgb(80, 161, 79);">box-shadow</font><font style="color:rgb(56, 58, 66);">: </font><font style="color:rgb(152, 104, 1);">0</font><font style="color:rgb(152, 104, 1);">0.5px</font><font style="color:rgb(152, 104, 1);">0</font><font style="color:rgb(152, 104, 1);">#000</font><font style="color:rgb(56, 58, 66);">;</font>
3. _<font style="color:rgb(160, 161, 167);">/* 利用css对于阴影的处理方法，四个值分别表示 x 偏移量 | y 偏移量 | 阴影模糊半径 | 阴影颜色 */</font>_



##  
## <font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">响应式设计</font>
    - **<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">视口</font>**<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">：</font><font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> </font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">《meta name="viewport"〉</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> </font><font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">标签的作用。</font>
    - **<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">媒体查询</font>**<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">： 使用</font><font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> </font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">@media</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> </font><font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">针对不同屏幕尺寸应用不同的样式。</font>
    - **<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">相对单位</font>**<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">： 熟练使用 </font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">%</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">, </font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">vw</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">/</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">vh</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">, </font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">rem</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">/</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">em</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> 等，使布局和字体能够自适应。</font>



“实现一个两栏布局，左侧固定宽度，右侧自适应。”（考察 Float + margin、Flex、Grid 等多种方案）

“实现一个水平垂直居中的元素。”（能说出多种方法体现你的知识广度）

实现水平垂直居中元素 多种方式

flexbox‘圣杯布局’或‘双飞翼布局’

Grid实现九宫格



+ <font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“请详细说明 Flexbox 布局的主轴和交叉轴，以及如何对齐？”</font>
+ <font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">rem</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> </font><font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">和</font><font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> </font>`<font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);">em</font>`<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"> </font><font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">的区别是什么？”</font>
+ <font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“移动端响应式布局你通常怎么做？”</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">变量： CSS Custom Properties (--*)，用于主题切换、统一管理颜色/尺寸等。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">过渡与动画： transition 和 @keyframes 动画，实现交互反馈和视觉吸引。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">预处理语言： 至少熟悉一种，如 Sass/SCSS 或 Less。理解嵌套、变量、Mixin、函数等特性。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">BEM 命名方法论： 一种 CSS 类名命名规范，旨在解决大型项目中类名冲突和结构混乱的问题。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">选择器性能： 理解过于复杂的选择器会影响渲染性能。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">重排与重绘： 理解哪些 CSS 属性会触发重排或重绘，以及如何减少它们（例如使用 transform 和 opacity 来做动画）。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">CSS 文件组织与拆分： 如何模块化地组织 CSS 代码。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">调试能力：熟练使用浏览器开发者工具检查元素、修改样式、调试布局、检查响应式断点。</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“如何实现一个元素的淡入淡出效果？”</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“如何用 CSS 实现一个三角形？”</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“如果让你设计一个可切换的‘日间/夜间模式’，你的思路是什么？”（这里 CSS 变量是加分项）</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“你了解哪些 CSS 优化策略？”</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">“你用过 CSS 预处理器吗？它有什么好处？”</font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);"></font>

<font style="color:rgb(249, 250, 251);background-color:rgb(21, 21, 23);">平时多些一些demo 实现各种布局。</font>

###  




##  
### 




### 
###  
### 
