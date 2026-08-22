// <数组方法加强练习>求最大值
const input = [
    1, 2, 3, 4, 5,
    [7, 8, 9, [13, 12]],
]; 
const output = 13;




function getMax(input) {
    return Math.max(...input.flat(Infinity));
}

function getMax(input) {
    return Math.max.apply(this, input.flat(Infinity));
}
