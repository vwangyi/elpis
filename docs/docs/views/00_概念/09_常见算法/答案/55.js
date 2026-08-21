// 实现lodash的omit方法
// https://www.lodashjs.com/docs/lodash.omit

function omit(obj, props) {
    const result = {};
    for (const key in obj) {
        // key: 'a', 'b', 'c'
        if (!props.includes(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}

function omit(obj, props) {
    // ['a', 'b', 'c']
    return Object.keys(obj).reduce((p, key) => {
        if (!props.includes(key)) {
            p[key] = obj[key];
        }
        return p;
    }, {});
}

const o = { a: 1, b: '2', c: 3 };
console.log( omit(o, ['a', 'c']) ); // { 'b': '2' }
