# 字体文本



```css
.box { 
    color: red;
    color: rgb(255, 0, 0); /* 0 ~ 255 */
    color: #ff0000; /* 00 ~ ff */
    color: #f00; /* #ff0000 */
    /* 字体大小 */
    font-size: 100px;
    /* 字体粗细 100 ~ 900 lighter light normal bold bolder */
    font-weight: 100;
    /* 字体样式: 倾斜 */
    font-style: italic;
    /* 字体: Arial */
    font-family: Arial;
 
    text-align: center;
    text-align: left;
    text-align: right;

    /* 文字装饰: 下划线 */
    text-decoration: underline;
    /* 文字缩进: 2个字 */
    text-indent: 2em;
    /* 关键字 */
    font-weight: normal; /* 400 */
    font-weight: bold; /* 600 */
    font-weight: lighter;
    font-weight: bolder;

    /* 数值 */
    font-weight: 100; /* Thin */
    font-weight: 200; /* Extra Light */
    font-weight: 300; /* Light */
    font-weight: 400; /* Normal */
    font-weight: 500; /* Medium */
    font-weight: 600; /* Semi Bold */
    font-weight: 700; /* Bold */
    font-weight: 800; /* Extra Bold */
    font-weight: 900; /* Black */

    user-select: none; /* 用户无法选中文字 */ 
        /* 字体大小 */
        font-size: 100px;
        /* 字体粗细 100 ~ 900 lighter light normal bold bolder */
        font-weight: 100;
        /* 字体样式: 倾斜 */
        font-style: italic;
        /* 字体: Arial */
        font-family: Arial;
        
        /* 对齐方式: 居中 */
        text-align: center;
        /* 文字装饰: 下划线 */
        text-decoration: underline;
        /* 文字缩进: 2个字 */
        text-indent: 2em;


        text-align: start; /* 居左 */
        text-align: center; /* 居中 */
        text-align: end; /* 居右 */
        
        line-height: height; /* 行高等于高 常用于 文本垂直方向居中 */
        vertical-align: baseline; /* 垂直方向 按照 基线对其 */
        vertical-align: top;
        vertical-align: middle; 
        vertical-align: bottom;
        vertical-align: sub;
        vertical-align: text-top;
        vertical-align: -1px;
        vertical-align: 0px;
        vertical-align: 1px;

        /* vertical-align 应用场景 图片和文字 需要垂直方向上对其 
        https://blog.csdn.net/m0_61940160/article/details/131918856  */

  white-space: nowrap; /* 文字不换行 */ 
}
```