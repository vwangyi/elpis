{/* <字符串>提取url中的信息 */ }
function transform(input) {
    const [name, id] = input.split('/').slice(-2);
    return { name, id: +id };
}

function transform(input) {
    const [id, name] = input.split('/').reverse();
    return { name, id: +id };
}

console.log(transform('xxxx/xxx/xxx/zhangsan/13')); // { name: 'zhangsan', id: 13 }
console.log(transform('xxxx/xxx/xxx/xx/lisi/24')); // { name: 'lisi', id: 24 }
