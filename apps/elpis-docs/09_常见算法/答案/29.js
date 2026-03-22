// <数组&对象练习>将数组按total值排序
const input = [
    {
        name: '川哥大碗面',
        total: 1234,
    },
    {
        name: '贵哥羊肉粉',
        total: 1511,
    },
    {
        name: '俊哥黄焖鸡',
        total: 809,
    },
];

function sort(input) {
    return input.sort((a, b) => a.total - b.total);
}
