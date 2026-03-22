const obj1 = {
  name: 'zs',
  children: [],
}
const obj2 = {
  name: 'zs',
  children: {},
}

/**
 * @param { object | any[] } o1
 * @param { object | any[] } o2
 * @description 判断两值是否相等
 */
function isEqual(o1, o2) {
  // 判断两者构造函数相同(目的是判断类型)
  if (o1.constructor !== o2.constructor) {
    return false
  }
  // 类型一致时判断长度
  if (Object.keys(o1).length !== Object.keys(o2).length) {
    return false
  }
  // 循环
  for (const key in o1) {
    const value1 = o1[key]
    const value2 = o2[key]
    // 只要有一个是基础数据类型 就直接判断
    const isBasicType = (v) => typeof v !== 'object' || !v
    if (isBasicType(value1) || isBasicType(value2)) {
      if (value1 !== value2) {
        return false
      }
    } else {
      // 都是引用类型 就递归
      if (!isEqual(value1, value2)) {
        return false
      }
    }
  }
  return true
}

console.log(isEqual(obj1, obj2))
// console.log(Object.keys(123));

// const arr1 = new Array();
// const arr2 = new Array();
// console.log(arr.constructor);
// const obj = new Object();
// console.log(obj.constructor);

// console.log(`xxx${ [].toString() }xxx`);

// console.log('' == []);
