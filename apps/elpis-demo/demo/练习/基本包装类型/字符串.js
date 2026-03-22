var str = '  hiaello world hello world  ' // 'hello world' >>> 'hello-world'
// 字符串只读

// 1. 取字符
console.log(str[0])

// 2. 字符串截取
// str.substr(从哪开始, 截几个)
// console.log( str.substr(2, 3) ); // 'llo'
// console.log( str.substr(2) ); // 'llo world'

// str.substring(从哪个索引开始, 截到哪个索引截止(不包含))
console.log(str.substring(2, 5)) // [2, 5)
console.log(str.substring(2)) // [2, 最后)

// 3. 字符串长度
console.log(str.length)

// 4. 字符串替换
// str.replace(要换的内容, 想换成的内容)
// console.log( str.replace(' ', '-') );
// console.log( str.replace(/ /g, '-') );

// 5. 分割字符串
// 'hello world hello world' >>> ['hello', 'world', 'hello', 'world']
console.log(str.split(' '))

// 6. 没用
console.log(str.charAt(0))
console.log(str[0])
console.log(str.charCodeAt(0)) // 104
console.log(str.charCodeAt(1)) // 105
console.log(str.charCodeAt(2)) // 97 ASCII码

// 7. 去掉前后的所有空格
console.log(str.trim())
console.log(str)

// 8. 是否以...开头/结尾
var str1 = 'xx2022'
console.log(str1.startsWith('xx')) // true
console.log(str1.endsWith('xx')) // false

// 9. 包含
var str2 = 'hello every one tmd'
console.log(str2.includes('tmd')) // true
