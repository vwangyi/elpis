# 选择器



````css

/* 选中的是 class名有box名字的标签 <div class="box"/> */
.box {}

/* 选中的是  */
.box>.sub-box {}

/* 选中的是  */
.box .sub-box {}

伪类选择器


# CSS伪元素选择器
> ::after相当于元素的内部最后位置加了一个span
> ::before相当于元素的内部最前位置加了一个span

  

# 伪类 5
/* 选中第一个  和 nth-child(1) 等价 */
ul>li:first-child {  }

/* 选中第一个   */
ul>li:nth-child(1) {  }

/* 1 选中ul下的所有li  2 所有li中 选中偶数项 */
ul>li:nth-child(2n) {  }

/* 1 选中ul下的所有li 2 所有li中 倒数第三个盒子 */
ul>li:nth-last-child(3) {  }

## 鼠标悬停/点击 5

```css
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}

.box:hover {
  transform: rotate(45deg);
}

.box:active {
  background-color: blue;
}
```

/* 后代选择器: 用空格隔开  选中的是 a标签   好处是方便隔代插入选择器 */
.nav ul li a { } 


/* 父子选择器: 只会选中ul的儿子li  不会选择孙子 （只会选择最近一代的所有li) */
ul>li { } 

/*  只会选中ul的下一个兄弟li  相邻兄弟  
element的button按钮就用到了 第二个button开始后面兄弟有 margin-left:10px */
ul+li { }  

ul~li { }  /*  只会选中ul的所有兄弟li  全部兄弟*/


.hello,.world {  } /* 并集选择器：多个选择器 用逗号分隔*/

.son#box { } /*交集选择器：既有类又有id 权重是两个选择器的权重相加*/ 
.collect.active {  } /*应用场景： 激活active 比如说收藏图标的状态等*/
// 当鼠标悬停在元素上时应用样式。 
.xx:hover { /* css代码 */ }

// 当元素获得焦点
.xx:focus { /* css代码 */ }

// 当元素被激活时（如按下按钮）应用样式。
button:active { /* css代码 */ }

// 被禁用的表单元素。
input:disabled { /* css代码 */ }

// 复选框或单选框 的选中状态
input[type="checkbox"]:checked { /* css代码 */ }

// 用于表单验证状态。
input:valid { /* css代码 */ }
input:invalid { /* css代码 */ }

// 当输入框显示占位符时
input:placeholder-shown { /* css代码 */ }
/* 伪元素选择器  在盒子内部的最前面插入一个行内元素   权重和标签选择器一样 都是1 */
.box::before { }

/* 伪元素选择器  在盒子内部的最后面插入一个行内元素  权重和标签选择器一样 都是1 */
.box::after { }  



/* 后面的表达式可以写什么 数学不好 只能用chatgpt描述 */
nth-child(n)  

 


.nav ul li a { } /* 后代选择器: 用空格隔开  li的所有后代a 都会被选中 */
ul>li { } /* 父子选择器: 只会选中ul的儿子li  不会选择孙子 （只会选择最近一层的所有li) */

ul+li { }  /*  只会选中ul的下一个兄弟li  相邻兄弟  element的button按钮就用到了 第二个button开始后面兄弟有 margin-left:10px */

ul~li { }  /*  只会选中ul的所有兄弟li  全部兄弟*/


.hello,.world {  } /* 并集选择器：多个选择器 用逗号分隔*/

.son#box { } /*交集选择器：既有类又有id 权重是两个选择器的权重相加*/ 
.collect.active {  } /*应用场景： 激活active 比如说收藏图标的状态等*/

 


/* 伪元素选择器   */


/* 伪元素选择器  在盒子内部的最前面插入一个行内元素   权重和标签选择器一样 都是1 */
.box::before { }

/* 伪元素选择器  在盒子内部的最后面插入一个行内元素  权重和标签选择器一样 都是1 */
.box::after { }  



/* 伪类选择器  */ 
/**
  给选择器加上形容词  注意 加上形容词 仍然是选择器
  冒号左边是主语 冒号右边是形容词
*/ 
 
<div class="child">
  <i>0</i>

  <p>1</p> // 选中了
  <p>2</p> 
</div>  







/* 既是.child后代p又是第2个孩子     那就选中 没有则不会选中 */
.child p:nth-child(2) { } 



/* 既是.child的儿子又是第2个孩子  *可以不写    那就选中 没有则不会选中 */ 
.child>*:nth-child(2) { }  



.child :nth-child(2) { }  /* 既是.child后代又是第2个孩子            那就选中 没有则不会选中 */




.child p:nth-of-type(2) { } /* 既是.child后代p又是 每种类型的第2个孩子          那就选中 没有则不会选中 */
.child>*:nth-of-type(2) { }  /* 既是.child的儿子又是 每种类型的第2个孩子          那就选中 没有则不会选中 */
.child :nth-of-type(2) { }  /* 既是.child后代又是 每种类型的第2个孩子         那就选中 没有则不会选中 */


.child div:nth-of-type(2)>p  { } /* 选择器就是 从模糊到精确的过程 */


/*  
    nth-child和nth-of-type的区别

    nth-child(2) 表示第2个孩子 
    nth-of-type(2) 表示每种类型的第2个孩子

    first-child 相当于 nth-child(1) 第1个孩子
    last-child  相当于  最后1个孩子
    nth-last-child(2) 倒数第2个孩子

    even	 偶数
    odd 	 奇数
    n  		 自然数 0 到 正无穷 （从0开始自增1）
    n+5    第5个及其以后（ 0+5=5 1+5=6 就是从5开始自增）
    -n+5 	 前5个 （-0+5就是 5-0=5 -1+5就是5-1=4  从5开始自减）
    2n		 偶数
    2n+1   奇数
    5n 		 5的倍数
*/


ul:hover li {} /* ul上悬停 选中却是 li */
ul:active li {} /* 同理*/


链接伪类选择器 注意顺序
a:link { }   主语是a 形容词是 link 表示 未访问的a标签
a:visited { }   主语是a 形容词是 visited 表示 已访问过的a标签
a:hover { }   主语是a 形容词是 hover 表示 悬停在a标签上
a:active { }   主语是a 形容词是 active 表示 鼠标左击不弹起 

其他伪类了解:  
a:root {}
a:not() {}
a:target {}
a:empty {}
a:focus {} 

/* 属性选择器 */






/* 权重 ： 每个选择器都有权重优先级 */

/* 
    样式表有4种来源：
    1 浏览器默认样式表
    2 外部样式表 单独的css文件 通过link引入 <link rel="stylesheet" href="../style.css">
    3 内部样式表 写在head标签内部的style标签 <style> </style>

    4 行内样式表 写在标签内部的style属性 <div style="color:red;"></div>

*/

 
!important(无穷大) > 行内样式style (1000) >  id（0100 >类|伪类|属性（0010）> 标签|伪元素(0001) > 通配符* + - ~ (0) > 继承 > 浏览器默认样式

@import url("style.css"); 
样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式表
 
复合选择器权重：权重相加 但不进位 

发生样式冲突 ：给同一个元素 设置同一个属性 

发生样式冲突 权重相同 后面的覆盖前面的    

发生样式冲突 权重不同 由权重大的决定  权重可叠加 但不可进位     这就是优先级 

不发生样式冲突 样式可以叠加在一个元素上   这就是层叠性

行高 文本 字体 字号 颜色 行距 字体大小 可继承给后代   这就是 继承性


发生样式不生效的情况：

1 检查选择器是否选中了元素
2 检查选择器的权重优先级
3 有可能是子盒子的样式覆盖了父盒子的样式
````

