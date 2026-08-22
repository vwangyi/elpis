// <数组&原型练习>封装数组去重方法并挂载在原型对象上
// 基础数据类型
Array.prototype.unique = function () {
    // this
    // [1, 2, 2, 3]
    // [1, 2, 3]
    const result = [];
    for (const item of this) {
        // 1, 2, 2
        if (!result.includes(item)) {
            result.push(item);
        }
    }
    return result;
};

Array.prototype.unique = function () {
    return Array.from(new Set(this));
};
