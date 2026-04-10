// 匹配字符串
// 描述一个规则
const reg = /^1[3-9]\d{9}$/; // new RegExp()
const str = '13912341234';
// console.log( str.search(reg) > -1 );
console.log(reg.test(str));
// console.log( reg.exec(str) );
