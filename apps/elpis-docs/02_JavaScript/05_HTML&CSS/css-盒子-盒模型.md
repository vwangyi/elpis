# 盒模型

- 是什么：盒模型是 内容、内边距、边框、外边距组成的矩形盒子。一共有 2 种模式，标准盒模型和怪异盒模型



## 是什么优缺点讲应用

- 盒模型
  - 是什么
    - 盒模型是一个矩形的盒子，由里到外四个部分组成，内容、内边距、边框、外边距。
    - 盒模型一共分为两种，标准盒模型和怪异盒模型
  - 优缺点
    - 标准盒模型中 css设置的 width height 就是内容的宽高
    - 怪异盒模型中 css设置的width height 是包含 边框 内边距的
  - 应用
    - 所以项目中常常使用 怪异盒模型，用 box- sizing：border-box；开启





## 盒模型属性

````css
内容（width height) 内边距（padding）边框（border）外边距（margin）
.box {
    width: 100px;
    max-width: calc(100vw - 200px);
    min-width: 20px;
    height: 100px;
    min-height: 20px;
    max-height: 1000px; 
    padding: 20px 20px 20px 20px;
    border: 1px solid red; /* 边框样式(solid / dashed / dotted) */
    margin: 10px 10px 10px 10px;
    
    box-sizing: content-box; 
    box-sizing: border-box;


  
    /* 内边距 */
    /* 一个数字: 上下左右都为16px */
    padding: 16px;
    /* 两个数字: 上下:16px 左右:32px */
    padding: 16px 32px;
    /* 三个数字: 上:0 左右:32px 下:16px */
    padding: 0 32px 16px;
    /* 四个数字: 上:10px 右:20px 下:30px 左:40px  */
    padding: 10px 20px 30px 40px;
    
    /* 外边距 */
    margin: 16px;
    
    /* 左右居中 */
    margin: 0 auto;
    margin: 100px auto 0px;
}




```css

width 
height 
padding 
border
margin 
box-sizing: border-box;
.box {
    width: calc(100px);
    width: 100px;
    height: 100px;
    min-width: 10px;
    max-width: 100px;
    min-height: 10px;
    max-height: 100px;

    padding
    border
    margin
}
```


.home {
  --test: red; /* 局部变量 */
  width: 100vw; 
  background-color: var(--test);
  height: 100vh;
} 

html {
    /* 定义全局css变量 */
    --shadow: 0 0 10px blue;
}
div {
    /* 使用css变量 */ 
    box-shadow: var(--shadow); 
    width: calc(100% - 200px); /* 可以计算 */
}
````

