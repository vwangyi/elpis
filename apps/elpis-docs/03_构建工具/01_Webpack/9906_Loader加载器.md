# loader

可以帮你写一个自动引入 Vue Composition API 的 Webpack loader。这个 loader 会分析代码中是否使用了 ref、computed、watch 等 API，并自动添加对应的 import 语句。

```javascript
// auto-import-vue-api-loader.js
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const t = require('@babel/types')

module.exports = function(source) {
  // 如果文件不是 .vue 文件或者没有 <script> 块，直接返回
  if (!this.resourcePath.endsWith('.vue')) {
    return source
  }

  // 提取 Vue 单文件组件中的 script 内容
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/
  const match = source.match(scriptRegex)
  
  if (!match) {
    return source
  }

  const scriptTag = match[0]
  const scriptAttrs = match[1]
  const scriptContent = match[2]
  
  // 要检查的 Vue Composition API
  const vueApis = [
    'ref', 'computed', 'watch', 'watchEffect', 
    'reactive', 'toRefs', 'onMounted', 'onUpdated',
    'onUnmounted', 'provide', 'inject', 'nextTick'
  ]
  
  try {
    // 解析 script 内容为 AST
    const ast = parser.parse(scriptContent, {
      sourceType: 'module',
      plugins: ['typescript'] // 支持 TypeScript
    })

    // 检查是否已经导入了 vue
    let hasVueImport = false
    let usedApis = new Set()

    // 遍历 AST
    traverse(ast, {
      // 检查现有的 import 语句
      ImportDeclaration(path) {
        if (path.node.source.value === 'vue') {
          hasVueImport = true
          // 记录已经导入的 API
          path.node.specifiers.forEach(specifier => {
            if (t.isImportSpecifier(specifier)) {
              const importedName = specifier.imported.name
              usedApis.add(importedName)
            }
          })
        }
      },
      
      // 检查 API 的使用情况
      Identifier(path) {
        if (vueApis.includes(path.node.name)) {
          // 确保是作为函数调用或引用，而不是对象属性
          const parent = path.parent
          if (t.isCallExpression(parent) && parent.callee === path.node) {
            usedApis.add(path.node.name)
          } else if (t.isVariableDeclarator(parent) && parent.init === path.node) {
            usedApis.add(path.node.name)
          } else if (t.isExpressionStatement(parent) && parent.expression === path.node) {
            usedApis.add(path.node.name)
          }
        }
      }
    })

    // 如果已经导入了 vue，找出缺失的 API
    if (hasVueImport) {
      const missingApis = Array.from(usedApis).filter(api => !usedApis.has(api))
      
      if (missingApis.length > 0) {
        // 找到现有的 vue import 语句并添加缺失的 API
        traverse(ast, {
          ImportDeclaration(path) {
            if (path.node.source.value === 'vue') {
              missingApis.forEach(api => {
                path.node.specifiers.push(
                  t.importSpecifier(t.identifier(api), t.identifier(api))
                )
              })
            }
          }
        })
      }
    } else if (usedApis.size > 0) {
      // 没有导入 vue，需要添加新的 import 语句
      const importDeclaration = t.importDeclaration(
        Array.from(usedApis).map(api => 
          t.importSpecifier(t.identifier(api), t.identifier(api))
        ),
        t.stringLiteral('vue')
      )
      
      // 在程序开头插入 import 语句
      ast.program.body.unshift(importDeclaration)
    }

    // 生成新的 script 内容
    const { code: newScriptContent } = generate(ast)
    
    // 替换原有的 script 内容
    const newSource = source.replace(
      scriptRegex,
      `<script${scriptAttrs}>${newScriptContent}</script>`
    )
    
    return newSource
  } catch (err) {
    console.error('Auto import loader error:', err)
    return source
  }
}
```

使用这个 loader 需要在 webpack 配置中添加：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader',
          {
            loader: path.resolve(__dirname, 'auto-import-vue-api-loader.js'),
            options: {}
          }
        ]
      }
    ]
  }
}
```

如果你想使用更简单的方法，也可以使用现有的插件：

方案二：使用 unplugin-auto-import

推荐使用社区成熟的方案，更稳定且功能更强大：

```bash
npm install -D unplugin-auto-import
```

然后在 webpack 配置中添加：

```javascript
// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')

module.exports = {
  plugins: [
    AutoImport({
      imports: ['vue'],  // 自动导入 Vue 的 API
      dts: true,         // 生成 TypeScript 声明文件
      eslintrc: {
        enabled: true,   // 生成 .eslintrc-auto-import.json
      }
    })
  ]
}
```

这个插件不仅支持 Vue，还支持 React、Vue Router、Pinia 等，并且会自动添加 ESLint 配置，避免报 no-undef 错误。


## 手写loader

```js
// 字符串类型的文件内容
function bugLoader(content) {
  console.log(content)
  return content;
}
```



业务场景： 3个项目 都要做埋点  一个点一个点埋 要花3个月 我写一个loader 只需要2周 

业务场景：国际化自动替换
假设你有一个多语言项目，需要将代码中的中文文本自动替换为对应的翻译键值，同时生成翻译文件。这个场景非常适合手写 Loader 来实现。


业务场景：代码埋点自动注入
场景：产品经理要求所有按钮点击、页面访问都要上报埋点数据。手动在每个点击事件添加埋点代码很繁琐且容易遗漏。我们可以写一个 Loader 自动为组件添加埋点逻辑。



业务场景：代码性能监控自动注入
场景：你需要监控项目中所有函数和组件的执行性能，找出性能瓶颈。手动为每个函数添加性能监控代码会污染业务代码且维护困难。通过 Loader 自动注入性能监控代码。

业务场景：Vue 组件自动注册和全局组件扫描
场景：在大型 Vue 项目中，手动导入和注册组件非常繁琐，特别是当你有大量通用组件时。通过 Loader 自动扫描和注册组件，实现按需加载和自动全局注册。


业务场景：每个vue文件都需要 引入 ref computed watch inject 等等api 一个loader 直接引入 不需要手动引入 

业务场景：Vue 路由自动生成和权限控制
场景：在大型 Vue 项目中，手动配置路由和管理权限非常繁琐且容易出错。通过 Loader 自动扫描页面组件，根据文件结构和注释生成路由配置，并自动注入权限控制逻辑。



业务场景：业务埋点自动采集与可视化分析（大厂真实案例） 埋点loader 
场景：某大厂内容平台（类似今日头条/抖音）需要全面采集用户行为数据，用于推荐算法优化和产品决策。通过 Loader 实现无侵入式埋点、自动采集和数据分析。
这是一个真实的短视频/内容平台，需要采集：

用户行为：点击、滑动、停留、分享等

内容曝光：视频播放、文章阅读、广告展示

性能数据：加载时间、白屏时间、交互延迟

转化漏斗：注册-浏览-互动-付费完整链路




- 是什么

- 

# Loader 原理

## loader 概念

帮助 webpack 将不同类型的文件转换为 webpack 可识别的模块。

## loader 执行顺序

1. 分类

- pre： 前置 loader
- normal： 普通 loader
- inline： 内联 loader
- post： 后置 loader

2. 执行顺序

- 4 类 loader 的执行优级为：`pre > normal > inline > post` 。
- 相同优先级的 loader 执行顺序为：`从右到左，从下到上`。

例如：

```js
// 此时loader执行顺序：loader3 - loader2 - loader1
module: {
  rules: [
    {
      test: /\.js$/,
      loader: "loader1",
    },
    {
      test: /\.js$/,
      loader: "loader2",
    },
    {
      test: /\.js$/,
      loader: "loader3",
    },
  ],
},
```

```js
// 此时loader执行顺序：loader1 - loader2 - loader3
module: {
  rules: [
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "loader1",
    },
    {
      // 没有enforce就是normal

      // enforce: "normal", // 不写 默认为 normal
      test: /\.js$/,
      loader: "loader2",
    },
    {
      enforce: "post",
      test: /\.js$/,
      loader: "loader3",
    },
  ],
},
```

3. 使用 loader 的方式

- 配置方式：在 `webpack.config.js` 文件中指定 loader。（pre、normal、post loader）
- 内联方式：在每个 `import` 语句中显式指定 loader。（inline loader）

4. inline loader

用法：`import Styles from 'style-loader!css-loader?modules!./styles.css';`

含义：

- 使用 `css-loader` 和 `style-loader` 处理 `styles.css` 文件
- 通过 `!` 将资源中的 loader 分开

`inline loader` 可以通过添加不同前缀，跳过其他类型 loader。

- `!` 跳过 normal loader。

`import Styles from '!style-loader!css-loader?modules!./styles.css';`

- `-!` 跳过 pre 和 normal loader。

`import Styles from '-!style-loader!css-loader?modules!./styles.css';`

- `!!` 跳过 pre、 normal 和 post loader。

`import Styles from '!!style-loader!css-loader?modules!./styles.css';`

## 开发一个 loader

### 1. 最简单的 loader

```js
// loaders/loader1.js
module.exports = function loader1(content) {
  console.log("hello loader");
  return content;
};
```

它接受要处理的源码作为参数，输出转换后的 js 代码。

### 2. loader 接受的参数

- `content` 源文件的内容
- `map` SourceMap 数据
- `meta` 数据，可以是任何内容

## loader 分类

### 1. 同步 loader

```js
module.exports = function (content, map, meta) {
  return content;
};
```

`this.callback` 方法则更灵活，因为它允许传递多个参数，而不仅仅是 `content`。

```js
module.exports = function (content, map, meta) {
  // 传递map，让source-map不中断
  // 传递meta，让下一个loader接收到其他参数
  this.callback(null, content, map, meta);
  return; // 当调用 callback() 函数时，总是返回 undefined
};
```

### 2. 异步 loader

```js
module.exports = function (content, map, meta) {
  const callback = this.async();
  // 进行异步操作
  setTimeout(() => {
    callback(null, result, map, meta);
  }, 1000);
};
```

> 由于同步计算过于耗时，在 Node.js 这样的单线程环境下进行此操作并不是好的方案，我们建议尽可能地使你的 loader 异步化。但如果计算量很小，同步 loader 也是可以的。

### 3. Raw Loader

默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，loader 可以接收原始的 Buffer。

```js
module.exports = function (content) {
  // content是一个Buffer数据
  return content;
};
module.exports.raw = true; // 开启 Raw Loader
```

### 4. Pitching Loader

```js
module.exports = function (content) {
  return content;
};
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  console.log("do somethings");
};
```

webpack 会先从左到右执行 loader 链中的每个 loader 上的 pitch 方法（如果有），然后再从右到左执行 loader 链中的每个 loader 上的普通 loader 方法。

![loader执行流程](/imgs/source/loader1.png)

在这个过程中如果任何 pitch 有返回值，则 loader 链被阻断。webpack 会跳过后面所有的的 pitch 和 loader，直接进入上一个 loader 。

![loader执行流程](/imgs/source/loader2.png)

## loader API

| 方法名                  | 含义                                       | 用法                                           |
| ----------------------- | ------------------------------------------ | ---------------------------------------------- |
| this.async              | 异步回调 loader。返回 this.callback        | const callback = this.async()                  |
| this.callback           | 可以同步或者异步调用的并返回多个结果的函数 | this.callback(err, content, sourceMap?, meta?) |
| this.getOptions(schema) | 获取 loader 的 options                     | this.getOptions(schema)                        |
| this.emitFile           | 产生一个文件                               | this.emitFile(name, content, sourceMap)        |
| this.utils.contextify   | 返回一个相对路径                           | this.utils.contextify(context, request)        |
| this.utils.absolutify   | 返回一个绝对路径                           | this.utils.absolutify(context, request)        |

> 更多文档，请查阅 [webpack 官方 loader api 文档](https://webpack.docschina.org/api/loaders/#the-loader-context)

## 手写 clean-log-loader

作用：用来清理 js 代码中的`console.log`

```js
// loaders/clean-log-loader.js
module.exports = function cleanLogLoader(content) {
  // 将console.log替换为空
  return content.replace(/console\.log\(.*\);?/g, "");
};
```

## 手写 banner-loader

作用：给 js 代码添加文本注释

- loaders/banner-loader/index.js

```js
const schema = require("./schema.json");

module.exports = function (content) {
  // 获取loader的options，同时对options内容进行校验
  // schema是options的校验规则（符合 JSON schema 规则）
  const options = this.getOptions(schema);

  const prefix = `
    /*
    * Author: ${options.author}
    */
  `;

  return `${prefix} \n ${content}`;
};
```

- loaders/banner-loader/schema.json

```json
{
  "type": "object",
  "properties": {
    "author": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

## 手写 babel-loader

作用：编译 js 代码，将 ES6+语法编译成 ES5-语法。

- 下载依赖

```
npm i @babel/core @babel/preset-env -D
```

- loaders/babel-loader/index.js

```js
const schema = require("./schema.json");
const babel = require("@babel/core");

module.exports = function (content) {
  const options = this.getOptions(schema);
  // 使用异步loader
  const callback = this.async();
  // 使用babel对js代码进行编译
  babel.transform(content, options, function (err, result) {
    callback(err, result.code);
  });
};
```

- loaders/banner-loader/schema.json

```json
{
  "type": "object",
  "properties": {
    "presets": {
      "type": "array"
    }
  },
  "additionalProperties": true
}
```

## 手写 file-loader

作用：将文件原封不动输出出去

- 下载包

```
npm i loader-utils -D
```

- loaders/file-loader.js

```js
const loaderUtils = require("loader-utils");

function fileLoader(content) {
  // 根据文件内容生产一个新的文件名称
  const filename = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content,
  });
  // 输出文件
  this.emitFile(filename, content);
  // 暴露出去，给js引用。
  // 记得加上''
  return `export default '${filename}'`;
}

// loader 解决的是二进制的内容
// 图片是 Buffer 数据
fileLoader.raw = true;

module.exports = fileLoader;
```

- loader 配置

```js
{
  test: /\.(png|jpe?g|gif)$/,
  loader: "./loaders/file-loader.js",
  type: "javascript/auto", // 解决图片重复打包问题
},
```

## 手写 style-loader

作用：动态创建 style 标签，插入 js 中的样式代码，使样式生效。

- loaders/style-loader.js

```js
const styleLoader = () => {};

styleLoader.pitch = function (remainingRequest) {
  /*
    remainingRequest: C:\Users\86176\Desktop\source\node_modules\css-loader\dist\cjs.js!C:\Users\86176\Desktop\source\src\css\index.css
      这里是inline loader用法，代表后面还有一个css-loader等待处理

    最终我们需要将remainingRequest中的路径转化成相对路径，webpack才能处理
      希望得到：../../node_modules/css-loader/dist/cjs.js!./index.css

    所以：需要将绝对路径转化成相对路径
    要求：
      1. 必须是相对路径
      2. 相对路径必须以 ./ 或 ../ 开头
      3. 相对路径的路径分隔符必须是 / ，不能是 \
  */
  const relativeRequest = remainingRequest
    .split("!")
    .map((part) => {
      // 将路径转化为相对路径
      const relativePath = this.utils.contextify(this.context, part);
      return relativePath;
    })
    .join("!");

  /*
    !!${relativeRequest} 
      relativeRequest：../../node_modules/css-loader/dist/cjs.js!./index.css
      relativeRequest是inline loader用法，代表要处理的index.css资源, 使用css-loader处理
      !!代表禁用所有配置的loader，只使用inline loader。（也就是外面我们style-loader和css-loader）,它们被禁用了，只是用我们指定的inline loader，也就是css-loader

    import style from "!!${relativeRequest}"
      引入css-loader处理后的css文件
      为什么需要css-loader处理css文件，不是我们直接读取css文件使用呢？
      因为可能存在@import导入css语法，这些语法就要通过css-loader解析才能变成一个css文件，否则我们引入的css资源会缺少
    const styleEl = document.createElement('style')
      动态创建style标签
    styleEl.innerHTML = style
      将style标签内容设置为处理后的css代码
    document.head.appendChild(styleEl)
      添加到head中生效
  */
  const script = `
    import style from "!!${relativeRequest}"
    const styleEl = document.createElement('style')
    styleEl.innerHTML = style
    document.head.appendChild(styleEl)
  `;

  // style-loader是第一个loader, 由于return导致熔断，所以其他loader不执行了（不管是normal还是pitch）
  return script;
};

module.exports = styleLoader;
```











 


### 7. 有哪些常见的**Loader**？


+ file-loader：把⽂件输出到⼀个⽂件夹中，在代码中通过相对 URL 去引⽤输出的⽂件
+ url-loader：和 file-loader 类似，但是能在⽂件很⼩的情况下以 base64 的⽅式把⽂件内容注⼊到代码中去
+ source-map-loader：加载额外的 Source Map ⽂件，以⽅便断点调试
+ image-loader：加载并且压缩图⽚⽂件
+ babel-loader：把 ES6 转换成 ES5
+ css-loader：加载 CSS，⽀持模块化、压缩、⽂件导⼊等特性
+ style-loader：把 CSS 代码注⼊到 JavaScript 中，通过 DOM 操作去加载 CSS。
+ eslint-loader：通过 ESLint 检查 JavaScript 代码



**注意：**在Webpack中，loader的执行顺序是**从右向左**执行的。因为webpack选择了**compose这样的函数式编程方式**，这种方式的表达式执行是从右向左的。

