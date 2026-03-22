// <数组&对象练习>统计最擅长的英雄
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

const output = [
    {
        nickName: '寡人死一次就挂机',
        goodAt: '鬼畜妖姬',
    },
    {
        nickName: '苏州科技大学',
        goodAt: '无双剑姬',
    },
    {
        nickName: 'hide on bus',
        goodAt: '影流之主',
    },
    {
        nickName: 'Uz1',
        goodAt: '探险家',
    },
];

function getGoodAt(matches) {
    const count = {
        // 鬼畜妖姬: 3,
        // 德邦总管: 1,
    };
    for (const match of matches) {
        // 鬼畜妖姬: match.legend
        if (!count[match.legend]) {
            count[match.legend] = 1;
        } else {
            count[match.legend]++;
        }
    }
    return Object.keys(count).sort((a, b) => count[b] - count[a])[0];
}

function getResult(input) {
    return input.map(item => ({
        nickName: item.nickName,
        goodAt: getGoodAt(item.matches),
    }));
}

console.log( getResult(input) );
