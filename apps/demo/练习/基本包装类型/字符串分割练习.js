var arr = [
  '2012.12.12',
  '2012.12.12',
  '2012.12.12',
  '2012.12.12',
  '2012.12.12'
];

function transform(arr) {
  var result = [];
  for (var item of arr) {
    // item: '2012.12.12'
    // ['2012', '12', '12']
    var tmp = item.split('.'); // ['2012', '12', '12']
    // '2012': tmp[0]
    // '12': tmp[1]
    // '12': tmp[2]
    var obj = {
      year: tmp[0],
      month: tmp[1],
      day: tmp[2]
    };
    result.push(obj);
  }
  return result;
}

// var result = [
//     {
//         year: '2012',
//         month: '12',
//         day: '12',
//     },
//     {
//         year: '2012',
//         month: '12',
//         day: '12',
//     },
//     {
//         year: '2012',
//         month: '12',
//         day: '12',
//     },
//     {
//         year: '2012',
//         month: '12',
//         day: '12',
//     },
//     {
//         year: '2012',
//         month: '12',
//         day: '12',
//     },
// ];
