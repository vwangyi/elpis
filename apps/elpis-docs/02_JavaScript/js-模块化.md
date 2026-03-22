# 模块化
- MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules
- V8：https://v8.dev/features/modules

AMD CMD UMD CommonJS ESModule 



## ES Module




- esm导出: 一个文件可以有 多个export 但只能有一个export default默认导出 

```js
export const a = function () {};
export [1, 2, 3, 4]; 
export default {};
```

- esm导入

```js 
import { a, b, c, d } from '@/路径'
import * as abc from '@/路径'   // abc.a  abc.b   导出所有 as 取别名

<script type="module" src="main.js"></script>
<script type="module">
    console.log(12)
</script>
```

```js
// math.js - 导出模块
// 命名导出（可以有多个）
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// 或者统一导出
const PI = 3.14159;
function add(a, b) { return a + b; }
export { PI, add };

// 默认导出（只能有一个）
export default class AdvancedCalculator {
  // ...
}

// main.js - 导入模块
// 导入命名导出
import { PI, add } from './math.js';
console.log(PI); // 3.14159

// 重命名
import { PI as pi } from './math.js';

// 导入全部
import * as math from './math.js';
console.log(math.PI);

// 导入默认导出
import Calculator from './math.js';

// 混合导入
import Calculator, { PI } from './math.js';

```

```js
// 按需加载
// 静态导入（编译时就确定）
import { heavyFunction } from './heavyModule.js';

// 动态导入（运行时加载）
button.addEventListener('click', async () => {
  // 返回Promise
  const module = await import('./heavyModule.js');
  module.heavyFunction();
  
  // 或者
  import('./heavyModule.js')
    .then(module => {
      module.heavyFunction();
    });
});

// 配合条件加载
if (user.isAdmin) {
  const adminModule = await import('./admin.js');
  adminModule.init();
}

// 导入导出 export export default 只能顶层使用（最外层）
```


## CommonJS (Node.js 规范)
- commonjs导出：module.exports 这个变量用来存储导出的值
```js
module.exports = {} 
```
- commonjs导入: required()函数 传入路径 接收导出的值
```js
const a = required('xxx');



```

```js

// math.js - 定义模块
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// 导出模块
module.exports = {
  add,
  multiply
};

// 或者
exports.add = add;
exports.multiply = multiply;

// main.js - 使用模块
const math = require('./math.js');
console.log(math.add(2, 3)); // 5

// 特性：
// 1. 同步加载（服务端适用）
// 2. 模块是对象
// 3. 每个文件都是一个模块
// 4. 有缓存机制

```

## AMD

## UMD



## node_modules查找规则

