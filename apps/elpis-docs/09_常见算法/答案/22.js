// <数组练习>根据value值找到对应的label
const input = [
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

function getLabel(input, value) {
    // const result = input.find(item => value === item.value);
    // if (!result) {
    //     return null;
    // }
    // return result.label;
    return input.find(item => value === item.value)?.label || null;
}

console.log(getLabel(input, 'shengjian')); // '生煎'
console.log(getLabel(input, 'baozi')); // '灌汤包'
console.log(getLabel(input, 'xixi')); // null
