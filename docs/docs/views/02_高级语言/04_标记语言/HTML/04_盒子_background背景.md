# 盒子背景 background

## 背景颜色 backgroundColor
```css
.box { 
  background-color: red;
} 
```


## 背景图定位 backgroundPosition
```css
.box { 
  background-position: ; 相对于 background-origin定位
  background-origin: ''; 
} 


```

```css


.box1 {
  /* 背景颜色 */
  background-color: red;
  
  /* 背景图片: url('图片地址') */
  background-image: url('./images/xxx.png');
  /* 尺寸 */
  background-size: 100% 100%;
  /* 重复 */
  background-repeat: no-repeat;
  
  background: url('./images/xxx.png') 100%/100% no-repeat;
  
  /* 渐变色 */
  /* 线性渐变: linear-gradient(方向, 颜色1, 颜色2, ...) */
  background-image: linear-gradient(to right, red, blue, yellow, green)
  /* 径向渐变: radial-gradient(颜色1, 颜色2, ...) */
  background-image: radial-gradient(red, green, blue, ...);
}


.box { 
  width: 100vw;  
  height: 400px;
 
  
  background-color: #f5f5f5; /* 添加背景色作为图片加载前的显示 体验优化 */
  background-image: url('../../assets/home-bg.webp'); 
  background-size: cover;        /* 覆盖整个元素 */
  background-position: center;   /* 居中显示 */
  background-repeat: no-repeat;  /* 不重复 */





  background-size: cover; /* 完全覆盖元素，可能裁剪图片 */
  background-size: contain; /* 完整显示图片，可能留白 */
  background-size: 200px 150px;  /*  自定义尺寸 宽 高 */
  background-size: 100% auto;    /* 宽度100%，高度自适应 */


  background-position: top left;
  background-position: center;
  background-position: bottom right;
  background-position: 20px 50px;  /* x轴 y轴 */
  background-position: 75% 25%;



  background-repeat: no-repeat; /* 不重复 */

  background-repeat: repeat;/* 水平和垂直重复 */
  background-repeat: repeat-x; /* 仅水平重复 */
  background-repeat: repeat-y; /* 仅垂直重复 */
  background-repeat: space;/* 等间距重复 */
  background-repeat: round;/* 拉伸填充 */
}

.multiple-bg {
  background-image: 
    url('@/assets/images/pattern.png'),
    url('@/assets/images/gradient.jpg'),
    url('@/assets/images/overlay.png');
  
  background-position: 
    top left,      /* 第一张图位置 */
    center,        /* 第二张图位置 */
    center;        /* 第三张图位置 */
  
  background-repeat: 
    repeat,        /* 第一张图重复 */
    no-repeat,     /* 第二张图不重复 */
    no-repeat;     /* 第三张图不重复 */
  
  background-size: 
    auto,          /* 第一张图原始尺寸 */
    cover,         /* 第二张图覆盖 */
    contain;       /* 第三张图包含 */
}


/* 背景色 + 背景图 */
.with-color {
  background: 
    linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
    url('@/assets/images/hero.jpg') center/cover;
}

/* CSS渐变背景 */
.gradient-bg {
  background: 
    linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}

/* 渐变叠加图片 */
.gradient-overlay {
  background: 
    linear-gradient(to bottom, transparent 0%, #000 100%),
    url('@/assets/images/content.jpg') center/cover;
}


 /* 背景颜色与渐变 */

 /* 背景色 + 背景图 */
.with-color {
  background: 
    linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
    url('@/assets/images/hero.jpg') center/cover;
}

/* CSS渐变背景 */
.gradient-bg {
  background: 
    linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}

/* 渐变叠加图片 */
.gradient-overlay {
  background: 
    linear-gradient(to bottom, transparent 0%, #000 100%),
    url('@/assets/images/content.jpg') center/cover;
}

/* 随内容滚动（默认） */
.scroll {
  background-attachment: scroll;
}

/* 固定背景，内容滚动 */
.fixed {
  background-attachment: fixed;
}

/* 随元素内容滚动 */
.local {
  background-attachment: local;
}

.hero-section {
  background: 
    linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%),
    url('@/assets/images/hero-bg.jpg') center/cover no-repeat;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card {
  background: 
    url('@/assets/images/card-pattern.svg') top right/100px no-repeat,
    #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}


.responsive-bg {
  /* 移动端背景 */
  background: url('@/assets/images/bg-mobile.jpg') center/cover no-repeat;
  height: 300px;
}

@media (min-width: 768px) {
  .responsive-bg {
    /* 平板端背景 */
    background: url('@/assets/images/bg-tablet.jpg') center/cover no-repeat;
    height: 400px;
  }
}

@media (min-width: 1024px) {
  .responsive-bg {
    /* 桌面端背景 */
    background: url('@/assets/images/bg-desktop.jpg') center/cover no-repeat;
    height: 500px;
  }
}



 
 

## 阴影 3

```css
.box {
  width: 100px;
  height: 100px;
  /* x y z(投影距离) 颜色 */
  box-shadow: 1px 2px 3px pink;
  
  /* 内阴影 */
  box-shadow: inset 1px 2px 3px pink;
  
  /* 多阴影 */
  box-shadow: 
    1px 2px 3px red,
    1px 2px 10px green,
    1px 2px 30px blue,
    inset 1px 2px 3px pink;
}
```
## 文字阴影 1

```css
.text {
  text-shadow: 1px 2px 3px red;
  
  /* 多阴影 */
  text-shadow: 
    1px 2px 3px red,
    1px 2px 10px green,
    1px 2px 30px blue;
  
}
```


  /* 背景颜色 */
  background-color: red;
  
  /* 背景图片: url('图片地址') */
  background-image: url('./images/xxx.png');
  /* 尺寸 */
  background-size: 100% 100%;
  /* 重复 */
  background-repeat: no-repeat;
  
  background: url('./images/xxx.png') 100%/100% no-repeat;
  
  /* 渐变色 */
  /* 线性渐变: linear-gradient(方向, 颜色1, 颜色2, ...) */
  background-image: linear-gradient(to right, red, blue, yellow, green, ...);
  /* 径向渐变: radial-gradient(颜色1, 颜色2, ...) */
  background-image: radial-gradient(red, green, blue, ...);
````

