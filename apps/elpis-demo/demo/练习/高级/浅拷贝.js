const arr1 = [{ value: 1 }, { value: 2 }, { value: 3 }]
// 浅拷贝
// const arr2 = [...arr1];
// const arr2 = arr1.concat();
const arr2 = arr1.map((item) => {
  item.value *= 2
  return item
})
// const arr2 = arr1.filter(item => {
//     item.name = 'zs';
//     return item.value > 0;
// });
// 原生js 没有深拷贝
// 全是浅拷贝

// arr2[0].value = 999;

console.log(arr1)
console.log(arr2)
