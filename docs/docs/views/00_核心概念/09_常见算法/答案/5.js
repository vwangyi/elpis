// <对象(映射)&数组练习>转换数组
const mapping = {
    shengjian: '生煎',
    baozi: '灌汤包',
    jiaozi: '水饺',
    burger: '汉堡',
};
// const mapping = {
//     生煎: 'shengjian',
//     灌汤包: 'baozi',
//     水饺: 'jiaozi',
//     汉堡: 'burger',
// };

const input = [
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
    // 反转对象
    const reverseMapping = {};
    for (const key in mapping) {
        // key: 'shengjian'
        // mapping[key]: '生煎'
        reverseMapping[mapping[key]] = key;
    }

    return input.map(item => ({
        label: item.label,
        value: reverseMapping[item.value], // '汉堡': item.value
    }));
}
