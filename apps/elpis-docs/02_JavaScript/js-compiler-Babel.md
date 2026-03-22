# Babel 

- 官网：https://www.babeljs.cn/
- 源码：https://github.com/babel/babel


- 是什么  
- babel是 JavaScript编译器 主要是将es6新语法 转为 es5的兼容性代码。比如 箭头函数转普通函数、ts转js， div转view


## babel核心原理
- 词法分析
- 语法分析
- 语义分析
- 解析（Parse）→ 转换（Transform）→ 生成（Generate）。首先将源代码解析成 AST（抽象语法树），然后通过插件遍历并修改 AST，最后生成新的代码。”



- 预设 和 插件

预设是一组插件的组合



- babal插件



- 其他
swc 用 rust语言写的 js编译器
esbuild 是go语言写的js编译器
tsc 是 ts写的 ts编译器