# 错误

- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error/Error



## 创建错误对象
```js

const xxx,; // 这是一个语法错误对象
[].length = -1; // 这是一个范围错误
sdfsdf.sdfsf.sdfsf; // 未定义错误

new Error(); // 自定义错误


try {
  throw new Error();
} catch (err) {
  const error = new Error("我是一个错误", { cause: err });
  throw error;
}



new Error(message, fileName, lineNumber) // fileName默认值为当前文件名 lineNumber 默认值为当前行号
const error1 = new Error('我是错误', 13, 2)
```