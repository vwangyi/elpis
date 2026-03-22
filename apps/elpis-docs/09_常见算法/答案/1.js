// <封装函数>转换数组

// 输入
const input = {
    shengjian: '生煎',
    baozi: '灌汤包',
    jiaozi: '水饺',
    burger: '汉堡',
};

// 期待输出
const output = [
    {
        label: '生煎',
        value: 'shengjian',
    },
    {
        label: '灌汤包',
        value: 'baozi',
    },
    {
        label: '水饺',
        value: 'jiaozi',
    },
    {
        label: '汉堡',
        value: 'burger',
    },
];

function transform(input) {
    const result = [];
    for (const key in input) {
        // key: shengjian
        // input[key]: 生煎
        result.push({
            label: input[key],
            value: key,
        });
    }
    return result;
}

Array.prototype.reduce1 = function (getNextPrev, initValue) {
    for (let i = 0; i < this.length; i++) {
        // 数组项: this[i]
        // 索引: i
        initValue = getNextPrev(initValue, this[i], i, this);
    }
    return initValue;
};

function transform(input) {
    return Object.keys(input).reduce1((p, key) => {
        return p.concat({
            label: input[key],
            value: key,
        });
    }, []);
}

console.log( transform(input) );
