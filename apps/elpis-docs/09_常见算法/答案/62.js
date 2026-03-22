// <字符串&正则>
const emailList = [
    '张三: 123456789@qq.com',
    '李四四: 23456789@qq.com',
    '王五: 1910101010@qq.com',
];

const output = [
    {
        name: '张三',
        qq: '123456789',
        email: '123456789@qq.com',
    },
    {
        name: '李四四',
        qq: '23456789',
        email: '23456789@qq.com',
    },
    {
        name: '王五',
        qq: '1910101010',
        email: '1910101010@qq.com',
    },
];

function transform(input) {
    const reg = /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/;
    return input.map(item => {
        const [name] = item.split(':');
        const [email] = reg.exec(item);
        const [qq] = email.split('@');
        return {
            name,
            qq,
            email,
        };
    });
}

console.log( transform(emailList) ); // output
