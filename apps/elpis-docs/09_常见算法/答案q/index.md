
双指针

https://leetcode.cn/problems/fan-zhuan-dan-ci-shun-xu-lcof/


https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/description/


https://leetcode.cn/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/description/

https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/description/


https://leetcode.cn/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/description/

https://leetcode.cn/problems/move-zeroes/description/

https://leetcode.cn/problems/palindrome-linked-list/description/


https://leetcode.cn/problems/minimum-size-subarray-sum/description/

https://leetcode.cn/problems/linked-list-cycle-ii/description/

https://leetcode.cn/problems/linked-list-cycle/description/ 


https://leetcode.cn/problems/valid-palindrome/description/

https://leetcode.cn/problems/merge-sorted-array/description/


https://leetcode.cn/problems/minimum-window-substring/description/


https://leetcode.cn/problems/sort-colors/description/


https://leetcode.cn/problems/rotate-list/description/


https://leetcode.cn/problems/trapping-rain-water/description/

https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/

https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/


https://leetcode.cn/problems/3sum/description/


https://leetcode.cn/problems/container-with-most-water/description/

https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/

双指针



字符串
https://leetcode.cn/problems/ba-zi-fu-chuan-zhuan-huan-cheng-zheng-shu-lcof/description/
https://leetcode.cn/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/description/
https://leetcode.cn/problems/ti-huan-kong-ge-lcof/description/
https://leetcode.cn/problems/valid-palindrome-ii/description/
https://leetcode.cn/problems/valid-parenthesis-string/description/
https://leetcode.cn/problems/palindromic-substrings/description/
https://leetcode.cn/problems/reverse-words-in-a-string-iii/description/
https://leetcode.cn/problems/reverse-words-in-a-string-iii/description/
https://leetcode.cn/problems/next-greater-element-iii/description/
https://leetcode.cn/problems/repeated-substring-pattern/description/
https://leetcode.cn/problems/string-compression/description/
https://leetcode.cn/problems/reverse-string/description/
https://leetcode.cn/problems/reverse-words-in-a-string/description/
https://leetcode.cn/problems/distinct-subsequences/description/
https://leetcode.cn/problems/length-of-last-word/description/
https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/
https://leetcode.cn/problems/longest-common-prefix/description/
https://leetcode.cn/problems/integer-to-roman/description/ 
https://leetcode.cn/problems/zigzag-conversion/description/

字符串


数组
https://leetcode.cn/problems/gou-jian-cheng-ji-shu-zu-lcof/description/
https://leetcode.cn/problems/max-area-of-island/description/
https://leetcode.cn/problems/subarray-sum-equals-k/description/
https://leetcode.cn/problems/rotate-array/description/
https://leetcode.cn/problems/find-peak-element/description/
https://leetcode.cn/problems/merge-intervals/description/
https://leetcode.cn/problems/first-missing-positive/description/
https://leetcode.cn/problems/search-in-rotated-sorted-array/description/
https://leetcode.cn/problems/next-permutation/description/
https://leetcode.cn/problems/two-sum/description/

数组转tree
// 转换前：
source = [{
            id: 1,
            pid: 0,
            name: 'body'
          }, {
            id: 2,
            pid: 1,
            name: 'title'
          }, {
            id: 3,
            pid: 2,
            name: 'div'
          }]
// 转换为: 
tree = [{
          id: 1,
          pid: 0,
          name: 'body',
          children: [{
            id: 2,
            pid: 1,
            name: 'title',
            children: [{
              id: 3,
              pid: 1,
              name: 'div'
            }]
          }
        }]

        function jsonToTree(data) {
  // 初始化结果数组，并判断输入数据的格式
  let result = []
  if(!Array.isArray(data)) {
    return result
  }
  // 使用map，将当前对象的id与当前对象对应存储起来
  let map = {};
  data.forEach(item => {
    map[item.id] = item;
  });
  // 
  data.forEach(item => {
    let parent = map[item.pid];
    if(parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}



arr = [1,2,3,4,5,6,7,8,9,10] 使用 reduce 求和

写出多种 实现类数组转化为数组
Array.prototype.slice.call(arrayLike);
类数组转换为数组的方法有这样几种：

● 通过 call 调用数组的 slice 方法来实现转换

Array.prototype.slice.call(arrayLike);

● 通过 call 调用数组的 splice 方法来实现转换

Array.prototype.splice.call(arrayLike, 0);

● 通过 apply 调用数组的 concat 方法来实现转换

Array.prototype.concat.apply([], arrayLike);

● 通过 Array.from 方法来实现转换

Array.from(arrayLike);
## 实现 add(1)(2)(3)
函数柯里化概念： 柯里化（Currying）是把接受多个参数的函数转变为接受一个单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术。

1）粗暴版
function add (a) {
return function (b) {
    return function (c) {
      return a + b + c;
    }
}
}
console.log(add(1)(2)(3)); // 6

柯里化解决方案
参数长度固定
var add = function (m) {
  var temp = function (n) {
    return add(m + n);
  }
  temp.toString = function () {
    return m;
  }
  return temp;
};
console.log(add(3)(4)(5)); // 12
console.log(add(3)(6)(9)(25)); // 43

对于add(3)(4)(5)，其执行过程如下：

1. 先执行add(3)，此时m=3，并且返回temp函数；
2. 执行temp(4)，这个函数内执行add(m+n)，n是此次传进来的数值4，m值还是上一步中的3，所以add(m+n)=add(3+4)=add(7)，此时m=7，并且返回temp函数
3. 执行temp(5)，这个函数内执行add(m+n)，n是此次传进来的数值5，m值还是上一步中的7，所以add(m+n)=add(7+5)=add(12)，此时m=12，并且返回temp函数
4. 由于后面没有传入参数，等于返回的temp函数不被执行而是打印，了解JS的朋友都知道对象的toString是修改对象转换字符串的方法，因此代码中temp函数的toString函数return m值，而m值是最后一步执行函数时的值m=12，所以返回值是12。

● 参数长度不固定
参数长度不固定

function add (...args) {
    //求和
    return args.reduce((a, b) => a + b)
}
function currying (fn) {
    let args = []
    return function temp (...newArgs) {
        if (newArgs.length) {
            args = [
                ...args,
                ...newArgs
            ]
            return temp
        } else {
            let val = fn.apply(this, args)
            args = [] //保证再次调用时清空
            return val
        }
    }
}
let addCurry = currying(add)
console.log(addCurry(1)(2)(3)(4, 5)())  //15
console.log(addCurry(1)(2)(3, 4, 5)())  //15
console.log(addCurry(1)(2, 3, 4, 5)())  //15

##  实现非负大整数相加
JavaScript对数值有范围的限制，限制如下：
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MAX_SAFE_INTEGER // 9007199254740991
Number.MIN_VALUE // 5e-324
Number.MIN_SAFE_INTEGER // -9007199254740991

如果想要对一个超大的整数(> Number.MAX_SAFE_INTEGER)进行加法运算，但是又想输出一般形式，那么使用 + 是无法达到的，一旦数字超过 Number.MAX_SAFE_INTEGER 数字会被立即转换为科学计数法，并且数字精度相比以前将会有误差。

实现一个算法进行大数的相加：

function sumBigNumber(a, b) {
  let res = '';
  let temp = 0;
  
  a = a.split('');
  b = b.split('');
  
  while (a.length || b.length || temp) {
    temp += ~~a.pop() + ~~b.pop();
    res = (temp % 10) + res;
    temp  = temp > 9
  }
  return res.replace(/^0+/, '');
}
其主要的思路如下：

● 首先用字符串的方式来保存大数，这样数字在数学表示上就不会发生变化
● 初始化res，temp来保存中间的计算结果，并将两个字符串转化为数组，以便进行每一位的加法运算
● 将两个数组的对应的位进行相加，两个数相加的结果可能大于10，所以可能要仅为，对10进行取余操作，将结果保存在当前位
● 判断当前位是否大于9，也就是是否会进位，若是则将temp赋值为true，因为在加法运算中，true会自动隐式转化为1，以便于下一次相加
● 重复上述操作，直至计算结束


## 将数字每千分位用逗号隔开
数字有小数版本：
let format = n => {
    let num = n.toString() // 转成字符串
    let decimals = ''
        // 判断是否有小数
    num.indexOf('.') > -1 ? decimals = num.split('.')[1] : decimals
    let len = num.length
    if (len <= 3) {
        return num
    } else {
        let temp = ''
        let remainder = len % 3
        decimals ? temp = '.' + decimals : temp
        if (remainder > 0) { // 不是3的整数倍
            return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') + temp
        } else { // 是3的整数倍
            return num.slice(0, len).match(/\d{3}/g).join(',') + temp 
        }
    }
}
format(12323.33)  // '12,323.33'

数字无小数版本：
let format = n => {
    let num = n.toString() 
    let len = num.length
    if (len <= 3) {
        return num
    } else {
        let remainder = len % 3
        if (remainder > 0) { // 不是3的整数倍
            return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') 
        } else { // 是3的整数倍
            return num.slice(0, len).match(/\d{3}/g).join(',') 
        }
    }
}
format(1232323)  // '1,232,323'
##  实现字符串翻转

在字符串的原型链上添加一个方法，实现字符串翻转：

String.prototype._reverse = function(a){
    return a.split("").reverse().join("");
}
var obj = new String();
var res = obj._reverse ('hello');
console.log(res);    // olleh

需要注意的是，必须通过实例化对象之后再去调用定义的方法，不然找不到该方法。

## 实现数组的push

## 实现数组的flat方法
function _flat(arr, depth) {
  if(!Array.isArray(arr) || depth <= 0) {
    return arr;
  }
  return arr.reduce((prev, cur) => {
    if (Array.isArray(cur)) {
      return prev.concat(_flat(cur, depth - 1))
    } else {
      return prev.concat(cur);
    }
  }, []);
}
## 实现数组去重
给定某无序数组，要求去除数组中的重复数字并且返回新的无重复数组。

ES6方法（使用数据结构集合）：
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

Array.from(new Set(array)); // [1, 2, 3, 5, 9, 8]
ES5方法：使用map存储不重复的数字
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

uniqueArray(array); // [1, 2, 3, 5, 9, 8]

function uniqueArray(array) {
  let map = {};
  let res = [];
  for(var i = 0; i < array.length; i++) {
    if(!map.hasOwnProperty([array[i]])) {
      map[array[i]] = 1;
      res.push(array[i]);
    }
  }
  return res;
}

## 实现数组的扁平化
（1）递归实现
普通的递归思路很容易理解，就是通过循环递归的方式，一项一项地去遍历，如果每一项还是一个数组，那么就继续往下遍历，利用递归程序的方法，来实现数组的每一项的连接：
let arr = [1, [2, [3, 4, 5]]];
function flatten(arr) {
  let result = [];

  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
flatten(arr);  //  [1, 2, 3, 4，5]
（2）reduce 函数迭代
从上面普通的递归函数中可以看出，其实就是对数组的每一项进行处理，那么其实也可以用reduce 来实现数组的拼接，从而简化第一种方法的代码，改造后的代码如下所示：
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}
console.log(flatten(arr));//  [1, 2, 3, 4，5]

（3）扩展运算符实现
这个方法的实现，采用了扩展运算符和 some 的方法，两者共同使用，达到数组扁平化的目的：
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]

（4）split 和 toString

可以通过 split 和 toString 两个方法来共同实现数组扁平化，由于数组会默认带一个 toString 的方法，所以可以把数组直接转换成逗号分隔的字符串，然后再用 split 方法把字符串重新转换为数组，如下面的代码所示：
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.toString().split(',');
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
通过这两个方法可以将多维数组直接转换成逗号连接的字符串，然后再重新分隔成数组。

（5）ES6 中的 flat

我们还可以直接调用 ES6 中的 flat 方法来实现数组扁平化。flat 方法的语法：arr.flat([depth])

其中 depth 是 flat 的参数，depth 是可以传递数组的展开深度（默认不填、数值是 1），即展开一层数组。如果层数不确定，参数可以传进 Infinity，代表不论多少层都要展开：
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.flat(Infinity);
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
可以看出，一个嵌套了两层的数组，通过将 flat 方法的参数设置为 Infinity，达到了我们预期的效果。其实同样也可以设置成 2，也能实现这样的效果。在编程过程中，如果数组的嵌套层数不确定，最好直接使用 Infinity，可以达到扁平化。

（6）正则和 JSON 方法

在第4种方法中已经使用 toString 方法，其中仍然采用了将 JSON.stringify 的方法先转换为字符串，然后通过正则表达式过滤掉字符串中的数组的方括号，最后再利用 JSON.parse 把它转换成数组：
let arr = [1, [2, [3, [4, 5]]], 6];
function flatten(arr) {
  let str = JSON.stringify(arr);
  str = str.replace(/(\[|\])/g, '');
  str = '[' + str + ']';
  return JSON.parse(str); 
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]




面试真题
最长无重复字符串
深拷贝
LRU列表转树
倒计时组件
并发控制器
随机数抽奖
大数相加
解析url

数组转树  
连续递增数组 
链表 
一个函数返回对象a是否在对象b中存在  
三角形比如输入3 组成三角形最后输出数组

实现 add(1)(2)(3)
promise.all、promise并发请求控制   （字节常考）
大数相加
观察者模式
最长回文字串 (leetcode5)
三数之和 (leetcode15)
有效的括号 (leetcode20)
数组总和 (leetcode39)
全排列 (leetcode46)
算法：求第k大个数
三数之和
判断括号字符串是否有效
合并二维有序数组成一维有序数组
去除字符串中出现次数最少的字符，不改变原字符串的顺序。例:“ababac”一“ababa” ，“aaabbbcceeff”—“aaabbb”、
串联所有字串 (leetcode.30)、
无重复的最常子串 (leetcode3)
最常考  
节流、防抖、数组扁平化 、 比较版本号 、观察者模式、promise.all、实现斐波那契数列、 字符串出现的不重复最长长度、手写lodash, compose合成
代码输出与promise题


数组