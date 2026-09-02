// <数组方法加强练习>求最大值
const input = [
    { value: 1 }, // 1
    { value: 2 },
    { value: 3 },
    [
        { value: 11 },
        { value: 22 },
        { value: 33 },
        [
            { value: 111 },
            { value: 222 },
        ],
    ],
];

const output = 222;

function getMax(input) {
    return Math.max(...input.flat(Infinity).map(item => item.value));
}
