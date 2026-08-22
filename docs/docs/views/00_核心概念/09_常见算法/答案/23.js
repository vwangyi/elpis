// <数组&对象(递归)练习>检查数据中是否每一项的value都为true
const input = [
    {
        value: true,
    },
    {
        value: true,
    },
    {
        value: true,
        children: [
            {
                value: true,
            },
            {
                value: true,
                children: [
                    {
                        value: true,
                    },
                    {
                        value: false,
                    },
                ],
            },
        ],
    },
];

function check(input) {
    return input.every(item => {
        if (item.children) {
            return item.value && check(item.children);
        }
        return item.value;
    });
}

function check(input) {
    return input.every(item => item.value && check(item.children || []));
}

function check(input) {
    for (const item of input) {
        // item: { value: true / false }
        // 如果item.value为假  或者  item.children中有一个为假
        if (!item.value || !check(item.children || [])) {
            return false;
        }
    }
    return true;
}

console.log(check(input)); // false
