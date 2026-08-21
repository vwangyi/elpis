// <字符串&正则> 补全句号
const input = 'Alice and bob love program I think so too This is great thanks very much';

const output = 'Alice and bob love program. I think so too. This is great thanks very much.';

// function addPeriod(input) {
//     let result = input[0];
//     for (const letter of input.substring(1)) {
//         // letter: 'l', 'i', ...
//         if (letter.toLowerCase() !== letter) {
//             result = result.trim();
//             result += `. ${ letter }`;
//         } else {
//             result += letter;
//         }
//     }
//     return result + '.';
// }

function addPeriod(input) {
    // return input.replace(空格+大写字母, 句号+空格+大写字母) + '.';
    // return input.replace(空格+大写字母, (空格+大写字母) => 句号+空格+大写字母) + '.';
    // ' I' >>> '. I'
    return input.replace(/ ([A-Z])/g, match => '.' + match) + '.';
}

console.log( addPeriod(input) );
