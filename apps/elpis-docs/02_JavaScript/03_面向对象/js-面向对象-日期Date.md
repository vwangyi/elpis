# Date

```js
// performance.now() 页面加载到现在的毫秒数  精确到小数点后5位 

/* 写出常见的 日期格式 有哪些 */
const d = +new Date('Tue Jan 10 2023 22:20:00 GMT+0800 (中国标准时间)');
console.log(d )


// 常见的时间格式
// 'Tue Jan 10 2023 22:20:00 GMT+0800 (中国标准时间)'
// '2020/05/20'
// '2020-05-20'
// '2022/5/20 20:30:00'
// '2022-5-20 20:30:00'

// 创建一个Date对象 
const date = new Date() // 默认传入 当前系统时间 
const date1 = new Date(1680411883842) // 可以传入number类型的时间戳   
const date2 = new Date(2023, 3, 2, 13, 9, 4) // 年, 月下标，日期，小时，分钟，秒， 毫秒
const date3 = new Date('Sun Apr 02 2023 12:29:54 GMT+0800 (中国标准时间)') 
const date4 = new Date('December 17, 1995 03:24:00')
const date5 = new Date('1995-12-17T03:24:00')
const date6 = new Date('2023,01,01 12:29:54')  
const date7 = new Date('2023?01,01 12:29:54')   
const date8 = new Date('2023/01/01 12:29:54')
const date9 = new Date('2023-01-01 12:29:54') 

/* 日期对象 转 时间戳的方法 */ 
// 时间戳是 中国时间1970年1月1号早上8点或世界时间1970年1月1号0点 到现在的毫秒数

const time1 = +new Date(); // 最常用 用+号转 
const time2 = new Date().getTime()  
const time3 = new Date().valueOf()   
const time4 = Date.now();
const time5 = Date.parse('2020-5-20 20:20:20') // 不传参数返回NaN 
const time6 = Date.UTC()

new Date().toLocaleString() // '2025/12/3 11:17:16'

/* 实例对象的常用方法 */ 
const year = date.getFullYear();  // 获取时间对象的 年份
const month = date.getMonth() + 1;  // 获取时间对象的 月份
const day =  date.getDate() // 获取时间对象的 几号


date.setDate() // 设置几号
date.setMonth // 设置月份
date.setFullYear // 设置年份 

/* 获取 过去7天 或 未来7天 的日期组成的数组 */
function getLast7Days() {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]); // 格式化为 YYYY-MM-DD
    }
    
    return dates;
}



function getLastMonths(currentDate, monthsCount) {
    const result = [];
    
    // 获取当前日期的年份和月份
    let date = new Date(currentDate);
    
    // 获取过去的每个月日期
    for (let i = 0; i < monthsCount; i++) {
        // 获取年月
        const year = date.getFullYear();
        const month = date.getMonth(); // 获取当前月份（0-11）
        
        // 获取每个月的第一天
        date.setMonth(month - 1);  // 回退1个月
        date.setDate(1); // 设置为该月的第一天
        
        // 获取格式化的日期（yyyy-mm-dd）
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        
        // 将日期添加到结果数组
        result.push(formattedDate);
    }

    return result;
}

// 示例：获取最近12个月的日期
const last12Months = getLastMonths(new Date(), 12);
console.log(last12Months);

/* 曾经遇到的难点. 每天都会产生交易 查询历史交易   获取 闰年 闰月 等等 */
```