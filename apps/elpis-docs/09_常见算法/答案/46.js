// <数组&字符串练习>按照排位分数排序
const input = [
    {
        wxNickName: '张三',
        nickName: '寡人死一次就挂机',
        status: 'online',
        duration: 301241, // 正在游戏的游戏时长: 301241毫秒
        lastLoginTimestamp: 1642940476563, // 上次登录截止时
        rankScore: 1234, // 排位分数
    },
    {
        wxNickName: '李四',
        nickName: '苏州科技大学',
        status: 'offline',
        duration: 0,
        lastLoginTimestamp: 1642940126563,
        rankScore: 281,
    },
    {
        wxNickName: '王五',
        nickName: 'hide on bush',
        status: 'online',
        duration: 225382,
        lastLoginTimestamp: 1642940123000,
        rankScore: 9999,
    },
    {
        wxNickName: '刘六',
        nickName: 'Uz1',
        status: 'offline',
        duration: 0,
        lastLoginTimestamp: 1642940517000,
        rankScore: 128,
    },
];

const output = [
    {
        nickName: 'hide on bush(王五)',
        rankScore: 9999,
    },
    {
        nickName: '寡人死一次就挂机(张三)',
        rankScore: 1234,
    },
    {
        nickName: '苏州科技大学(李四)',
        rankScore: 281,
    },
    {
        nickName: 'Uz1(刘六)',
        rankScore: 128,
    },
];

function getResult(input) {
    return input
        .sort((a, b) => b.rankScore - a.rankScore)
        .map(item => ({
            nickName: `${ item.nickName }(${ item.wxNickName })`,
            rankScore: item.rankScore,
        }));
}
