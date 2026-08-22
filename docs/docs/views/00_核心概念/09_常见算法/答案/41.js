// <数组&对象>统计用户数据
const input = [
    {
        username: 'zhangsan',
        starCount: 10,
        content: '嘻嘻嘻',
    },
    {
        username: 'lisi',
        starCount: 122,
        content: '嘿嘿',
    },
    {
        username: 'lisi',
        starCount: 99,
        content: '呵呵',
    },
    {
        username: 'zhangsan',
        starCount: 12,
        content: '哈哈哈',
    },
    {
        username: 'wangwu',
        starCount: 6,
        content: '嗯嗯',
    },
];

const output = {
    starCount: {
        zhangsan: 22,
        lisi: 221,
        wangwu: 6,
    },
    commentCount: {
        zhangsan: 2,
        lisi: 2,
        wangwu: 1,
    },
};

function getTotal(input) {
    const starCount = {};
    const commentCount = {};

    for (const item of input) {

        // 制作starCount
        // 先看有没有'zhangsan'
        if (!starCount[item.username]) {
            starCount[item.username] = item.starCount;
        } else {
            starCount[item.username] += item.starCount;
        }

        if (!commentCount[item.username]) {
            commentCount[item.username] = 1;
        } else {
            commentCount[item.username]++;
        }

    }

    return {
        starCount,
        commentCount,
    };
}

function getTotal(input) {
    const starCount = {};
    const commentCount = {};

    for (const item of input) {
        // 制作starCount
        // 先看有没有'zhangsan'
        const username = item.username;
        if (!starCount[username]) {
            starCount[username] = item.starCount;
            commentCount[username] = 1;
        } else {
            starCount[username] += item.starCount;
            commentCount[username]++;
        }
    }

    return {
        starCount,
        commentCount,
    };
}

console.log( getTotal(input) );
