// <字符串练习>rgba转颜色&透明度
function rgba2color(input) {
    const [r, g, b, a] = input.substring(5, input.length - 1).split(',');
    // r: '255'  a: '   0.5'
    // '0' >> '00'
    // 'ff' >> '255'
    const transform = str16 => Number(str16).toString(16) < 10 ? `0${ Number(str16).toString(16) }` : Number(str16).toString(16);
    const red = transform(r);
    const green = transform(g);
    const blue = transform(b);
    return `color: #${ red + green + blue }; opacity: ${ a.trim() };`;
}

console.log(rgba2color('rgba(   255,    0,   0,   0.5)')); // 'color: #ff0000; opacity: 0.5;'
console.log(rgba2color('rgba(254, 0, 103, 0.9)')); // 'color: #fe0067; opacity: 0.9;'
