// <数组&对象练习> 统计各运营商的用户信息
const input = [
    {
        name: 'zhang3',
        tel: '13012341234',
    },
    {
        name: 'li4',
        tel: '13112341234',
    },
    {
        name: 'wang5',
        tel: '13212341234',
    },
    {
        name: 'liul6',
        tel: '13312341234',
    },
    {
        name: 'yu7',
        tel: '13912341234',
    },
    {
        name: 'zhao8',
        tel: '18612341234',
    },
    {
        name: 'sun9',
        tel: '18812341234',
    },
];

// 运营商信息
const operators = [
    {
        name: '移动',
        prefixes: ['134', '135', '136', '137', '138', '139', '187', '188'],
    },
    {
        name: '联通',
        prefixes: ['130', '131', '132', '185', '186'],
    },
    {
        name: '电信',
        prefixes: ['133', '180', '181', '189'],
    },
];

const output = { "移动": [{ "name": "yu7", "tel": "13912341234" }, { "name": "sun9", "tel": "18812341234" }], "联通": [{ "name": "zhang3", "tel": "13012341234" }, { "name": "li4", "tel": "13112341234" }, { "name": "wang5", "tel": "13212341234" }, { "name": "zhao8", "tel": "18612341234" }], "电信": [{ "name": "liul6", "tel": "13312341234" }] };

function getResult(input, operators) {
    const result = {};
    for (const item of input) {
        // item: { name: 'sun9', tel: '18812341234' }
        // 期待得到: '移动'
        // 得到'移动'的时候 发现先需要'188'
        const prefix = item.tel.substring(0, 3); // '188'
        const operator = operators.find(o => o.prefixes.includes(prefix))?.name; // '移动'
        if (!result[operator]) {
            result[operator] = [];
        }
        result[operator].push(item);
    }
    return result;
}

console.log( getResult(input, operators) );
