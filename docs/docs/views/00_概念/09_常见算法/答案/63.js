// <字符串&正则>
// 输入一串密码，判断是否合法，合法的密码为6-10位，只能包含字母、数字、下划线。
function isPassword(password) {
    const reg = /^[a-zA-Z0-9_]{6,10}$/;
    return reg.test(password);
}

console.log( isPassword('123456') ); // true
console.log( isPassword('123456789') ); // true
console.log( isPassword('12345_ab') ); // true
console.log( isPassword('123456789_a') ); // false
console.log( isPassword('123456789_a1') ); // false
