// <数组&对象练习>数组归类
const input = [
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

const output = {
    sz: ['000001', '000002'],
    sh: ['600001', '600002', '600003'],
};

function transform(input) {
    const result = {};
    for (const item of input) {
        // item: { id: '600002', exchange: 'sh' }
        if (!result[item.exchange]) { // item.exchange: 'sh'
            result[item.exchange] = [item.id]; // result.sh = ['600002']
        } else {
            result[item.exchange].push(item.id);
        }
    }
    return result;
}
