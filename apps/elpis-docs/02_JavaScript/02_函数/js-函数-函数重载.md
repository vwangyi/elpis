# 函数重载

- 什么是函数重载



客户端自动更新

websocket  好处：实时性高 缺点：会一直占有服务器资源

轮询：实时性比 websocket 差一点，不会占用服务器资源

```js

// 参数归一化

// 创建函数重载：函数重载是 函数名相同，参数的个数或类型不同。
function createOverload() {
    const map = new Map();

    function overload(...args) {
        const key = args.map(it => typeof it).join(',');
        const fn = map.get(key);
        if (!fn) {
            throw new TypeError('没有找到对应的实现');
        }
        return fn.apply(this, args);
    }

    overload.addImpl = function (...args) {
        const fn = args.pop();
        if (typeof fn !== 'function') {
            throw new TypeError('最后一个参数必须是函数');
        }
        const key = args.join(',');
        map.set(key, fn);
    }
    return overload;
}

const getUsers = createOverload() ;

getUsers.addImpl('xfsfd', () => {
    console.log(23)
})

```

