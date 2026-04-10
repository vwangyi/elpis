var arr = [
  '2012.12.12',
  '2012.12.12',
  '2012.12.12',
  '2012.12.12',
  '2012.12.12'
];

// 写个函数
function transform(arr) {
  var result = [];
  for (var item of arr) {
    // item: '2012.12.12'
    // 想要的: '2012-12-12'
    // /./代表的是任意字符
    // /\./ 加上反斜杠之后 才是原本的意思
    var str = item.replace(/\./g, '-');
    result.push(str);
  }
  return result;
}

console.log(transform(arr));

// 期待函数返回的数组
// var result = [
//     '2012-12-12',
//     '2012-12-12',
//     '2012-12-12',
//     '2012-12-12',
//     '2012-12-12',
// ];

var arr = [
  '世界亚军你们好',
  '一群2臂，会不会玩？',
  '嘿嘿嘿',
  'cpdd',
  '对面的大傻x，一群2臂'
];

var dangerWords = ['2臂', '傻x'];

function transform(arr) {
  var result = [];
  for (var str of arr) {
    // str: '对面的大傻x，一群2臂'
    var newStr = str;
    // newStr初始值: '对面的大傻x，一群2臂'
    // newStr: 第一轮: '对面的大傻x，一群**'
    // newStr: 第二轮: '对面的大**，一群**'
    for (var word of dangerWords) {
      // word: '2臂', '傻x'
      newStr = newStr.replace(word, '**');
    }
  }
  return result;
}

// 期待输出
/*
    [
        '世界亚军你们好',
        '一群**，会不会玩？',
        '嘿嘿嘿',
        'cpdd',
        '对面的大**',
    ]
 */
