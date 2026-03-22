// <数组&字符串&函数练习>封装函数输出正确的结果

// 参数解构
function classNames(...input) {
    return input.join(' ').trim();
}

console.log(classNames('active', 'container', 'flex-box')); // 'active container flex-box'
console.log(classNames(undefined, 'container', 'flex-box')); // 'container flex-box'
console.log(classNames('', 'container', 'flex-box')); // 'container flex-box'
