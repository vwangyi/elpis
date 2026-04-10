// 淡化生命周期
import { useEffect, useState } from 'react';

export default function Lifecycle() {

    // 副作用
    // mounted
    useEffect(() => {
        console.log(document.querySelector('#a'));
    }, []);

    // updated
    useEffect(() => {
        console.log(123);
    });

    return <div id="a">hello world</div>;
}
