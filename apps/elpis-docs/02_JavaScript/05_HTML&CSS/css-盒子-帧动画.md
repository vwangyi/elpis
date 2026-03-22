# 帧动画

- 过渡效果的缺点 只能是2个状态 开始和结束 而animation可以添加多个状态


```css
/* 可以自动触发，一直动 */
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  /* 动画名 周期时长 变换方式 是否永久 */
  animation: heihei 5s linear infinite;
}

@keyframe heihei {
  
  0% {
    width: 100px;
    height: 100px;
  }
  
  50% {
    width: 200px;
    height: 200px;
  }
  
  100% {
    width: 100px;
    height: 100px;
  }
  
}



.box { 
    /* 应用场景: 改变 块级元素的几何状态 (形状 位置)  对行内元素无效 */

    /* 变形： 元素的 平移 旋转 缩放 倾斜等操作    元素中心点 改变 */
    
    /* transform: translate(x轴, y轴);    单位有 px %   百分比相对自身 */ 
    transform: translate(50%, -50%);  /* x轴 y轴 */
    transform: translateX(50%, -50%);  /* x轴 y轴 */
    transform: translateY(50%, -50%);  /* x轴 y轴 */
    transform: translateZ(50%, -50%);  /* x轴 y轴 */
    transform: translate3d(x, y, z);  /* x轴 y轴 z轴 */


    /* 旋转 注意：旋转会改变x轴y轴方向 */
    transform: rotate(45deg); /* 默认z轴 */
    transform: rotateX(45deg);
    transform: rotateY(45deg);
    transform: rotateZ(45deg);

    /* scale 缩放 */
    transform: scale(1.5)  /* 参数表示倍数 小于1是缩小 大于1是增大 */
    transform: scaleX(.8) rotate(45deg) ;


    /* skew 倾斜   */
    transform: skew(30deg) ;

    /* 改变元素中心点 */
    transform-origin: left top; 

    
    /* 合并写法 注意 旋转会改变 x轴y轴方向  */
    transform: rotate(45deg) translateX(200px);
    /* 复合多次使用 */
    transform: rotate(45deg) translateX(200px) rotate(30deg);




}



    /* 过渡动画 需要用户鼠标配合 :hover :active主动触发  用户主动触发一次 动一次  */
    /*  谁做过渡 给谁加 transition: xxxx; */

/**
`transition: 属性名|all 持续时间 速率 延迟时间, 属性名|all 持续时间 速率 延迟时间`
`速率取值: linear steps(60) ease ease-in ease-in-out `

*/
.box {
    width: 100px;
    height: 100px;
    background-color: red;
    transition: width 1s linear 1s, height 1s linear 1s;
}
.box:hover {
    width: 200px;
    height: 200px;
}


/*  animation 动画 */ 
/* 不需要用户主动触发  可以自动触发 无限次动*/
/*  `animation: 关键帧名 持续时间 速率 次数(infinite|正整数)` */
.box {
    width: 100px;
    height: 100px;
    background-color: red;
    /* 使用动画 */
    animation: mymove 5s infinite;
}

/* 定义动画 */
@keyframes mymove { 
  /* 动画序列 */
  0% {
    width: 100px;
    height: 100px;
  }
  50% {
    width: 200px;
    height: 200px;  
  }
  100% {
    width: 100px;
    height: 100px;
  }
}


/* 3D动画 */
.box {
    /* 透视 产生近大远小的视觉假象 对所有后代子元素都有效 */
    perspective: 1000px; 
    /* 视角位置 就是从哪个角度观看  */
    perspective-origin: x轴 y轴 z轴;    
    
    

    /* 开启3D 写给父级 影响的是儿子  对孙子没用*/
    transform-style: preserve-3d; /* 3D动画 */ 
    transform-style: flat; /* 2D动画 */
}


/* 先定义关键帧 */
@keyframes move {
	 0% {}
	 25% {}
	 50% {}
	 75% {}
	 100% {}
}
.css {
	/* 
		速度曲线： setps(4)
		延迟时间： 可以为负 跳过部分动画
		播放次数：正整数 或 infinite  
	  播放方向：reverse反向  alternate交替
	  执行完毕状态：forwards停到最后一帧  backwards回到第一帧
	*/
	 animation: 关键帧名 持续时间 速度曲线 延迟时间 播放次数 播放方向 完毕状态;
	 animation: move 3s;
}
.xxx:hover {
	 animation-play-state: paused; /* 可以暂停animation帧动画 */
}

/* 基本不用 可以用 0%和100%代替 */
@keyframes move1 {
	 form {}
	 to {}
}
```