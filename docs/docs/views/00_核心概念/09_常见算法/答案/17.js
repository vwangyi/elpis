// <数组&字符串练习>将类名数组转换为字符串
const input = [
    undefined,
    'container',
    'flex-box',
];
const output = ' container flex-box';

function classNames(input) {
    return input.join(' ').trim();
}

console.log(classNames(input))
