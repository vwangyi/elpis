// <数组&对象练习>数组归类
const input = [
    'sz000001',
    'sz000002',
    'sh600001',
    'sh600002',
    'sh600003',
];

const output = {
    sz: ['000001', '000002'],
    sh: ['600001', '600002', '600003'],
};

function transform(input) {
    const result = {};
    // 目标: 拿sz 和000001
    for (const item of input) {
        // item: 'sz000001'
        const exchange = item.substring(0, 2); // 'sz'
        const id = item.substring(2); // '000001'
        if (!result[exchange]) {
            // 如果不存在result.sz 就把result.sz设置为['000001']
            result[exchange] = [id];
        } else {
            // 如果存在result.sz 就给result.sz数组新增一项
            result[exchange].push(id);
        }
    }
    return result;
}
