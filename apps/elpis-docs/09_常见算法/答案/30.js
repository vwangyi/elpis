// <数组&对象练习>将店铺数组按人均消费从小到大排序
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
            },
            {
                userCount: 1,
                total: 89,
            },
            {
                userCount: 4,
                total: 188,
            },
        ],
    },
    {
        name: '贵哥羊肉粉',
        orders: [
            {
                userCount: 2,
                total: 34,
            },
            {
                userCount: 1,
                total: 15,
            },
            {
                userCount: 2,
                total: 28,
            },
        ],
    },
    {
        name: '俊哥黄焖鸡',
        avg: 100,
        orders: [
            {
                userCount: 3,
                total: 98,
            },
            {
                userCount: 1,
                total: 24,
            },
            {
                userCount: 1,
                total: 33,
            },
        ],
    },
];

function getAvg(orders) {
    let sum = 0;
    let count = 0;
    for (const order of orders) {
        // order: { userCount: 3, total: 98 }
        sum += order.total;
        count += order.userCount;
    }

    return sum / count;
}

function sort(input) {
    return input
        .sort((a, b) => getAvg(a.orders) - getAvg(b.orders))
        .map(item => item.name);
}

console.log( sort(input) ); // ['羊肉粉', '黄焖鸡', '大碗面']
