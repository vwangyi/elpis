// <字符串练习>颜色&透明度转rgba
function color2rgba(input) {
    // style: {
    //     opacity: '0.9',
    //     color: '#fe0068',
    // }
    const style = {};
    for (const item of input.split(';')) {
        if (!item) {
            continue;
        }
        const [key, value] = item.trim().split(':'); // key: 'color'  value: ' #ff0000'
        style[key.trim()] = value.trim();
    }

    const a = style.opacity; // 0.9
    const r = parseInt(style.color.substring(1, 3), 16); // 'fe' >>> 254
    const g = parseInt(style.color.substring(3, 5), 16); // '00' >>> 0
    const b = parseInt(style.color.substring(5, 7), 16); // '68' >>> 104

    return `rgba(${ r }, ${ g }, ${ b }, ${ a })`;
}

console.log(color2rgba('color: #ff0000; opacity: 0.5;')); // 'rgba(255, 0, 0, 0.5)'
console.log(color2rgba('color: #fe0068; opacity: 0.9;')); // 'rgba(254, 0, 104, 0.9)'
console.log(color2rgba('opacity: 0.9; color: #fe0068;')); // 'rgba(254, 0, 104, 0.9)'
