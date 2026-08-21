// <数组方法加强练习>求最大值
const input = [
    { value: 1 }, // 1
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 7 },
    { value: 4 },
];

const output = 7;

function getMax(input) {
    return Math.max(...input.map(item => item.value));
}
