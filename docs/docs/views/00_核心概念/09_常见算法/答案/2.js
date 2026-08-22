// tiger: <封装函数>转换数组
 

// 输入
const input = [
    {
        label: '标题一',
        id: '1',
        pid: null,
    },
    {
        label: '标题二',
        id: '2',
        pid: null,
    },
    {
        label: '标题3.1',
        id: '3-1',
        pid: '3',
    },
    {
        label: '标题3.1.1',
        id: '3-1-1',
        pid: '3-1',
    },
    {
        label: '标题三',
        id: '3',
        pid: null,
    },
    {
        label: '标题1.1',
        id: '1-1',
        pid: '1',
    },
    {
        label: '标题1.2',
        id: '1-2',
        pid: '1',
    },
    {
        label: '标题2.1',
        id: '2-1',
        pid: '2',
    },
];

function test(input, pid) {
    return input.filter(item => item.pid === pid).map(item => ({...item, children: test(input, item.id)}))
}
test(input, null);

function transformArrayToTree(input, pid = null) {
    return input
        .filter(item => item.pid === pid)
        .map(item => ({
            ...item,
            children: transformArrayToTree(input, item.id),
        }));
}

function tree2Array(tree) {
    for (const node of tree) {
        const { children, ...rest } = node;
        result.push(rest);
        if (children && children.length) {
            tree2Array(children);
        }
    }

    return tree.reduce((prev, curr) => {
        const { children, ...rest } = curr;
        prev.push(rest)
        return prev;
    }, [])
}

// 期待输出
const output = [
    {
        label: '标题一',
        id: '1',
        pid: null,
        children: [
            {
                label: '标题1.1',
                id: '1-1',
                pid: '1',
            },
            {
                label: '标题1.2',
                id: '1-2',
                pid: '1',
            },
        ],
    },
    {
        label: '标题二',
        id: '2',
        pid: null,
        children: [
            {
                label: '标题2.1',
                id: '2-1',
                pid: '2',
            },
        ],
    },
    {
        label: '标题三',
        id: '3',
        pid: null,
        children: [
            {
                label: '标题3.1',
                id: '3-1',
                pid: '3',
                children: [
                    {
                        label: '标题3.1.1',
                        id: '3-1-1',
                        pid: '3-1',
                    },
                ],
            },
        ],
    },
];

function transform(input, pid) {
    return input
        .filter(item => item.pid === pid)
        .map(item => ({
            // label: item.label,
            // id: item.id,
            // pid: item.pid,
            ...item,
            children: transform(input, item.id),
        }));
}

console.log( JSON.stringify(transform(input, null)) );
