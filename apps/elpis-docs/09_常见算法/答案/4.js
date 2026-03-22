// <对象(映射)&数组练习>转换数组

// 已知条件
const mapping = {
    shengjian: '生煎',
    baozi: '灌汤包',
    jiaozi: '水饺',
    burger: '汉堡',
};

// const result = Object.keys(mapping).map(label => ({
//     label: label,
//     value: mapping[label]
// }))
// console.log('result', result)

// 输入
const input = [
    {
        label: 'shengjian',
        value: 'shengjian',
    },
    {
        label: 'baozi',
        value: 'baozi',
    },
    {
        label: 'jiaozi',
        value: 'jiaozi',
    },
    {
        label: 'burger',
        value: 'burger',
    },
];

// 期待输出
const output = [
    {
        label: '生煎',
        value: 'shengjian',
    },
    {
        label: '灌汤包',
        value: 'baozi',
    },
    {
        label: '水饺',
        value: 'jiaozi',
    },
    {
        label: '汉堡',
        value: 'burger',
    },
];

function transform(input, mapping) {
    // item:
    // {
    //     label: 'shengjian',
    //     value: 'shengjian',
    // }
    // mapping['shengjian'] >>> '生煎'
    // item.label >>> 'shengjian'
    return input.map(item => ({
        label: mapping[item.label],
        value: item.value,
    }));
}
