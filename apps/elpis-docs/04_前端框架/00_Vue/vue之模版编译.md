

### 
## Vue相关
vue 推荐使用 template 因为做了很多优化 而 jsx 没有优化则性能比 template 差  

### 
### 
### 问：模版编译
模版编译是 把用户编写的 template 转为 抽象语法树 再转为 render 函数的过程。所以模版本质就是一个 render 函数，执行 render 函数就会生成虚拟dom。

```markdown
● 模版编译流程
  ○ 解析模版。通过 正则 去匹配 标签 属性 和文本， 把模版字符串 转为 抽象语法树
  ○ 静态标记。对整个抽象语法树 的 静态文本 进行标记，打了标记就不用diff
  ○ 把抽象语法树转为 render 函数。   _c _v _s 
            new Function(`with(this){return ${this.template}}`)
  * 执行rener函数就会生成 虚拟dom
  * 通过 diff算法 实现最小量更新   patch 打补丁到真实dom


● 是什么：开发者写的template模板 转换为 render函数 的过程，
          这个渲染函数最终用于生成虚拟DOM。
          整个过程大致可以分为三个核心步骤：
          解析(Parsing)、优化(Optimization)、代码生成(Code Generation)。”
● 第一步，解析模版字符串。用正则匹配出 标签 属性 文本，形成一个 AST抽象语法树。
● 第二步，对AST抽象语法树进行优化。遍历整个AST，进行静态标记。
● 第三步，把抽象语法树转为 render 函数。
          new Function(`with(this){return ${this.template}}`)


const vm = new Vue({
    el: '#app',
    template: ``,
    render(h){},
    data() {
      return {}
    },
});
// 创建虚拟dom 
function createVnode(tag, data, text, elm, children) {
  const { key } = data;
  return { 
    tag, // 标签名
    data, // 所有的属性组成的对象 
    text, // 标签体的文本内容
    elm, // 对应的真实dom节点
    children,  
    key
  }
}
 

// 进行对比 然后更新 
function patch(new) {
   // xxx 其他情况

   // 新旧虚拟dom 的children 都是数组
   if () {
      updateChildren();
   }
}
```





### 问：AST抽象语法树
AST 抽象语法树 是 源代码语法结构的抽象表示。它的好处是 字符串是不方便操作的，转为结构化数据方便操作，比如进行优化等等。

```markdown
● https://www.bilibili.com/video/BV1GK4y1W7fi 
● 应用场景 
  ○ webpack 中 import 转 require 
  ○ ts 转 js
  ○ eslint 转 
● 字符串拼接 
抽象语法树是什么抽象语法树 是 源代码语法结构 的抽象表示
优缺点ast的好处是 将 源代码 从字符串 转为了 结构化数据，
因为操作字符串是不方便的，转为树形结构方便操作。
讲应用vue的模版语法 jsx 都使用了 抽象语法树 
```

### 问：虚拟 DOM
虚拟 DOM 是用 JS 对象来描述 DOM的层次结构。 虚拟 dom 的好处是可以跨平台比如 uniapp。

为什么需要虚拟 DOM 

为什么 vue3.6 取消虚拟 DOM

```markdown
● 虚拟 DOM 就是用 JS对象来描述DOM的层次结构。
● 对比 新旧虚拟DOM树 
● 用 h 函数(渲染函数 createVNode函数 ) 可以创建虚拟 dom
● template 和 jsx 最终都会编译为 h 函数 编译过程不同 
● 虚拟 dom 有哪些节点 
```





### 
### 


