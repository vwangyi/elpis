标准流布局 

浮动布局

定位布局

flex 布局

grid 布局



单列布局

双列布局

三列布局

圣杯布局

双飞翼布局

瀑布流布局

粘性布局

 

## 居中的方式有哪些
## 
```css
flex居中
定位居中
grid居中
绝对定位 + transform
绝对定位 + margin: 0 auto;


文本 水平居中用 text-align center 
文本 垂直居中用 行高 等于 高  line-height



```



+ flex 居中

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgb(123, 123, 231);
}
.box { 
    width: 500px;
    height: 500px;
    background-color: red;
} 
```

+ 绝对定位 + transform. 居中

```css
.container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: rgb(123, 123, 231);
}
.box {
    position: absolute;
    top: 50%; 
    left: 50%; 
    width: 500px;
    height: 500px;
    transform: translate(-50%, -50%); /* 相对自身的一半 */
    background-color: red;
}
```

+ 绝对定位 + calc 居中

```css
.container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: rgb(123, 123, 231);
}
.box {
    position: absolute;
    top: calc(50% - 250px); /* 减去自身的一半 */
    left: calc(50% - 250px); /* 减去自身的一半 */
    width: 500px;
    height: 500px;
    background-color: red;
}
```

+ grid 居中

```css
.container {
    display: grid;
    place-items: center;     /* 水平和垂直居中 */
    width: 100vw;
    height: 100vh;
    background-color: rgb(123, 123, 231);
}
.box { 
    width: 500px;
    height: 500px;
    background-color: red;
}
```

+ 文本居中

```css
.box { 
    width: 500px;
    height: 500px;
    background-color: red;
    text-align: center; /* 文本水平居中 */
    line-height: 500px; /* 文本垂直居中 行高等于高 */
} 
```



