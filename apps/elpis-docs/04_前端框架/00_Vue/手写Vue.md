

array 手写array 

vue 手写 监听响应式 手写diff算法 等等 

webpack 手写loader plugin

vue组件 就是一个函数 更准确来说是一个类。 属性成员 props data 方法成员 xx



         一、渲染方法el、render、template优先级



        关于Dom结构的渲染，在组件中可以通过el，render，template进行渲染，在这三者中render函数优先级最高，其次是template模板，如果二者都没有，则通过挂载点el进行渲染。







        二、各个属性优先级比较



        组件内部各个属性主要有props、data、computed、watch、created、mounted、methods。



        （1）props自定义属性：父组件传递给子组件的属性会首先被处理



        （2）data数据区：在处理完 props 之后，Vue 会处理数据对象中的所有属性，并将它们添加到 Vue 实例中。



        （3）computed计算属性：在处理完 data 之后被计算，并添加到 Vue 实例中。



        （4）created函数：在处理完所有选项后，Vue 实例会调用 created 钩子，并完成实例化



        （5）mounted函数：在实例挂载到DOM元素之后，Vue 实例会调用 mounted 钩子。



        （6）methods方法区：会在 mounted 之后被处理，并添加到 Vue 实例中。







ref 和 reactive的区别 为什么推荐使用ref而不用reactive reactive设计出来是为什么  

### 
## 
vue重点： 响应式 生命周期 diff算法 模版编译



## `@vue/compiler-core`
```javascript
@vue/compiler-core 是 Vue 3 中的一个关键模块，用于将 Vue 模板编译为渲染函数。
它的整体逻辑可以分为几个主要阶段：
  解析（Parsing）、
    转换（Transformation）、
      优化（Optimization）和代码生成（Code Generation）。
下面是对这些阶段的详细介绍：

1. 解析（Parsing）
目标：将模板字符串解析为抽象语法树（AST）。

•输入：Vue 模板字符串。
•输出：AST。
•过程：通过 baseParse 函数，将模板解析为一个结构化的 AST。这个 AST 包含了模板中所有元素、属性、指令和文本节点的信息。

2. 转换（Transformation）
目标：对 AST 进行转换和优化，使其更适合生成高效的渲染代码。

•输入：AST。
•输出：转换后的 AST。
•过程：

•节点转换（Node Transforms）：通过一系列插件对 AST 节点进行转换。可以自定义插件来处理特定类型的节点或指令。
•指令转换（Directive Transforms）：处理 Vue 特有的指令（如 v-if、v-for），将它们转换为渲染函数所需的代码结构。



3. 优化（Optimization）
目标：标记静态内容以提升渲染性能。

•输入：转换后的 AST。
•输出：优化后的 AST。
•过程：识别和标记静态节点和属性，这样在渲染过程中可以跳过不必要的更新。

4. 代码生成（Code Generation）
目标：将优化后的 AST 生成渲染函数代码。

•输入：优化后的 AST。
•输出：渲染函数的 JavaScript 代码。
•过程：通过 generate 函数，将 AST 转换为可执行的渲染函数代码。生成的代码将包含创建虚拟 DOM 的逻辑，并根据模板结构生成相应的渲染指令。

整体逻辑流程图
1.解析阶段：模板字符串 → AST
2.转换阶段：AST → 转换后的 AST
3.优化阶段：转换后的 AST → 优化后的 AST
4.代码生成阶段：优化后的 AST → 渲染函数代码

使用示例
以下是一个简单的例子，展示如何使用 @vue/compiler-core 将模板编译为渲染函数：

import { baseParse, transform, generate } from '@vue/compiler-core';

// 模板字符串
const template = `<div>{{ message }}</div>`;

// 1. 解析模板为 AST
const ast = baseParse(template);

// 2. 转换和优化 AST
transform(ast, {
  nodeTransforms: [], // 可以添加自定义节点转换插件
  directiveTransforms: {}, // 可以添加自定义指令转换插件
});

// 3. 生成渲染函数代码
const { code } = generate(ast);

console.log(code);
// 输出类似以下内容的渲染函数代码：
// function render(_ctx, _cache) {
//   return (_openBlock(), _createElementBlock("div", null, _toDisplayString(_ctx.message), 1 /* TEXT */))
// }
结论
@vue/compiler-core 
  是 Vue 3 模板编译器的核心模块，通过解析、转换、优化和代码生成这四个阶段，
  将模板编译为高效的渲染函数。它提供了高度的可定制性，允许开发者根据需要调整编译过程。
```





