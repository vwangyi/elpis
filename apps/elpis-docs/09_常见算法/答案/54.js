// 实现lodash的pull方法
// https://www.lodashjs.com/docs/lodash.pull

function pull(arr, ...values) {
    const result = [];
    for (const item of arr) {
        // item: 1, 2, 3
        if (!values.includes(item)) {
            result.push(item);
        }
    }
    return result;
}

function pull(arr, ...values) {
    return arr.filter(item => !values.includes(item));
}

const arr = [1, 2, 3, 1, 2, 3];
console.log( pull(arr, 2, 3) ); // [1, 1]
