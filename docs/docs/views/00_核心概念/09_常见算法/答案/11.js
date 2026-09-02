// <对象&字符串练习>字符串转对象
const input = 'name=zhangsan&age=18&sex=nan&height=180';
const output = {
    name: 'zhangsan',
    age: 18, // 这里是数字的18
    sex: 'nan',
    height: 180,
};

function str2obj(input) {
    const result = {};
    const keyValueArr = input.split('&'); // 数组项为name=zhangsan
    for (const item of keyValueArr) {
        // name=zhangsan >>> 'name', 'zhangsan'
        const tmp = item.split('='); // ['name', 'zhangsan']
        const key = tmp[0];
        const value = tmp[1];
        result[key] = isNaN(value) ? value : +value;
    }
    return result;
}

function str2obj(input) {
    const result = {};
    const keyValueArr = input.split('&'); // 数组项为name=zhangsan
    for (const item of keyValueArr) {
        // name=zhangsan >>> 'name', 'zhangsan'
        // es6数组解构赋值
        const [key, value] = item.split('='); // ['name', 'zhangsan']
        result[key] = isNaN(value) ? value : +value;
    }
    return result;
}
