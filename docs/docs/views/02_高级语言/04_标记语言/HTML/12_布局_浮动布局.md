



```js

    float: left;
    float: right;
    float: none;


## 浮动布局
float: left; 左浮动
float: right; 右浮动
float: none; 不浮动
浮动特性
1. 浮动元素会脱离标准流
2. 浮动元素会浮起来 脱离标准流 向顶部和左部靠齐
3. 浮动元素 具有行级块元素的特性
4. 浮动元素 会丢失原位置
5. 行满会换行 但和 inline不一样 ，如果左侧元素有存在和右边的宽度足够 哪怕只有1px 也会卡住 而不是重新另起一行

```



```js

/* 浮动最初诞生是 做图文环绕  后来用于布局  现在基本不用 */
.box {
  float: left;  /* 左浮动 */
  float: right;  /* 右浮动 */ 
}

/**
    浮动应用场景:浮动最初诞生是 做图文环绕  后来用于布局
    浮动特性: 
        1 从左至右 左边和顶部 紧贴 左边哪怕只有1px 也会紧贴 卡住
        2 浮动元素 会产生浮动脱标 会失去原位置   目的： 让元素横着排列
        3 浮动元素 拥有行内块特点 但不是行内块 所以浮动元素不需要转换类型
        4 浮动元素 不会影响前面的标准流 只会影响后面的标准流
        5 浮动元素 会压住后面的标准流盒子 但不会压住内容 (因为内容为王 浏览器就是显示内容的)清除浮动

    浮动脱标: 只要是浮动就一定会导致浮动脱标
    清除浮动: 清除浮动就是清除浮动带来的影响
        清除浮动应用场景：
    父元素没有自己的高度 父元素的高度由子元素撑开的
    这时 子元素开启浮动 变为浮动元素 脱离标准流 父元素就丢失了高度
    此时 父元素需要清除浮动（清除浮动带来的影响）

    清除浮动的4种方式：
        1 父盒子开启 BFC ：
        2 父盒子 添加 after伪元素
        3 父元素 添加双伪元素
        4 父盒子内部最后一个位置添加块级标签 应用clear: both; (注意是块级)

        清除浮动方式1： 父盒子开启 BFC ： 
        .father {
        overflow: hidden;  缺点 父盒子溢出内容会隐藏  
        } 

        清除浮动方式2： 父盒子 添加 after伪元素 
        .father::after {
            content: '';
            display: block;  
            clear: both;   
            height: 0;     
            visibility: hidden;  
        }  
        清除浮动方式3：  父元素 添加双伪元素  
        .father::before, .father::after {
            content: '';
            display: table;
        }
        清除浮动方式4：父盒子内部最后一个位置添加块级标签 应用clear: both; (注意是块级) 
        .father .last {
        clear: both;    缺点：会多一个无意义标签  
        } 
 

 */

```






## demo
```html
<!-- 
    直接运行效果然后写 写不出来才看代码
  --> 
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      /*
            考察的是 对 文档流的理解   从左到右 从上到下 一次排列  
             对浮动元素 脱离文档流的理解 
         */
      body {
        margin: 200px;
        background-color: black;
      }
      .group {
        width: 220px;
        float: left;
      }
      .item {
        width: 100px;
        height: 150px;
        margin: 10px 0 0 10px;
        background-color: white;
        float: left;
      }
      .big {
        height: 310px;
      }
    </style>
  </head>
  <body>
    <div class="group">
      <div class="item big"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
    <div class="group">
      <div class="item big"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
    <div class="group">
      <div class="item big"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
  </body>
</html>

```

## demo2

```html
<!-- 
    直接运行效果然后写 写不出来才看代码

    用 浮动 实现   注意和inline-block的区别
  -->

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        background-color: #000;
      }
      .box {
        width: 443px;
        height: 500px;
        /* display: flex; 
        flex-direction: row;
        flex-wrap: wrap; */
        border: 1px solid red;
      }
      .box1,
      .box2,
      .box3,
      .box4,
      .box5,
      .box6 {
        float: left;
        /* display: inline-block; */
        width: 100px;
        height: 500px;
        background-color: #fff;
        border: 1px solid red;
      }
      .box1 {
        height: 190px;
      }
      .box2 {
        height: 120px;
      }
      .box3 {
        height: 30px;
      }
      .box4 {
        height: 119px;
      }
      .box5 {
        height: 30px;
      }
      .box6 {
        height: 30px;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <div class="box1">1</div>
      <div class="box2">2</div>
      <div class="box3">3</div>
      <div class="box4">4</div>
      <div class="box5">5</div>
      <!-- <div class="box6">6</div> -->
    </div>
  </body>
</html>

```