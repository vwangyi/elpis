// <数组&对象练习> 统计每个英雄的平均对局时长 并从小到大排序
const input = [
    {
        wxNickName: '张三',
        nickName: '寡人死一次就挂机',
        status: 'online',
        duration: 301241, // 正在游戏的游戏时长: 301241毫秒
        lastLoginTimestamp: 1642940476563, // 上次登录截止时
        rankScore: 1234, // 排位分数
        matches: [
            {
                timestamp: 1642940126000, // 开局时间
                legend: '鬼畜妖姬', // 使用的英雄
                victory: false, // 是否胜利
                duration: 1200000, // 对局时长
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

const output = [{ "legend": "未来守护者", "avgDuration": 1195000 }, { "legend": "鬼畜妖姬", "avgDuration": 1200000 }, { "legend": "影流之主", "avgDuration": 1219000 }, { "legend": "德邦总管", "avgDuration": 1234000 }, { "legend": "整齐机器人", "avgDuration": 1234000 }, { "legend": "邪恶小法师", "avgDuration": 1234000 }, { "legend": "探险家", "avgDuration": 1234000 }, { "legend": "无双剑姬", "avgDuration": 1245000 }];

// console.log(output);

function getResult(input) {
    const matches = input
        .map(item => item.matches)
        .flat(1);
    const result = [];
    for (const match of matches) {
        // '德邦总管': match.legend
        // 1234000: match.duration
        const current = result.find(item => item.legend === match.legend);
        if (!current) {
            result.push({
                legend: match.legend,
                durationSum: match.duration,
                durationCount: 1,
            });
        } else {
            current.durationSum += match.duration;
            current.durationCount++;
        }
    }

    return result
        .map(item => ({
            legend: item.legend,
            avgDuration: item.durationSum / item.durationCount,
        }))
        .sort((a, b) => a.avgDuration - b.avgDuration);
}

console.log(getResult(input));
