// <字符串>提取url中的信息
function transform(input) {
    const result = {};
    const [url, query] = input.split('?');
    // url: 'xxxx/xxx/xxx/13'
    // query: 'name=zhangsan&age=18'
    const [id] = url.split('/').reverse(); // id: 13
    result.id = +id;
    const tmp = query.split('&'); // ['name=zhangsan', 'age=18']
    for (const item of tmp) {
        // item: 'name=zhangsan'
        const [key, value] = item.split('='); // ['name', 'zhangsan']
        result[key] = isNaN(value) ? value : +value;
    }
    return result;
}

console.log(transform('xxxx/xxx/xxx/13?name=zhangsan&age=18')); // { name: 'zhangsan', id: 13, age: 18 }
console.log(transform('xxxx/xxx/xxx/xx/24?name=lisi&age=10')); // { name: 'lisi', id: 24, age: 10}
