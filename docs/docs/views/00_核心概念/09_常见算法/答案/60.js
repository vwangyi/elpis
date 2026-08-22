// 实现lodash中unary函数
// https://www.lodashjs.com/docs/lodash.unary

// 装饰者模式
function unary(cb) {
    return function (a) {
        cb(a);
    };
}

function unary(cb) {
    return a => cb(a);
}

const f1 = (a, b, c) => {
    console.log(a);
    console.log(b);
    console.log(c);
};

const fn = unary(f1);

fn(1, 2, 3); // 1, undefined, undefined
