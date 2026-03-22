# 深浅拷贝



JSON.parse(JSON.stringify(obj))

| 方法                              | 是否支持函数/循环引用  | 是否支持特殊对象                      |
| :-------------------------------- | :--------------------- | :------------------------------------ |
| `JSON.parse(JSON.stringify(obj))` | ❌ 不支持函数、循环引用 | ❌ 丢失 `Date`、`RegExp`、`Map`、`Set` |
| 第三方库 `lodash.cloneDeep`       | ✅ 支持                 | ✅ 支持，但体积大，速度较慢            |
| 手写递归                          | ✅ 可支持               | ❌ 复杂、易出错                        |

 structuredClone