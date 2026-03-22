# 定位布局

position 有哪些值，作用分别是什么?

常见的取值有以下几种：

1. static 默认值，元素按照正常文档流的方式进行排列，不会受到top、bottom、left、right等属性的影响。
2. relative 元素相对于其正常位置进行定位，不会影响其他元素的位置。可以通过top、bottom、left、right属性来指定元素的偏移量。
3. absolute 元素相对于其最近的已定位祖先元素（position值不为static的元素）进行定位，没有已定位祖先元素则相对于文档进行定位。可以通过top、bottom、left、right属性来指定元素的偏移量。
4. fixed 元素相对于视口进行定位，即无论页面滚动与否，元素始终在同一位置。可以通过top、bottom、left、right属性来指定元素的偏移量。
5. sticky 元素根据用户的滚动位置进行定位，当元素滚动到某个阈值时，元素将变为fixed定位，例如position: sticky; top: 0;会使元素在离开视口前固定在顶部。 

- relative（相对定位)

- 保留原位置
- 根据自身原来位置移动

- absolute（绝对定位）

- 子绝父相
- 不保留原来位置
- 根据父级(有定位的父级)来移动(没有父级根据浏览器)

- fixed（固定定位)

- 不保留原来位置
- 以浏览器为可视窗口移动(和父元素无关)
- 不随滚动条滚动而滚动

- sticky(粘性定位)

- 以浏览器为可视窗口移动
- 占有原先位置
- 必须有一个属性(top等)

- inherit定位

- 这种方式规定该元素继承父元素的position属性值。

相对定位是 相对于自身做偏移 绝对定位是 相对于最近的父元素做偏移

```css

/* 子绝父相  子绝父绝 */
/* 盒子发生层叠 只能用定位布局 */

.box {
    position: relative;
}

.sub-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

盒子叠加只能用定位 叠加就有层级 所以只有定位才有 z-index属性
.box {
    position: static;     /* 静态定位 默认 */
    position: relative;   /* 相对定位 相对于自己的原位置进行偏移 */
    position: absolute;   /* 绝对定位 相对于已经定位的最近的父元素进行偏移 */
    position: fixed;      /* 固定定位 相对于浏览器可视区定位 (应用场景: 底部按钮 永远出现在可视区底部) */
    position: sticky;     /* 粘性定位 */

    /* 只有position不为默认值static 下面属性才生效 */
    top: 20px;    /* 距离上边20px */
    bottom: 20px; /* 距离下边20px */
    right: 20px;  /* 距离右边20px */
    left: 20px;   /* 距离左边20px */

  /* z-index 数值越大越靠上 */
    z-index: auto; /* 默认值 */
    z-index: -1; 
    z-index: 0;   
    z-index: 1;
    /* 注意 定位是 position 和 边偏移 两类属性 共同作用于一个盒子上 实现的定位 */

    /* 一般使用 子绝父相 也可能子绝父绝 */
    /* 定位盒子 同时给 left 和 right  相当于给宽度 就不用给width了 */

    /*
        相对定位  
        绝对定位 相对于已经定位的最近的父元素进行偏移  (没有定位的父元素就以浏览器可视区进行偏移 注意不是html 也不是body)
        固定定位 
        粘性定位 相对于浏览器可视区定位 (必须添加边偏移) 
    
    */

    /* 定位应用场景：盒子前后叠压只能用定位 叠压就有层级 所以只有定位才有 z-index属性 */

    /* 
        定位脱标：

        > 只有 绝对定位 和 固定定位 才有定位脱标
        > 浮动脱标 可以用 清除浮动来清除浮动带来的影响
        > 定位脱标 是没有解决方法的

    */

    /* 
        定位特性：
        > 所有脱标的盒子可以直接给大小    相当于转为 行内块  但不是行内块
        > 行内元素 如果定位脱标之后 可以直接给大小
        > 块级元素 如果定位脱标之后 默认大小就是内容大小
        
    */

    /**
    定位脱标和浮动脱标区别
        > 浮动脱标：只会压住下面的标准流盒子的一部分 盒子内的内容（文字图片等）不会被压住
        > 浮动脱标之所以压不住文字图片 是因为浮动最初产生就是为了做文字环绕效果的
        > 定位脱标：会压住下面的标准流盒子的所有内容
        >
        > 只要是脱标 就会失去原位置 就有可能影响别人
        >
        > 浮动脱标和定位脱标 不能一起使用
        > 定位脱标会干掉浮动脱标 定位会强一点
        > 浮动可以和相对定位一起用 因为相对定位不脱标 占原位置
        >
        > 脱标的盒子没有外边距合并问题 因为脱标了触发了 BFC
    
    */

}

```



````css

    position: relative;
    position: absolute;
    position: fixed;
    position: sticky;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 0;


## 定位布局
position: relative; 相对定位
position: absolute; 绝对定位
position: ss; 固定定位
position: s; 粘性定位
top: 0px;
left: 0px;
right: 0px;
bottom: 0px;
z-index: 0;
定位特性：
1. 相对定位 相对原位置偏移
2. 绝对定位相对已经定位的包含块定位
3. 绝对定位和固定定位会脱标

/* 子绝父相  子绝父绝 */
/* 盒子发生层叠 只能用定位布局 */

.box {
    position: relative;
}

.sub-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

## 绝对定位

> 叠放
>
> 脱离文档流
>
> 以最近一层被定位的父元素进行定位

```css
.父元素 {
  /* 把父元素按住 */
  position: relative;
}

.子元素 {
  position: absolute;
  top: 10px;
  left: 20px;
  /* right: 30px; */
  /* bottom: 40px; */
}
```

## 固定定位

> 钉在屏幕上，不随滚动条改变而改变位置的元素
>
> 根据浏览器的边缘进行定位
>
> 脱离文档流

```css
.box {
  position: fixed;
  top: 10px;
  left: 20px;
  /* right: 30px; */
  /* bottom: 40px; */
}
```

## 相对定位

> 把父元素按住
>
> 不脱离文档流
>
> 以自身为标准进行定位

```css
.box {
  position: relative;
  top: 10px;
  left: 20px;
  /* right: 30px; */
  /* bottom: 40px; */
}
```




<style>
  .outer {
    height: 300px;
    width: 400px;
    outline: 1px solid red;
    position: relative;
  }
  .inner {
    height: 100px;
    width: 100px;
    outline: 1px solid blue;
    /* 水平垂直居中 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<div class="outer">
	<div class="inner"></div>
</div>
````

