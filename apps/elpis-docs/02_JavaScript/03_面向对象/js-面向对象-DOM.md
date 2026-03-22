# DOM
- Document Object Model 文档对象模型
- dom对象 的数据结构是一个 tree 


dom中有12中类型



- 创建dom


- dom增

- dom 删

- dom 改

- dom 查

## 创建dom 
```js
const div = document.createElement('div'); // js方式
 
<div id="app">123</div> // h5方式
const div = document.getElementById('app');


const title = document.title // 只有一个title标签 
const body = document.body // 只有一个body标签 
const html = document.documentElement // 只有一个html标签 
const dom2 = document.getElementById('id'); // 传id
const dom3 = document.querySelector('#box1 .hello ')  // 传css选择器
const dom4 = document.querySelectorAll('css选择器名')  // 传css选择器 


```


## dom增 
```js 

dom1.appendChild(dom2) // 挂在父亲内部的最后
dom1.insertBefore(dom2, dom3) // 挂在父亲内部指定元素之前

```

## dom删 
```js 
dom.remove(); // 自己删自己 
dom1.removeAttribute('属性名')   // 删除一个DOM属性
```

## dom改
```js 
dom1.innerText = '修改DOM的内容'
dom1.innerHTML = '<span>修改DOM的内容</span>'
// innerText 和 innerHTML的区别是 innerHTML可以解析标签

dom1.style.属性名 = ''  // 添加行内样式 修改的css少
dom1.className = '类名'  // css里面定义好类名 修改的css多 
DOM.id = '我是DOM的id属性值'
DOM.className = '我是DOM的class属性值' // 本质修改class 

dom1.setAttribute('属性名', '属性值')   // 设置一个DOM属性  行内样式



dom1.insertAdjacentHTML('beforebegin', '<div></div>') // 在本身之前插入dom  兄弟关系
dom1.insertAdjacentHTML('afterbegin', '<div></div>') // 在本身之后插入dom  兄弟关系

dom1.insertAdjacentHTML('beforeend', '<div></div>') // 在内部头部插入  父子关系
dom1.insertAdjacentHTML('afterend', '<div></div>') // 在内部尾部插入  父子关系
```


## dom查
```js 
console.log( dom1.children ) // 返回伪数组
console.log( dom1.children[0] ) // 拿第一个
console.log( dom1.children[dom1.children.length - 1] ) // 拿最后一个
console.log( dom1.children )



dom.parentNode   // 获取父节点 如果是定位脱标就是 父亲就是相对定位的父级
dom.nextSibling   // 获取下一个节点
dom.previousSibling   // 获取上一个节点
dom.previousElementSibling  // 获取上一个兄弟节点
dom.nextElementSibling    // 获取下一个兄弟节点


dom.getAttribute('属性名')   // 获取一个属性值
dom.hasAttribute('属性名')   // 判断一个DOM属性是否存在
DOM.dataset // 获取自定义属性
```

// document.exitFullscreen() // 退出全屏
// document.documentElement.requestFullscreen()  进入全屏



## 节点

```js
<div id="id">我是DOM的内容</div> // 这是一个元素节点
id="id" // 这是一个属性节点 不能说元素节点包含属性节点

我是DOM的内容 // 这是一个文本节点
 

```
```js
// ● 红宝书 第14章 
// ● 红宝书 第15章
// ● 红宝书 第16章
 


节点
元素节点 属性节点 文本节点  注释节点  文档节点  文档片段节点

文本节点: 文字 空格 换行 tab 回车 都是文本节点
注释节点: <!-- 注释内容 -->

属性节点和文本节点是独立的节点 不属于元素节点
元素节点有子节点，其他节点没有子节点


<div id="id">我是DOM的内容</div> // 这是一个元素节点
// id是一个属性节点

 
nodeType:1;  //1 表示元素节点
nodeType:2;  //2 表示属性节点
nodeType:3;  //3 表示文本节点


// 自定义属性: 为了把数据保存在页面中，而不用保存到数据库中。
// 自定义属性 是规范 data- 开头 但是也可以不遵守规范

// 节点描述数据
<div data-index = '2' data-list-name = '小明'></div>
// js对象描述数据
const div = {
  dataset:{
    index:2,
    listName:'小明'
  }
}
DOM.getAttribute('data-index')
DOM.setAttribute('data-index', 2)
 


 
DOM对象
 
 
 
 

 window.getComputedStyle(DOM).width   // width用驼峰


const DOM = {
  id:'我是DOM的属性值',
  className:'我是DOM的class属性值 就是类名class',
  innerHTML:'我是DOM的内容', // 标签体所有内容 包括子标签
  innerText:'我是DOM的内容', // 仅指 文本的读写
  textContent:'我是DOM的内容',  

  value: '我是DOM的value属性值', // input textarea select
  href: '我是DOM的href属性值', // a
  src: '我是DOM的src属性值', // img
  alt: '我是DOM的alt属性值', // img
  title: '我是DOM的title属性值', // img a
  placeholder: '我是DOM的placeholder属性值', // input textarea
  type: '我是DOM的type属性值', // input
  checked: '我是DOM的checked属性值', // input checkbox radio
  selected: '我是DOM的selected属性值', // option
  disabled: '我是DOM的disabled属性值', // input button select option
  readonly: '我是DOM的readonly属性值', // input textarea
  multiple: '我是DOM的multiple属性值', // select
  name: '我是DOM的name属性值', // input textarea select
  action: '我是DOM的action属性值', // form
  method: '我是DOM的method属性值', // form
  enctype: '我是DOM的enctype属性值', // form
  target: '我是DOM的target属性值', // form 

  // 本质就是行内样式style 可读写
  style:{
    width:'100px',
    height:'100px',
    backgroundColor:'red',  
    cssText: 'width:100px;height:100px;background-color:red'
  },
  // offset 是只读 style 是可读写
  // offset 是没有单位的数字型 style 是带单位的字符串型
  // offset 是包含内容内边距和边框的 style 是不包含内容内边距和边框的
  // offset 可以得到任意样式表(行内 内链 外链)的样式值 style 只能得到行内样式的样式值
  // 获取用 offset 修改用 style



  // offset反映的是 DOM在 最近的定位的父元素（offsetParent）内部 上下左右的偏移量
  offsetTop: 100, // 只读 没单位 返回DOM 距离 相对定位父元素上方的偏移
  offsetLeft: 100, // 只读 没单位 返回DOM 距离 相对定位父元素左方的偏移
  offsetWidth: 100, // 只读 没单位 返回DOM的宽度  不包括margin    返回该元素 content + padding + border 的高度 (如果该元素存在滚动条 滚动条也算位置)
  offsetHeight: 100, // 只读 没单位 返回DOM的高度 不包括margin      返回该元素 content + padding + border 的高度 (如果该元素存在滚动条 滚动条也算位置)
  offsetParent: DOM, // 只读 返回DOM的 最近的定位的父元素 没有定位就是body 返回body




// (上边框下沿 到 顶部的距离 content + padding 的尺寸)
  scrollTop: 100, // 只读 没单位 返回DOM被卷去的上侧距离 
  scrollLeft: 100, // 只读 没单位 返回DOM被卷去的左侧距离
  scrollWidth: 100, // 只读 没单位 返回DOM的宽度 不含边框和margin 
  scrollHeight: 100, // 只读 没单位 返回DOM的高度 不含边框和margin


  clientTop: 100, // 只读 没单位 返回DOM的上边框的宽度
  clientLeft: 100, // 只读 没单位 返回DOM的左边框的宽度
  clientWidth: 100, // 只读 没单位 返回DOM的宽度 不含边框和margin
  clientHeight: 100, // 只读 没单位 返回DOM的高度 不含边框和margin



  parentNode: DOM, // 只读 返回DOM的最近父元素 没有定位
  parentElement: DOM, // 只读 返回DOM的最近父元素 没有定位
  childNodes: [DOM, DOM, DOM], // 只读 返回DOM的所有子元素
  children: [DOM, DOM, DOM], // 只读 返回DOM的所有子元素
  firstChild: DOM, // 只读 返回DOM的第一个子元素
  lastChild: DOM, // 只读 返回DOM的最后一个子元素
  previousSibling: DOM, // 只读 返回DOM的上一个兄弟元素
  nextSibling: DOM, // 只读 返回DOM的下一个兄弟元素
  previousElementSibling: DOM, // 只读 返回DOM的上一个兄弟元素
  nextElementSibling: DOM, // 只读 返回DOM的下一个兄弟元素

  
}
DOM.style.backgroundColor = 'blue'  // 可读写

// 获取计算后的样式
window.getComputedStyle(DOM).width   // width用驼峰

window.pageYOffset  // 页面被卷去的上侧距离
window.pageXOffset  // 页面被卷去的左侧距离
window.innerHeight  // 页面可视区域的高度
window.innerWidth  // 页面可视区域的宽度
window.scroll(x, y)  // 页面滚动到指定位置


 
 
 


克隆节点
obj.cloneNode(boolean)
true是深克隆  会克隆内部的子节点
false是浅克隆  不克隆内部的子节点
替换节点
父元素.replaceChild(new,old);
new元素 替换 old元素



 
 
```