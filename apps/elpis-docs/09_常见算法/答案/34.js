// <数组&对象&Map练习>统计文件归类
const fileTypeMapping = new Map([
    ['md', 'markdown'],
    ['doc', 'word'],
    ['docx', 'word'],
    ['html', 'web'],
    ['xls', 'excel'],
]);

const input = [
    'js-this.md',
    'vue.docx',
    'js-class.md',
    'react.xixi.doc',
    'mp.xls',
    'fe06.xls',
    'fe06.heihei.xls',
    'index.html',
];

const output = {
    word: [
        'vue.docx',
        'react.xixi.doc',
    ],
    markdown: [
        'js-this.md',
        'js-class.md',
    ],
    excel: [
        'mp.xls',
        'fe06.xls',
        'fe06.heihei.xls',
    ],
    web: [
        'index.html',
    ],
};

function getFileCount(input) {
    const result = {};
    for (const item of input) {
        // item: 'js-this.md' >>> 'md' >>> 'markdown'
        const [suffix] = item.split('.').slice(-1); // ['md']
        const type = fileTypeMapping.get(suffix); // 'markdown'
        if (!result[type]) {
            result[type] = [item];
        } else {
            result[type].push(item);
        }
    }
    return result;
}

function getFileCount(input) {
    return input.reduce((p, c) => {
        // 循环体
        // c: 'js-this.md' >>> 'md' >>> 'markdown'
        const [suffix] = c.split('.').slice(-1); // ['md']
        const type = fileTypeMapping.get(suffix); // 'markdown'
        if (!p[type]) {
            p[type] = [c];
        } else {
            p[type].push(c);
        }
        return p;
    }, {});
}
