// <字符串&正则>
const userInfo = `
    张三: 13912341234
    李四四: 18843214321
    王五: 13067896789
`;

const output = `
    张三: 139****1234
    李四四: 188****4321
    王五: 130****6789
`;

function replacePhoneNum(userInfo) {
    // '13912341234' >>> '139****1234'
    // ^开始
    // $结束
    return userInfo.replace(/1[3-9]\d{9}/g, match => `${ match.substring(0, 3) }****${ match.substring(7) }`);
}

console.log(replacePhoneNum(userInfo));

// /^1[3-9]\d{9}$/
// '13912341234'
