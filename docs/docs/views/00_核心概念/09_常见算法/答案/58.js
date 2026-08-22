// <数组&字符串> 找出数组中单词最多的句子
const input = [
    'Alice and bob love program',
    'I think so too',
    'This is great thanks very much',
];

const output = 'this is great thanks very much';

function getWordsCount(sentence) {
    return sentence.split(' ').length;
}

function findMostWordsSentence(input) {
    return input.sort((a, b) => getWordsCount(b) - getWordsCount(a))[0]?.toLowerCase();
}

console.log( findMostWordsSentence(input) );
