// <数组&正则练习>转换数组
const input = [
    'zhangsan:zhangsan@163.com',
    'lisi:ls@qq.com',
    'wangwu:wang5@outlook.com',
    'liuliu:liu6@gmail.com',
];

const output = [
    {
        name: 'zhangsan',
        email: 'zhangsan@163.com',
    },
    {
        name: 'lisi',
        email: 'ls@qq.com',
    },
    {
        name: 'wangwu',
        email: 'wang5@outlook.com',
    },
    {
        name: 'liuliu',
        email: 'liu6@gmail.com',
    },
];

function transform(input) {
    return input.map(item => {
        const [name, email] = item.split(':');
        return {
            name,
            email,
        };
    });
}

// 深入理解es6 作者尼古拉斯泽卡斯
