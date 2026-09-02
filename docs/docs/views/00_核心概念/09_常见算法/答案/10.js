// <对象&字符串练习>字符串转对象
const input = 'name=zhangsan&age=18&sex=nan&height=180';

const output = {
    name: 'zhangsan',
    age: '18', // 这里是字符串的18
    sex: 'nan',
    height: '180',
};

function str2obj(input) {
    const tmp = input.split('&'); // ['name=zhangsan', 'age=18', 'sex=nan', 'height=180']
    const result = {};
    for (const item of tmp) {
        // item: 'name=zhangsan'
        const keyValue = item.split('='); // ['name', 'zhangsan']
        const key = keyValue[0]; // 'name'
        const value = keyValue[1]; // 'zhangsan'
        result[key] = value;
    }
    return result;
}
