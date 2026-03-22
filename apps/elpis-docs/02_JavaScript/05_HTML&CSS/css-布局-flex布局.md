# flex布局	



```css
 /* flex 是一维布局，只能一行一行布局 */
.box {

    display: flex; /* 子盒子是 块盒 */
    display: inline-flex; /* 子盒子是 行内块盒 */ 

    /* 设置主轴 */
    flex-direction: row;    
    flex-direction: row-reverse;  
    flex-direction: column;  
    flex-direction: column-reverse;  


    flex-wrap: nowrap;    /* 子盒子不换行 默认 */
    flex-wrap: wrap;      /* 子盒子换行 */
    flex-wrap: wrap-reverse;      /* 子盒子换行 倒过来 */
 
    flex-flow: row nowrap; /* 主轴direction 和换行wrap 的简写形式  */
  
    justify-content: flex-start; /* 居左 */
    justify-content: center;     /* 居中 */
    justify-content: flex-end;   /* 居右 */
    justify-content: space-between; /* 两端对齐(镜像) */
    justify-content: space-around;  /* 每个子盒子左右两边间隔相等 */

    /* 侧轴: 与主轴 垂直的 就是侧轴 */
    align-items: center; /* 侧轴对齐方式 从上到下 */
    align-items: flex-start; /* 侧轴对齐方式 从上到下 */
    align-items: flex-end;   /* 侧轴对齐方式 从下到上 */
    align-items: baseline;   /* 侧轴对齐方式 （基线对齐） */
    align-items: stretch;    /* 侧轴对齐方式 伸展 */
}
.sub-box {
    flex-grow: 0;
    flex-shrink: 1; 
    flex-basis: auto; 
    flex: 1;

    order: 0;   /* 设置子盒子 排列顺序 由小到大排列 */
    /* align-self 和 align-items 取值一样  align-self只针对子盒子自己 */ 
    align-self: center;  

    /* 如果给 1 表示 剩余空间为正的情况下 所有子盒子每人占1份去瓜分剩余空间 */
    flex-grow: 0; 
    /* 如果给 1 表示 剩余空间为负的情况下 所有子盒子每人都减少1份空间 */
    flex-shrink: 1; 
    /* grow和shrink 都是为了让 子盒子总宽度 和 父盒子宽度相等 */

    /* flex-basis的默认值是 auto */ 
    /* auto表示为子盒子的width，width是多少 子盒子的基础宽度就是多少 */
    flex-basis: auto; 

    /* 
      同时设置 grow shrink 增和减 并不会矛盾 因为实际情况只有一种 
      要么剩余空间为正 要么剩余空间为负 
      也就是 子盒子总宽度 要么 大于 父盒子宽度 或者小于父盒子宽度 
     */ 
    /* flex 是一个简写属性 分别是 flex-grow flex-shrink flex-basis  */
    flex: flex-grow flex-shrink flex-basis;
    flex: 增加 减少 基础;
    flex: 1;  

    flex: 1 1 100%; /* 某个子盒子 独占一行 */


    /*
      我们有时候会遇到 flex:1;不生效 那是因为 剩余空间为负 也就是子盒子总宽度 大于 父盒子的宽度 flex:1;本质是flex-grow:1; 
      剩余空间为正 flex-grow 生效  另一个不生效
      剩余空间为负 flex-shrink 生效 另一个不生效
  
      解决方法 1 使用flex-shrink
      解决方法 2 把width或者flex-basis给一个小一点的值 使得剩余空间为正
      解决方法 3 使用overflow: hidden; 把撑大超出的部分处理掉 触发bfc 
    */ 
  
  
    /* 预定义值  知道这个东西就行 反正不用 */
    flex: initial;  /* 表示  0 1 auto */
    flex: auto;     /* 表示  1 1 auto */
    flex: none;     /* 表示  0 0 auto */
    flex: 1;        /* 表示  1 1 0 */
    flex: 2;        /* 表示  2 1 0 */
}
```





```css
display: flex;
display: inline-flex;
flex-direction: row;
flex-direction: column;
flex-wrap: wrap;
flex-wrap: nowrap;
flex-grow: row wrap;

justify-content: center;
justify-content: flex-start;
justify-content: flex-end; 
justify-content: space-between; /* 镜像 */
justify-content: space-around;

align-items: center;

/* 写在子盒子的属性 */
flex: 1;
order: 1; 

align-self: center; /* 只针对子盒子自己 */



 /* flex 是一维布局，只能一行一行布局 */


/*
  1. 开启flex盒子 用 dispaly: flex; display: inline-flex; 表示子盒子是行盒 还是行内块盒子
  2. 设置主轴侧轴 包括子盒子是否可以换行   flex-direction
  3. 主轴排列方式
  4. 侧轴排列方式

 */
.box {

    display: flex; /* 子盒子是 块盒 */
    display: inline-flex; /* 子盒子是 行内块盒 */ 

    /* 设置主轴 */
    flex-direction: row;    
    flex-direction: row-reverse;  
    flex-direction: column;  
    flex-direction: column-reverse;  
    flex-wrap: nowrap;    /* 子盒子不换行 默认 */
    flex-wrap: wrap;      /* 子盒子换行 */
    flex-wrap: wrap-reverse;      /* 子盒子换行 倒过来 */
    flex-flow: row nowrap; /* 主轴direction 和换行wrap 的简写形式  */
    
    
    
    justify-content: flex-start; /* 主轴对齐方式 从左到右排列 */
    justify-content: flex-end;   /* 主轴对齐方式 从右到左排列 */
    justify-content: center;     /* 主轴对齐方式 居中 */
    justify-content: space-between; /* 主轴对齐方式 两端对齐(镜像) */
    justify-content: space-around;  /* 主轴对齐方式 子盒子左右两边间隔相等 */

    /* 侧轴: 与主轴 垂直的 就是侧轴 */
    align-items: center; /* 侧轴对齐方式 从上到下 */
    align-items: flex-start; /* 侧轴对齐方式 从上到下 */
    align-items: flex-end;   /* 侧轴对齐方式 从下到上 */
    align-items: baseline;   /* 侧轴对齐方式 （基线对齐） */
    align-items: stretch;    /* 侧轴对齐方式 伸展 */


}
.sub-box {
    flex-grow: 0;
    flex-grow: 1; /* 表示 剩余空间为正的情况下 子盒子增加1份 去瓜分剩余空间 */



    flex-shrink: 1; /* 表示 剩余空间为负的情况下 子盒子减少1份 去瓜分剩余空间 */
    /* 
      grow和shrink 都是为了让 子盒子总宽度 和 父盒子宽度相等
      同时设置 grow shrink 增和减 并不会矛盾 因为实际情况只有一种 
      要么剩余空间为正 要么剩余空间为负 
      也就是 子盒子总宽度 要么 大于 父盒子宽度 或者小于父盒子宽度 
    
    */
    flex-basis: auto; /* auto表示为子盒子的width，width是多少 子盒子的基础宽度就是多少 */
    flex: flex-grow flex-shrink flex-basis; 
    flex: 1;        /* 表示  1 1 0 */
    flex: 2;        /* 表示  2 1 0 */

    order: 0;   /* 设置子盒子 排列顺序 由小到大排列 */
    /* align-self 和 align-items 取值一样  align-self只针对子盒子自己 */ 
    align-self: center;  

 
 

    flex: 1 1 100%; /* 某个子盒子 独占一行 */


    /*
      我们有时候会遇到 flex:1;不生效 那是因为 剩余空间为负 也就是子盒子总宽度 大于 父盒子的宽度 flex:1;本质是flex-grow:1; 
      剩余空间为正 flex-grow 生效  另一个不生效
      剩余空间为负 flex-shrink 生效 另一个不生效
  
      解决方法 1 使用flex-shrink
      解决方法 2 把width或者flex-basis给一个小一点的值 使得剩余空间为正
      解决方法 3 使用overflow: hidden; 把撑大超出的部分处理掉 触发bfc 
    */ 
  
  
    /* 预定义值  知道这个东西就行 反正不用 */
    flex: initial;  /* 表示  0 1 auto */
    flex: auto;     /* 表示  1 1 auto */
    flex: none;     /* 表示  0 0 auto */
}

```

## flex 弹性布局



## flex: 1 表示什么

flex:1；不生效 是因为 剩余空间为负 可以把子盒子 width 设置为 1。 因为 flex-basis 默认值是 width 的值

**flex:1** 表示子元素的伸缩比例为 1，即子元素可以根据剩余空间进行分配，并且在分配时所有子元素的扩展比例相同。这意味着所有子元素都会平均分配容器的剩余空间，从而实现弹性布局。

- flex: 1

- 是什么

- flex :1 是三个属性的简写，flex-grow flex-shrink flex-basis
- flex-grow 表示当前子盒子增加几份  前提条件是有剩余空间才会生效
- flex-shrink 表示 当前子盒子缩小几份 前提条件是 剩余空间为负才会生效 
- flex-basis 表示 分配之前的初始大小 ，auto 就相当于 width

 **flex:1** 等价于以下三个 CSS 属性：

```css
flex-grow: 1;
flex-shrink: 1;
flex-basis: 0;
```

这三个属性的含义如下：

- `flex-grow`：用于设置弹性盒子容器的子元素在空间分配时的扩展比例，默认值为 0，即不会分配剩余空间；
- `flex-shrink`：用于设置弹性盒子容器的子元素在空间不足时的收缩比例，默认值为 1，即缩小的比例与容器空间不足的空间大小成正比；
- `flex-basis`：用于设置弹性盒子容器的子元素在分配多余空间前的初始大小，默认值为 auto，即由子元素的内容决定。 



在使用 `flex:1` 时，需要注意以下几点：

1. 如果容器中只有一个子元素，那么 `flex:1` 将不起作用，因为该子元素不需要进行伸缩。
2. 如果容器中的多个子元素都设置了 `flex:1`，那么它们将平均分配剩余空间，从而实现等宽布局。
3. 如果容器中的多个子元素设置了不同的 flex 值，那么它们将按照所设置的比例分配剩余空间。 通过使用 `flex:1`，可以轻松实现弹性布局，从而适应不同设备和屏幕大小的需求。