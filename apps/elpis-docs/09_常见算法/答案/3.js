// <对象(映射)&数组练习>转换数组

// 输入
const input = [
    '生煎',
    '灌汤包',
    '水饺',
    '汉堡',
];

// 期待输出
const output = [
    {
        label: '生煎',
        value: '生煎',
    },
    {
        label: '灌汤包',
        value: '灌汤包',
    },
    {
        label: '水饺',
        value: '水饺',
    },
    {
        label: '汉堡',
        value: '汉堡',
    },
];

function transform(input) {
    return input.map(item => ({
        label: item,
        value: item,
    }));
}
