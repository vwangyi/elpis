// <数组&对象&Map练习>统计文件种类的个数
const fileTypeMapping = new Map([
    ['md', 'markdown'],
    ['doc', 'word'],
    ['docx', 'word'],
    ['html', 'web'],
    ['xls', 'excel'],
]);

// const fileTypeMapping = {
//     md: 'markdown',
//     doc: 'word',
//     docx: 'word',
//     html: 'web',
//     xls: 'excel',
// };

const input = [
    'js-this.md',       // 'md'   >> 'markdown'
    'vue.docx',         // 'docx' >> 'word'
    'js-class.md',      // 'md'   >> 'markdown'
    'react.xixi.doc',   // 'doc'  >> 'word'
    'mp.xls',           // 'xls'  >> 'excel'
    'fe06.xls',         // 'xls'  >> 'excel'
    'fe06.heihei.xls',  // 'xls'  >> 'excel'
    'index.html',       // 'html' >> 'web'
];

const output = {
    word: 2,
    markdown: 2,
    excel: 3,
    web: 1,
};

function getFileCount(input) {
    const typeList = input.map(item => {
        // item: 'js-this.md'
        const suffix = item.split('.').slice(-1)[0]; // 'md'
        return fileTypeMapping.get(suffix); // 'markdown'
    });
    const result = {};
    for (const type of typeList) {
        // type: 'markdown'
        if (!result[type]) {
            result[type] = 1;
        } else {
            result[type]++;
        }
    }
    return result;
}

console.log( getFileCount(input) );
