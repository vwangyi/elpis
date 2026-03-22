# JSON
- JSON.stringify(sidebar, null, 2) 格式化输出
- JSON.stringify(sidebar) 紧凑输出


## 创建JSON
- 拿到JSON对象
```js 
const JSON = globalThis.JSON
```

## JSON的属性方法
```js
 
typeof JSON // object JSON是一个全局对象

const value = {a:{a:1}} 

const obj2 = JSON.parse(JSON.stringify(obj1)) // 深拷贝
 



// JSON.parse() 方法用于将一个 JSON 字符串转换为对象。
// JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串。


// JSON.stringify() 将传入的js数据转为 JSON 字符串
// 这个过程会递归遍历对象的所有可枚举属性 并将其序列化 转为json字符串


// 但并不是所有的js数据都可以转为json字符串 比如 function undefined symbol 循环引用的对象 这些数据无法正确的序列化 



JSON.parse() // 则是反序列化 把一个json字符串转为js数据 由于字符串的不可变性 所以会创建一个新的地址的数据
// 经过序列化和反序列化后的数据和原数据在内存中是不同的引用地址 这就实现了深拷贝

// 由于 function undefined symbol Date RegExp Map Set BigInt ArrayBuffer 等数据不能正确的序列化 所以如果涉及这些数据 就需要用专业的深拷贝方法
//  比如 lodash 的   lodash.cloneDeep() 方法

 

```


 