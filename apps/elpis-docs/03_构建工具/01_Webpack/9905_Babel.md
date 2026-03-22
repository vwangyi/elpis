# Babel


- 是什么：

- 怎么用：


### **20. Babel**的原理是什么**?**
babel 的转译过程也分为三个阶段，这三步具体是：



+ **解析 Parse**: 将代码解析⽣成抽象语法树（AST），即词法分析与语法分析的过程；
+ **转换 Transform**: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在此过程中进⾏添加、更新及移除等操作；
+ **⽣成 Generate**: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2021/png/1500604/1615908675152-69682ae3-d0b3-4552-a32e-39c2022b1db0.png?x-oss-process=image%2Fresize%2Cw_1500%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_43%2Ctext_5YmN56uv5Yab5ZOl%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)


Babel 是编译器，负责语法转换；

Webpack 是打包器，负责模块管理和资源打包；

构建是整个从源代码到产物的过程。它们通常一起使用，Babel 作为 Webpack 的一个 loader 存在。


### **20. Babel**的原理是什么**?**
babel 的转译过程也分为三个阶段，这三步具体是：



+ **解析 Parse**: 将代码解析⽣成抽象语法树（AST），即词法分析与语法分析的过程；
+ **转换 Transform**: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在此过程中进⾏添加、更新及移除等操作；
+ **⽣成 Generate**: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2021/png/1500604/1615908675152-69682ae3-d0b3-4552-a32e-39c2022b1db0.png?x-oss-process=image%2Fresize%2Cw_1500%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_43%2Ctext_5YmN56uv5Yab5ZOl%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)



### 问：Babel
<!-- 这是一张图片，ocr 内容为：是什么 BABEL是做ES6转ES5的兼容性处理 将JS通过词法分析 语法分析 解析生成抽象语法树(AST) 比如箭头函数转普通函数 对抽象语法树做一些转换操作 原理 BABEL 再把抽象语法树转回JS BABEL通过LOADER引入 通常使用BABEL和@BABEL/PRESET-ENV预设一起完成 怎么使用 @BABEL/PRESET-ENV 需要指定兼容的浏览器版本程度一般是IE11 -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1756978550160-1c1926f2-3108-4ab7-a8a0-9904b9def417.png)

