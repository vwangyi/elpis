// <数组&对象练习>将店铺数组最近1天的订单量从大到小排序
const input = [
    {
        name: '川哥大碗面',
        // order: 订单
        orders: [
            {
                // 用餐人数
                userCount: 3,
                // 订单消费
                total: 151,
                // 订单分数 不评分默认5分
                score: 4,
                // 时间戳
                timestamp: 1642335157082,
            },
            {
                userCount: 1,
                total: 89,
                score: 4.5,
                timestamp: 1642417957082,
            },
            {
                userCount: 4,
                total: 188,
                score: undefined,
                timestamp: 1642299157082,
            },
        ],
    },
    {
        name: '贵哥羊肉粉',
        orders: [
            {
                userCount: 2,
                total: 34,
                score: undefined,
                timestamp: 1642356757082,
            },
            {
                userCount: 1,
                total: 15,
                score: undefined,
                timestamp: 1642360357082,
            },
            {
                userCount: 2,
                total: 28,
                score: undefined,
                timestamp: 1642392757082,
            },
        ],
    },
    {
        name: '俊哥黄焖鸡',
        orders: [
            {
                userCount: 3,
                total: 98,
                score: 5,
                timestamp: 1642410757082,
            },
            {
                userCount: 1,
                total: 24,
                score: undefined,
                timestamp: 1642345957082,
            },
            {
                userCount: 1,
                total: 33,
                score: 4,
                timestamp: 1642399957082,
            },
        ],
    },
];

function sort(input) {
    // to do
    return xxx;
}
