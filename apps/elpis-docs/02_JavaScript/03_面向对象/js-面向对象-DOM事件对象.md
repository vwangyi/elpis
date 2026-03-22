```js


/* 绑定事件和解绑事件的方式 */
const dom = document.getElementById('div');

// 方式1 绑定事件
dom.addEventListener('click', function (e){

})

// 方式2绑定事件 一般不用
dom.onclick = function(e) {

}  
// 缺点1. 不能设置捕获
// 缺点2. 不能添加多个相同种类的事件 

/**
 * 给dom移除事件监听
 * @param {string} type 事件类型 click等
 * @param {function} listener 需要移除的事件函数名
 */
dom.removeEventListener('load', fn);

 





document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    console.log('页面不可见，暂停操作');  // 浏览器tab切换到后台时触发
    // 暂停数据处理或动画等操作
  } else {
    console.log('页面可见，继续操作');
    // 恢复数据处理或动画等操作
  }
});



// 红宝书 第17章


// event是交互事件得到的 事件对象 
// const event = 



表单事件
input 输入框输入中 触发
focus 输入框获取焦点 触发
blur 输入框失去焦点 触发
change 输入框失去焦点 触发（按下回车也会失焦）
鼠标事件
click 鼠标左键单击DOM 触发
dblclick 鼠标左键双击DOM 触发
contextmenu 鼠标右键单击DOM 触发

mousedown 鼠标按键按下 触发
mouseup 鼠标按键抬起 触发
mouseout 

mouseenter(不冒泡)  mouseover(冒泡) 鼠标移入DOM 触发
mouseleave 鼠标移出DOM 触发
mousemove 鼠标在DOM中移动 触发
mouseover （mouseover和mouseenter的区别）

mouseenter mouseover 区别
1触发条件不同  
mouseover 进入dom 或 其子dom 都会触发
mouseenter 进入dom 触发 进入其子dom 没有影响
2 冒泡
mouseover 有冒泡行为 也就是上面说的 进入其子dom 会触发父亲的mouseover事件
mouseenter 没有冒泡

简单来说 mouseenter和mouseover的区别只有一个 就是 mouseover会冒泡 mouseenter不会冒泡

键盘事件
keydown 用户按下键盘 触发
keyup 键盘抬起 触发
window窗口事件
resize 窗口window 尺寸大小变化 触发
scroll 窗口window 内容滚动 触发
whell 窗口window 鼠标滚轮滚动 触发
手指事件
touchstart 手指开始滑动 触发
touchmove 手指滑动 触发
touchend 手机结束滑动 触发




event 事件对象
e.key // 获取用户按下的键
e.keyCode // 获取用户按下的键的code码
e.xxx // 阻止默认行为
e.xxx // 阻止事件流 
e.target // 事件目标 
e.stopPropagation() // 阻止事件冒泡
e.preventDefault() // 阻止默认行为 

vue中阻止事件冒泡  可以不用赋值一个函数 也行 @click.stop.prevent 同时阻止冒泡和默认行为
<div @click.stop > </div>


案例
<div draggable="true"></div>  // 传一个字符串的true 实现dom可拖拽

放置的dom
@dragover=" e => e.preventDefault() "
@drop 放置会调用


拖拽通信 
拖拽方 传数据 给 放置方 
拖拽方的 mousedown事件  放置时会调用 就可以传参









event 事件对象
event事件对象 通过事件函数得到的
// 事件对象
const e = {
  type: 'click', // 事件类型
  target: DOM, // 触发事件的DOM
  currentTarget: DOM, // 绑定事件的DOM
  preventDefault: function () {}, // 阻止默认行为
  stopPropagation: function () {}, // 阻止冒泡
  stopImmediatePropagation: function () {}, // 阻止冒泡和阻止默认行为
  clientX: 100, // 鼠标相对于可视区域的x坐标 可用于 定位的left top 或 translate的xy
  clientY: 100, // 鼠标相对于可视区域的y坐标
  pageX: 100, // 鼠标相对于页面左上角的x坐标 包括滚动条
  pageY: 100, // 鼠标相对于页面左上角的y坐标 包括滚动条
  offsetX: 100, // 鼠标相对于事件源(dom)左上角的x坐标
  offsetY: 100, // 鼠标相对于事件源(dom)左上角的y坐标
  screenX: 100, // 鼠标相对于屏幕左上角的x坐标
  screenY: 100, // 鼠标相对于屏幕左上角的y坐标


  altKey: true, // alt键是否按下
  ctrlKey: true, // ctrl键是否按下
  shiftKey: true, // shift键是否按下
  metaKey: true, // meta键是否按下
  button: 0, // 鼠标按键 0左键 1中键 2右键
  buttons: 0, // 鼠标按键 0左键 1中键 2右键
  key: 'a', // 键盘按键
  keyCode: 65, // 键盘按键的编码
  which: 65, // 键盘按键的编码
  detail: 1, // 鼠标滚轮滚动的距离
  wheelDelta: 120, // 鼠标滚轮滚动的距离
  delta: 120, // 鼠标滚轮滚动的距离
  deltaMode: 0, // 鼠标滚轮滚动的距离
  relatedTarget: DOM, // 鼠标进入
}


事件 5
// dom对象.addEventListener('事件名', 函数, false)      绑定事件
// dom对象.removeEventListener('移除事件名', 移除函数)   解绑事件
事件类型
鼠标事件
鼠标点击  click
鼠标按下  mousedown
鼠标抬起  mouseup
鼠标悬停  mouseover  有冒泡不常用
鼠标悬出  mouseout   有冒泡不常用

鼠标进入  mouseenter
鼠标离开  mouseleave
鼠标移动  onMouseMove

鼠标右键  contextmenu   需要阻止默认事件
鼠标双击  dblclick     移动端有问题
鼠标拖放事件
// 鼠标拖放元素 （必须要有 draggable属性）
拖拽开始  dragstart
拖拽中    drag
拖拽结束  dragend

// 放置的元素
拖放悬停  dragover   不给它阻止默认事件 就不能执行放置事件
放置      drop
拖放进入  dragenter
拖放离开  dragleave
键盘事件
按下  keydown    e.key | e.keyCode 判断按下哪个键
抬起  keyup
窗口
加载  load
调整大小  resize
滚动条事件 滚轮事件
scroll 滚动条事件  可以给window绑 也可以给dom绑 经常配合 dom.scrollTop | dom.scrollLeft
wheel  滚轮事件   应用场景 滚轮缩放图片
手指事件
滑动开始  touchstart
滑动中    touchmove
滑动结束  touchend
表单元素事件
输入中  input
获取焦点  focus
失去焦点  blur

发生改变  change  (失去焦点或按下回车触发) 表单的点击事件是 change

blur事件
如何指定blur的触发区域
<input type="text" @blur="onBlur"/>

<div class="noBlur">如何实现 点击我 input框不会触发blur事件</div>
取消mousedown的默认事件 可以 取消触发失去焦点事件
我们可以随意控制 input框的失焦事件的触发区域 
对于某些区域 我们不想点击它的时候 触发失去焦点事件
就 对mousedown事件进行阻止默认事件  

<script>
  // 原生中: 
  DOM.addEventListener('mousedown', function(e) {
    e.preventDefault();
  }, false);
</script>
<!-- 
  vue中: 
  <button @mousedown.prevent @click="onOk">确 定</button>
-->



event事件对象 5
// 位置
e.clientX  e.clientY   // 鼠标 距离 客户端(可视区) 左上角的 x, y 坐标  可用于 定位的left top 或 translate的x y
e.offsetX  e.offsetY   // 鼠标 距离 本元素 左上角的 x, y
e.pageX  e.pageY  // 鼠标 距离 页面 左上角的 x, y (包括滚动条)
e.screenX  e.screenY //  鼠标 距离 屏幕 左上角的 x, y


// 触发的dom 事件目标
e.target.value （推荐）
// 组织默认行为
e.preventDefault() （比如a链接的跳转 浏览器右键的菜单）
// to do

鼠标拖拽 5

window.innerHeight  // 一屏 高度
window.innerWidth   // 一屏 宽度

事件类型
鼠标按下  mousedown
鼠标抬起  mouseup
鼠标移动  mousemove

const box = document.querySelector('.box');
let innerX = 0;
let innerY = 0;
function onMouseMove(e) {
    const x = e.clientX - innerX;
    const y = e.clientY - innerY;
    const vh = window.innerHeight; // 800多
    const vw = window.innerWidth;
    const boxH = box.height;
    const boxW = box.width;
    const maxY = vh - boxH;
    const maxX = vw - boxW;
    const realY = getRangeValue(y, [0, maxY]);
    const realX = getRangeValue(x, [0, maxX]);
    box.setAttribute('style', `transform: translate(${ realX }px, ${ realY }px);`);
}
// 鼠标按下
box.addEventListener('mousedown', function (e) {
    e.preventDefault();
    innerX = e.offsetX;
    innerY = e.offsetY;
    document.addEventListener('mousemove', onMouseMove);
});
// 鼠标抬起
box.addEventListener('mouseup', function () {
    document.removeEventListener('mousemove', onMouseMove);
});
function onMouseMove(e) {
  // 移动元素的代码
  // 参考e.clientX / e.clientY
}

el.addEventListener('mousedown', function () {
// 鼠标按下 绑定mousemove事件
document.addEventListener('mousemove', onMouseMove);
});

el.addEventListener('mouseup', function () {
// 鼠标抬起 解绑事件
document.removeEventListener('mousemove', onMouseMove);
});
鼠标拖放(H5) 5
1 draggable="true"  // 设置元素可拖动
2 拖动元素时，会触发dragstart事件
3 



拖拽的那个元素: dragstart 拖拽开始 / drag 拖拽中 / dragend 拖拽结束
放置的那个容器元素: dragenter 拖进 / dragover 拖放悬停 / dragleave 拖出  drop 放置
        const box = document.querySelector('.box');
        const section = document.querySelector('section');

        // 解决无法放置的问题*
        // dragover: 拖拽悬停事件
        section.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        // 放置 绑定drop放置元素 必须阻止dragover拖拽悬停事件的默认行为
        section.addEventListener('drop', function () {
            section.appendChild(box);
        });

事件
事件是给DOM对象加的  属于DOM对象里面的知识
事件操作
给元素注册事件，采取事件源.事件类型=事件处理程序
事件三要素
1.获取事件源(给谁绑定事件 给任何一个DOM或 BOM对象 )
2.绑定事件 (传统绑定 和 添加监听 )
3.添加事件处理程序
4.解绑事件

this 指向的是 事件函数的调用者 
绑定事件
传统绑定方式
<body>
    <button>传统方式</button>
    <script>
        var btn = document.querySelectorAll('button');
        //  传统方式绑定事件 只能绑一个事件 没有兼容性
        btn[0].onclick = function () {
            alert('哈喽');
        }
        btn[0].onclick = function () {
            alert('覆盖了哈喽');
        }
    </script>
</body>
传统绑定方式 (本质是属性方式)  对象.属性 = 匿名函数
事件属性以on开头 同一个对象只能给一个事件  后者覆盖前者
添加监听方式
<body>
    <button>监听方式</button>
    <script>
        var btn = document.querySelectorAll('button');
        // 事件监听绑定事件 可以绑定多个事件  ie9 以上才支持
        btn[1].addEventListener('click', function () { 
            alert("可以执行");
        })
        btn[1].addEventListener('click', function () {
            alert("继续可以执行");
        })
    </script>
</body>
添加监听方式 (本质是方法方式)   
对象.方法('类型'，函数，bool)  ie9+ 支持
 btn[1].addEventListener()
类型是字符串 加引号 开头没有on
true 表示
false 表示

函数 可以是 匿名函数、函数名、字符串的 '函数名()'
bool 默认false 表示冒泡阶段   true 表示捕获阶段
同一个对象 可以绑定多个监听  按绑定顺序执行

ie9 之前用这个方法attachEvent()代替

解绑事件
传统绑定方式解绑
传统事件解绑
传统方式 解绑      对象.属性 = null；    btn.onclick = null;
添加监听方式解绑
● 如果考虑到需要解绑  在绑定时就不能用匿名函数  建议用 函数名
btn[0].addEventListener('click',fn); //注意这里函数不加小括号
function fn(){
    alert(22);
    btn[0].removeEventListener('click',fn); //解绑
}
btn[1].attachEvent('onclick',fn1);  //ie9之前 绑定
function fn1(){
    alert(22);
    btn[1].datechEvent('onclick',fn1); //ie9之前用法解绑
}
封装绑定的兼容性函数
// 为绑定事件封装兼容性函数

function addEventListener(element,eventName,fn){
     //先判断IE9+的addEventListener
    if(element.addEventListener){
        element.addEventListener(eventName,fn);
        //在判断ie9以前的attachEvent
    }else if(element.attachEvent){ 
        element.attachEvent('on'+eventName,fn);
         //如果前面都不行 就采用 传统方式 没有兼容性 的方法来做
    }else{   
        element['on' + eventName] = fn;
    }
}
//兼容性处理原则：优先照顾大多数浏览器，在处理特殊浏览器
//一般addEventListener 和 传统方式 就可以了
封装解绑的兼容性函数
// 解绑事件的兼容性解决方案  封装兼容性函数

function removeEventListener(element,eventName,fn){
    if(element.removeEventListener){
        element.removeEventListener(eventName,fn);
    }else if(element.detachEvent){ 
        element.detachEvent('on'+eventName,fn);
    }else{    
        element['on' + eventName] = null;
    }
}
DOM事件流
● 事件发生时会在元素节点之间按照特定的顺序传播，这个过程即DOM事件流。
DOM事件流分为三个阶段 捕获阶段 目标阶段 冒泡阶段
捕获阶段
事件捕获：美国网景公司最早提出 由DOM最顶层document开始 逐级向下 直到最具体的目标元素接收的过程
目标阶段
冒泡阶段
事件冒泡：IE公司最早提出 由最具体的目标元素接收 逐级向上传播 到DOM最顶层document的过程。


绑定事件的第三个参数 true false(默认)
true 表示捕获阶段触发
false 表示冒泡阶段触发
所以js代码只能在捕获阶段或冒泡阶段其中一个阶段触发
特殊的onclick和attachEvent 只能得到冒泡阶段
有些事件没有冒泡阶段 onblur onfocus onmouseenter onmouseleave
event事件对象
1. event事件对象 写到事件函数的形参里面 一般简写e
2. 先有了事件类型，才会自动创建event事件对象
3. 事件触发，相关信息会保存到event事件对象中 类似于飞机的黑匣子
4. 事件的相关信息一般指 事件类型 还有鼠标坐标 键盘信息等等
5. 获取事件对象有兼容性问题 一般浏览器定义形参e 就可以获取
6. IE678 通过window.event 访问event对象
7. 兼容性解决 e = e||window.event; 判断e为true 就用后者去赋值e
event的属性方法
e|event   获取事件对象
e.type     返回触发事件的类型
e.target   返回触发事件的目标对象

 
event.offsetX 和 event.offsetY  是鼠标到定位盒子的距离
event.pageX  和 event.offsetY   是鼠标到浏览器边缘的距离
返回绑定事件的对象
this            返回绑定事件的对象      一般我们用this
e.currentTarget 返回绑定事件的对象(元素)   (ie678不认识) 

因为DOM事件流冒泡的关系 触发元素 和 绑定元素  有可能不一样






事件类型
鼠标事件
click			 		鼠标单击
mouseover			鼠标移入（有冒泡 经过子盒子也会触发）
mouseout			鼠标移出
mouseenter          鼠标移入（没冒泡 经过子盒子不会触发）
mouseleave          鼠标移出（没冒泡 经过子盒子不会触发）
mousemove			鼠标移动
mousedown			鼠标按下
mouseup			    鼠标松开

 

鼠标事件对象   说明
e.clientX	 e.clientY		鼠标在可视区的X Y坐标
e.pageX	 e.pageY			鼠标在页面文档的X Y坐标 (ie9+支持)
e.screenX  e.screenY		鼠标在屏幕的X Y坐标


键盘事件
keydown       	键盘按下   所有键都识别  
keypress         按下键 触发 但不识别功能键 比如Ctrl shift 箭头等 
keyup      		键盘松开
三个事件的执行顺序 是  keydown   keypress  keyup




键盘事件对象属性   
keycode  返回键对应的ASCII码值
keydown → keycode   不分区分大小写  返回都是大写的ASCII码
keyup    → keycode   不分区分大小写  返回都是大写的ASCII码
keypress  →  keycode      区分大小写 A返65  a 返97

shiftKey  是否按下shift键      返回布尔  true false 
strlKey    是否按下Ctrl键    返回布尔  true false
altKey    是否按下Alt键     返回布尔  true false



表单元素事件
onfocus            获取焦点事件  → focus()方法  obj.focus()
onblur             失去焦点事件 表单元素(单行、多行、单选、复选、下拉)超链接
onchange         选中多项的表单元素(单选复选下拉)

                    obj.option[n] 获取某一个option 

                    obj.selectIndex 获取option的下标

                    window.open() 打开一个新的窗口
onselect       选中文本事件  → select() 方法  obj.select()
onsubmit


编辑事件
oncopy				防止页面内容被复制。结合e.preventDefault()  
onselectstart         防止页面内容被选取  结合e.preventDefault()  
oncontextmenu		禁止鼠标右键。       结合e.preventDefault()  
禁止选中文本 禁止右键菜单
<body>
    <script>
        document.addEventListener('contextmenu',function(e){
            e.preventDefault();
        })
        document.addEventListener('selectstart',function(e){
            e.preventDefault();
        })
    </script>
</body>


页面事件
onload	文档加载完成后再执行的一个事件
scroll         	    滚动事件
onbeforeunload      离开页面之前触发的一个事件。

window.load事件
● window.onload = function () {}
// 窗口加载事件
window.addEventListener('load', function () {
    // 当 图片 js css 等完全加载完毕 才触发该事件 执行处理函数
})
window.addEventListener('DOMContentLoaded', function () {
    // 仅仅指 DOM 加载完毕就触发  不包含css js 图片等
})

window.resize事件
window.addEventListener('resize', function () {
    // 窗口大小发生像素变化 触发
})
window.innerWidth  // 当前屏幕宽度
window.innerHeight // 当前屏幕高度

```