// <数组练习>数组转换
const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const output = [
    {
        position: [1, 2, 3],
    },
    {
        position: [4, 5, 6],
    },
    {
        position: [7, 8, 9],
    },
    {
        position: [10, 11, 12],
    },
    {
        position: [13, 14, 15],
    },
];

// 方法1
function transform(input) {
    return new Array(input.length / 3)
        .fill(0)
        .map((_, i) => ({
            position: [
                // 0, 1, 2, 3
                // 0, 3, 6, 9
                input[i * 3 + 0],
                input[i * 3 + 1],
                input[i * 3 + 2],
            ],
        }));
}
