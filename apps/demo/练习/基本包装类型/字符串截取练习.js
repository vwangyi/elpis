var arr = [
  'hello world1',
  'hello world2',
  'hello world3',
  'hello hello world4',
  'hello hello world5'
];

function transform(arr) {
  // to do
  // var str = 'hello world1';
  // console.log( str.substring(9) ); // 'ld1'
  var result = [];
  for (var item of arr) {
    // item: 'hello world1'
    // item: 'hello hello world5'
    var str = item.substring(item.length - 3);
    result.push(str);
  }
  return result;
}

console.log(transform(arr)); // ['ld1', 'ld2', 'ld3', 'ld4', 'ld5']
