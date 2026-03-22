// 实现lodash的findKey方法
// https://www.lodashjs.com/docs/lodash.findKey

function findKey(obj, getCondition) {
    return Object.keys(obj).find(k => getCondition(obj[k]));
}

const users = {
    'barney': { 'age': 36, 'active': true },
    'fred': { 'age': 40, 'active': false },
    'pebbles': { 'age': 1, 'active': true }
};

console.log( findKey(users, function (o) { return o.age < 40; }) ); // 'barney'
