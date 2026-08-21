// <数组练习>数组转换
const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const output = [
    {
        x: 1,
        y: 2,
        z: 3,
    },
    {
        x: 4,
        y: 5,
        z: 6,
    },
    {
        x: 7,
        y: 8,
        z: 9,
    },
    {
        x: 10,
        y: 11,
        z: 12,
    },
    {
        x: 13,
        y: 14,
        z: 15,
    },
];

function transform(input) {
    const result = [];
    for (let i = 0; i < input.length; i += 3) { // 0, 3, 6, 9
        // 0, 1, 2
        // 3, 4, 5
        result.push({
            x: input[i + 0],
            y: input[i + 1],
            z: input[i + 2],
        });
    }
    return result;
}

function transform(input) {
    return new Array(input.length / 3)
        .fill(0)
        .map((_, i) => ({
            x: input[i * 3 + 0],
            y: input[i * 3 + 1],
            z: input[i * 3 + 2],
        }));
}
