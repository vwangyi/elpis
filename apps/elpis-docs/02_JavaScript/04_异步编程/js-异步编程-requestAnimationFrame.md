# requestAnimationFrame


requestAnimationFrame 是es6新增的钩子 会在渲染任务执行之前 调用 

```html 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="change" style="border: 1px solid red">change</div>
    <script>
        function delay(time) {
            const start = +new Date();
            while(+new Date() - start < time) {};
        }
        const btn = document.querySelector('#change'); 
        btn.addEventListener('click', () => { 
            btn.style.width = '100px'
            btn.style.height = '100px'
            btn.style.border = '1px solid red'
            btn.style.backgroundColor = 'red';
            requestAnimationFrame(() => { 
                console.log('requestAnimationFrame') 
                delay(3000) // 页面卡顿3秒 才执行渲染
            })

            /* 渲染任务执行阶段 */

            // 宏任务
            setTimeout(() => {
                delay(3000) // 页面渲染后等待3秒 才输出 'setTimeout1' 
                console.log('setTimeout1')  
                btn.style.border = '1px solid blue'
                btn.style.backgroundColor = 'blue';
            }) 


            setTimeout(() => { 
                delay(3000) // 页面渲染后等待3秒 才输出 'setTimeout2' 
                console.log('setTimeout2') 
                btn.style.border = '1px solid yellow'
                btn.style.backgroundColor = 'yellow';
            })

            requestIdleCallback(() => { 
                console.log('requestIdleCallback2') 
            })
        })
    </script>
</body>
</html>
```