# 字符串 String 



## 创建字符串 
```js  
const str = '';
const str2 = String(123) // '123' 
const str3 = "" // 双引号
const str4 = ``; // 反引号 模版字符串
const str2 = new String('2') // 字符串包装对象 别用
```

## 字符串长度
```js 
''.length 
```

## 字符串下标
```js 
'Hello World, Hello World'.indexOf("World") // 从左到右查找 第一个子串 返回起始下标 找不到返回-1
'Hello World, Hello World'.lastIndexOf("World") // 从右到左查找 
'The quick brown fox jumps over the lazy dog'.search(/quick/)// 通过正则匹配 返回下标 找不到返回-1
```

## 字符串截取
```js
"Hello World".substring(0, 5) // 'Hello'
"Hello World".slice(0, 5) // 'Hello'
"Hello World".slice(6) // 'World'
"Hello World".slice(-2) // 'ld' 支持反向索引
'Hello World'[0] // H  
'cat'.charCodeAt(0) // 下标对应的 ascii码
```

## 字符串判断
```js 
'sfsdf'.includes('fs', 0) // 是否存在子串 默认从下标0开始找
'sdfsdf'.startsWith('s'); // 判断前缀
'sdfsdf'.endsWith('s'); // 判断后缀
```
 
## 字符串替换 
```js 
'你大傻逼'.replace(/傻逼/g, "**") // '你大**'
'Hello world'.toUpperCase() // 字母替换大写
'Hello world'.toLowerCase()  // 字母替换小写
 

'Hello World, Hello JavaScript'.replaceAll('Hello', 'Hi') // 'Hi World, Hi JavaScript'


'  Hello World  \t\n'.trim() // Hello World 移除首尾空白字符
'  Hello World  \t\n'.trimStart() 
'  Hello World  \t\n'.trimLeft()
'  Hello World  \t\n'.trimEnd()
'  Hello World  \t\n'.trimRight()


```
 

## 字符串遍历
```js
'Hello'.split('') //  [H, e, l, l, o] 
'hello world'.split(' ') // ['hello', 'world'] 
[...'Hello'] // [H, e, l, l, o]
Array.from('Hello') // [H, e, l, l, o]

for (const substr of 'Hello') {
  console.log(substr); // H, e, l, l, o
}
```   
## 字符串拼接
```js
`姓名：${123}，年龄：${123}`
'hello' + ' world' // 'hello world'
'hello'.concat(' world', ' 123') // 'hello world 123'
'1'.padStart(5, '0') // '00001' // 头部填充
'1'.padEnd(5, '0') // '10000'// 尾部填充
'Hi '.repeat(3) // 'Hi Hi Hi '
```