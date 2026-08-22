// <对象&字符串练习>对象转字符串
const input = {
    name: 'zhangsan',
    age: 18,
    sex: 'nan',
};

console.log( Object.keys(input) ); // ['name', 'age', 'sex']

const output = 'name=zhangsan&age=18&sex=nan';
// name=zhangsan
// age=18
// sex=nan

function obj2str(input) {
    return Object
        .keys(input) // ['name', 'age', 'sex']
        .map(key => `${ key }=${ input[key] }`) // 'name' >>> 'name=zhangsan'
        .join('&');
}
