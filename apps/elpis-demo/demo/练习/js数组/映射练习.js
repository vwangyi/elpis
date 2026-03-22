// 已知数组
var nums1 = [1, 2, 3, 4, 5]
var nums2 = [3, 2, 2, 6, 9, 10, 99]

// 期待得到的数组
var result = [3, 4, 6, 24, 45]

function getResult(arr1, arr2) {
  var arrList = [arr1, arr2]
  arrList.sort((a, b) => a.length - b.length) // [短数组, 长数组]
  var short = arrList[0]
  var long = arrList[1]
  return short.map((item, i) => item * long[i])
}

// 参数解构
function getResult(...arrList) {
  // arrList >>> arguments 参数数组
  arrList.sort((a, b) => a.length - b.length) // [短数组, 长数组]
  var short = arrList[0]
  var long = arrList[1]
  return short.map((item, i) => item * long[i])
}

// 知道有这个东西就行(数组解构赋值)
function getResult(...arrList) {
  // arrList >>> arguments 参数数组
  var [short, long] = arrList.sort((a, b) => a.length - b.length) // [短数组, 长数组]
  return short.map((item, i) => item * long[i])
}

function getObjArr(keys, values) {
  return keys.map(function (item, i) {
    return {
      key: item,
      value: values[i],
    }
  })
}

function getObjArr(keys, values) {
  return keys.map((item, i) => ({
    key: item,
    value: values[i],
  }))
}

var keys = ['a', 'b', 'c'] // 'a' >> { key: 'a', value: 1 }
var values = [1, 2, 3]
console.log(getObjArr(keys, values))
/*
    [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
    ]
*/
