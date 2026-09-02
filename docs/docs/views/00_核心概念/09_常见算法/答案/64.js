// <字符串&正则&闭包>
// 输入一个正则表达式, 生成一个可以复用的验证函数, 可以输入一些字符, 用来测试正则表达式的正确性.
// 如果能够匹配, 则输出 true, 否则输出 false

// 策略模式
function createTestFunc(reg) {
    return function (str) {
        return reg.test(str);
    }
}

function createTestFunc(reg) {
    return str => reg.test(str);
}

const createTestFunc = reg => str => reg.test(str);

// 例1
const test1 = createTestFunc(/^[a-z]$/);
console.log( test1('a') ); // true
console.log( test1('1') ); // false
console.log( test1('hello world') ); // false

// 例2
const test2 = createTestFunc(/^1[3-9]\d{9}$/);
console.log( test2('13912341234') ); // true
console.log( test2('123456789') ); // false
console.log( test2('hello world') ); // false
