const arr1 = [
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
        duration: 1200000 // 对局时长
      },
      {
        timestamp: 1642941234000,
        legend: '鬼畜妖姬',
        victory: false,
        duration: 1200000
      },
      {
        timestamp: 1642947126000,
        legend: '鬼畜妖姬',
        victory: false,
        duration: 1200000
      },
      {
        timestamp: 1642949826000,
        legend: '德邦总管',
        victory: true,
        duration: 1234000
      }
    ]
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
        duration: 1190000 // 对局时长
      },
      {
        timestamp: 1642941234000,
        legend: '无双剑姬',
        victory: true,
        duration: 1267000
      },
      {
        timestamp: 1642947126000,
        legend: '未来守护者',
        victory: false,
        duration: 1200000
      },
      {
        timestamp: 1642949826000,
        legend: '无双剑姬',
        victory: true,
        duration: 1234000
      },
      {
        timestamp: 1642949826000,
        legend: '无双剑姬',
        victory: true,
        duration: 1234000
      }
    ]
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
        duration: 1190000 // 对局时长
      },
      {
        timestamp: 1642941234000,
        legend: '影流之主',
        victory: true,
        duration: 1267000
      },
      {
        timestamp: 1642947126000,
        legend: '影流之主',
        victory: false,
        duration: 1200000
      },
      {
        timestamp: 1642949826000,
        legend: '整齐机器人',
        victory: true,
        duration: 1234000
      },
      {
        timestamp: 1642949826000,
        legend: '邪恶小法师',
        victory: true,
        duration: 1234000
      }
    ]
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
        duration: 1234000
      }
    ]
  }
];

function deepClone1(x) {
  return JSON.parse(JSON.stringify(x));
}

function deepClone2(x) {
  // Object / Array: x.constructor
  const result = new x.constructor();
  for (const key in x) {
    const v = x[key]; // 值
    // 如果是基础数据类型
    if (typeof v !== 'object' || !v) {
      result[key] = v;
    } else {
      result[key] = deepClone2(v);
    }
  }
  return result;
}

// const arr2 = deepClone(arr1);
// arr2[0].value = 999;
// console.log(arr1);

console.time('JSON');
for (let i = 0; i < 10000; i++) {
  deepClone1(arr1);
}
console.timeEnd('JSON');

console.time('我写的');
for (let i = 0; i < 10000; i++) {
  deepClone2(arr1);
}
console.timeEnd('我写的');
