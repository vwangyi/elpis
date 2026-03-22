// <数组&对象练习>数组归类
const input = [
    'sz000001',
    'sz000002',
    'sh600001',
    'sh600002',
    'sh600003',
];

const output = [
    {
        id: '000001',
        exchange: 'sz',
    },
    {
        id: '000002',
        exchange: 'sz',
    },
    {
        id: '600001',
        exchange: 'sh',
    },
    {
        id: '600002',
        exchange: 'sh',
    },
    {
        id: '600003',
        exchange: 'sh',
    },
];

function transform(input) {
    return input.map(item => ({
        id: item.substring(2),
        exchange: item.substring(0, 2),
    }));
}
