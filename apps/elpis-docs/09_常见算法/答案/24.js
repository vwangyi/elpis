// <对象(递归)练习>检查数据中是否每一项的value都为true
const input = {
    value: true,
    next: {
        value: true,
        next: {
            value: true,
            next: {
                value: false,
            },
        },
    },
};

function check(input) {
    if (input.next) {
        return input.value && check(input.next);
    }
    return input.value;
}

console.log(check(input)); // false
