// <数组&对象(递归)练习>统计点赞数量
const input = [
    {
        username: 'zhangsan',
        starCount: 10,
        content: '感觉不会再爱了',
        timestamp: 1642579353575,
        replies: [
            {
                username: 'lisi',
                starCount: 3,
                content: '感觉不会再爱了',
                timestamp: 1642579354575,
                replies: [],
            },
            {
                username: 'wangwu',
                starCount: 3,
                content: '感觉不会再爱了',
                timestamp: 1642579355575,
                replies: [
                    {
                        username: 'liuliu',
                        starCount: 1,
                        content: '感觉不会再爱了',
                        timestamp: 1642579357575,
                        replies: [],
                    },
                ],
            },
        ],
    },
    {
        username: 'yuqi',
        starCount: 99,
        content: '感觉不会再爱了',
        timestamp: 1642579323575,
        replies: [
            {
                username: 'zhaoqi',
                starCount: 12,
                content: '感觉不会再爱了',
                timestamp: 1642579333575,
                replies: [],
            },
        ],
    },
];

const output = [
    {
        username: 'zhangsan',
        // 总点赞数
        totalStarCount: 17,
        // 评论数
        commentCount: 3,
        content: '感觉不会再爱了',
        timestamp: 1642579353575,
    },
    {
        username: 'yuqi',
        totalStarCount: 111,
        commentCount: 1,
        content: '感觉不会再爱了',
        timestamp: 1642579355575,
    },
];

function totalStar(input) {
    // to do
    return xxx;
}

console.log(totalStar(input));
