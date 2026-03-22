# 表单DOM对象


## 创建表单DOM对象

```js

// 红宝书 第19章 


const from = document.createElement('from');
```

```js

/* 创建一个表单 */




dom常见的属性 方法 事件 


表单类： focus disabled  
disabled: 'disabled', // 禁用
checked: 'checked', // 选中
readonly: 'readonly', // 只读
required: 'required', // 必填
value: '123', // 值
placeholder: '请输入内容', // 占位符
maxlength: '', // 可读写 传递一个字符串
minlength: '', // 可读写 传递一个字符串
placeholder: '', // 可读写 传递一个字符串 
required: false, // 可读写  
autofocus: false, // 可读写 传递一个字符串
pattern: '', // 可读写 传递一个字符串
spellcheck: false, // 可读写 传递一个字符串

自定义属性： 


tabindex="1" // 表索引 让非表单元素 也可以拥有聚焦 失焦等事件 
parentElement 父节点  
parentNode: {}, // 只读  父节点
children: [{},{},{}], // 只读  子节点  DOM.children[DOM.children.length - 1] 最后一个 孩子节点
firstElementChild: {}, // 只读  第一个子节点  基本不用
lastElementChild: {}, // 只读  最后一个子节点  基本不用 
previousSibling: {}, // 只读  上一个节点 包括文本节点
previousElementSibling: {}, // 只读  上一个兄弟节点 不包括文本节点
nextSibling: {}, // 只读  下一个节点  包括文本节点
nextElementSibling: {}, // 只读  下一个兄弟节点  不包括文本节点 



// scroll系列
scrollTop: 100, // 只读  当前DOM上边框 下沿 到 可视区域上边框 下沿 的距离
scrollHeight: 100, // 只读  当前DOM的下边框上沿 到 可视区域上边框 下沿 的距离  比scrollTop多了内容的高度
scrollWidth: 100, // 只读  当前DOM的左边框内沿 到 右边框内沿 的距离

// client系列
clientTop: 100, // 只读  返回DOM的上边框的宽度
clientLeft: 100, // 只读  返回DOM的左边框的宽度
clientWidth: 100, // 只读  返回DOM的宽度 包含内边距和滚动条 不含边框
clientHeight: 100, // 只读  返回DOM的高度 包含内边距和滚动条 不含边框

// offset系列
offsetTop: 100, // 只读  返回DOM的上边框外沿 到 相对定位父元素上边框外沿 的距离
offsetLeft: 100, // 只读  返回DOM的左边框外沿 到 相对定位父元素左边框外沿 的距离
offsetWidth: 100, // 只读  返回DOM的宽度 包含内边距和边框 不含滚动条 
offsetHeight: 100, // 只读  返回DOM的高度 包含内边距和边框 不含滚动条



  // 方法
  setAttribute: function (name, value) {
    // 设置属性
    // DOM.setAttribute('style', 'background-color: red; -webkit-transform: rotate(30deg);') // 垃圾写法 不会用
  },
  getAttribute: function (name) {
    // 获取属性
    // DOM.getAttribute('style') // 垃圾写法 不会用
  },
  hasAttribute: function (name) {
    // 判断是否有属性
    // DOM.hasAttribute('style') 返回布尔值
  },
  removeAttribute: function (name) {
    // 删除属性
    // DOM.removeAttribute('style') 
  },
  scrollIntoView: function (arg) {
    // 让DOM 滚动到可视区域
    // DOM.scrollIntoView(true)  
  },
  cloneNode() {
    // 克隆节点
    // true是深克隆  会克隆内部的子节点
    // false是浅克隆  不克隆内部的子节点
  }, 
  replaceChild(newChild, oldChild) {
    // 替换节点
    // 新子节点 替换 旧子节点
  },
  appendChild(child) {
    // 添加子节点    挂在父亲内部的最后
    // DOM.appendChild(child)
  },
  insertBefore(newChild, oldChild) {
    // 添加子节点    挂在父亲内部指定元素之前
    // DOM.insertBefore(newChild, oldChild)
  },
  insertAdjacentHTML(position, text) {
    // 添加子节点    挂在父亲内部指定元素之前
    // DOM.insertAdjacentHTML('beforebegin', '<div>我是DOM对象</div>')

    // 参数1 插入的位置
    // 'beforebegin'  // 本身之前插入  成为哥哥
    // 'afterend'   // 本身之后插入  成为弟弟  
    // 'afterbegin'    // 内部的最前面插入  成为大儿子
    // 'beforeend'     // 内部的最后面插入  成为小儿子 

    // 参数2 html字符串 比如 '<div>我是DOM对象</div>'
  
  },
  remove: () => {}, // 删除节点  DOM.remove() 移除自己 常用
  removeChild: (child)=>{}, // 删除节点 DOM.removeChild(childDOM)  爸爸删儿子 不常用





事件
onclick 
onblur()


表单DOM
表单DOM
`<input type="text" value="我是input框输入的内容">`
const input = {
  type: 'text',
  value: '我是input框输入的内容'
  ......
}
输入框DOM.value 
输入框DOM.value = '修改表单DOM的内容'

`<button></button>`

    // 输入框

    输入框dom.value    // 查询输入框输入的值
    输入框dom.value = ''   // 给输入值赋值
    输入框dom.focus()   /* 自动获取焦点  如果它可以获取焦点的话 */
    输入框dom.blur()   /* 自动失去焦点 */

    // 按钮
    按钮dom.disabled = true    /* 禁用按钮 */
    按钮dom.disabled = false

    // 单复选框
    单复选框dom.checked = true   /* 选中 */
    单复选框dom.checked = false  /* 未选中 */
    单复选框dom.value
    单复选框dom.value = ''


```