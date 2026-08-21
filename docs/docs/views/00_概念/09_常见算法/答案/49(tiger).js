// <数组&对象练习>统计英雄胜率并从高到低排序
const input = [
    {
        wxNickName: '张三',
        nickName: '寡人死一次就挂机',
        status: 'online',
        duration: 301241, // 正在游戏的游戏时长(毫秒)
        lastLoginTimestamp: 1642940476563, // 上次登录截止时
        rankScore: 1234, // 排位分数
        matches: [ // 比赛/对局
            {
                timestamp: 1642940126000, // 开局时间
                legend: '鬼畜妖姬', // 使用的英雄
                victory: false, // 是否胜利
                duration: 1200000, // 对局时长(毫秒)
            },
            {
                timestamp: 1642941234000,
                legend: '鬼畜妖姬',
                victory: false,
                duration: 1200000,
            },
            {
                timestamp: 1642947126000,
                legend: '鬼畜妖姬',
                victory: false,
                duration: 1200000,
            },
            {
                timestamp: 1642949826000,
                legend: '德邦总管',
                victory: true,
                duration: 1234000,
            },
        ],
    },
    {
        wxNickName: '李四',
        nickName: '苏州科技大学',
        status: 'offline',
        duration: 0,
        lastLoginTimestamp: 1642940126563,
        rankScore: 281,
        matches: [
            {
                timestamp: 1642940126000, // 开局时间
                legend: '未来守护者', // 使用的英雄
                victory: true, // 是否胜利
                duration: 1190000, // 对局时长
            },
            {
                timestamp: 1642941234000,
                legend: '无双剑姬',
                victory: true,
                duration: 1267000,
            },
            {
                timestamp: 1642947126000,
                legend: '未来守护者',
                victory: false,
                duration: 1200000,
            },
            {
                timestamp: 1642949826000,
                legend: '无双剑姬',
                victory: true,
                duration: 1234000,
            },
            {
                timestamp: 1642949826000,
                legend: '无双剑姬',
                victory: true,
                duration: 1234000,
            },
        ],
    },
    {
        wxNickName: '王五',
        nickName: 'hide on bush',
        status: 'online',
        duration: 225382,
        lastLoginTimestamp: 1642940123000,
        rankScore: 9999,
        matches: [
            {
                timestamp: 1642940126000, // 开局时间
                legend: '影流之主', // 使用的英雄
                victory: true, // 是否胜利
                duration: 1190000, // 对局时长
            },
            {
                timestamp: 1642941234000,
                legend: '影流之主',
                victory: true,
                duration: 1267000,
            },
            {
                timestamp: 1642947126000,
                legend: '影流之主',
                victory: false,
                duration: 1200000,
            },
            {
                timestamp: 1642949826000,
                legend: '整齐机器人',
                victory: true,
                duration: 1234000,
            },
            {
                timestamp: 1642949826000,
                legend: '邪恶小法师',
                victory: true,
                duration: 1234000,
            },
        ],
    },
    {
        wxNickName: '刘六',
        nickName: 'Uz1',
        status: 'offline',
        duration: 0,
        lastLoginTimestamp: 1642940517000,
        rankScore: 128,
        matches: [
            {
                timestamp: 1642949826000,
                legend: '探险家',
                victory: true,
                duration: 1234000,
            },
        ],
    },
];

const output = [{ "nickName": "寡人死一次就挂机", "legends": [{ "legend": "德邦总管", "winRate": "100%" }, { "legend": "鬼畜妖姬", "winRate": "0%" }] }, { "nickName": "苏州科技大学", "legends": [{ "legend": "无双剑姬", "winRate": "100%" }, { "legend": "未来守护者", "winRate": "50%" }] }, { "nickName": "hide on bush", "legends": [{ "legend": "整齐机器人", "winRate": "100%" }, { "legend": "邪恶小法师", "winRate": "100%" }, { "legend": "影流之主", "winRate": "66.7%" }] }, { "nickName": "Uz1", "legends": [{ "legend": "探险家", "winRate": "100%" }] }];

console.log(output);

function getLegends(matches) {
    const result = [];
    for (const match of matches) {
        const current = result.find(item => item.legend === match.legend);
        if (!current) {
            result.push({
                legend: match.legend, // '鬼畜妖姬'
                winCount: match.victory ? 1 : 0,
                totalCount: 1,
            });
        } else {
            // 不管输赢都加
            current.totalCount++;
            // 赢了就加
            match.victory && current.winCount++;
        }
    }
    // 数组项: { legend: '鬼畜妖姬', winCount: 1, totalCount: 3 } >>> { legend: '鬼畜妖姬', winRate: '0%' }
    return result
        .sort((a, b) => (b.winCount / b.totalCount) - (a.winCount / a.totalCount))
        .map(item => ({
            legend: item.legend,
            winRate: (item.winCount / item.totalCount).toFixed(3) * 100 + '%',
        }));
}

function getResult(input) {
    return input.map(item => ({
        nickName: item.nickName,
        legends: getLegends(item.matches),
    }));
}

console.log( getResult(input) );
