



```js

● 红宝书 第18章  
● 
创建 Canvas 数据
// 方法一 html标签方式
<canvas id="canvas1" width="400" height="600"></canvas>
const canvasElement1 = document.getElementById("canvas1")

// 方法二 js方式
const canvasElement2 = document.createElement('canvas')
document.append(body, canvasElement1) // 上树 把canvas挂在dom树上

canvas方法
const ctx = canvas.getContext('2d') // 拿到canvas画布的2d画笔对象 
const webgl = canvas.getContext('webgl'); // 获取 canvas webgl对象 

ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)



/* 1 用两种方式 创建 canvas 画布数据 */

// 红宝书 第18章  

const canvas1 = document.createElement('canvas');
const canvas2 = document.getElementById('canvasid');

// 方法一 html标签方式
<canvas id="canvas1" width="400" height="600"></canvas>
const canvasElement1 = document.getElementById("canvas1")
// 方法二 js方式
const canvasElement2 = document.createElement('canvas')
document.append(body, canvasElement1) // 上树 把canvas挂在dom树上



const ctx = canvas.getContext('2d') // 拿到canvas画布的2d画笔对象 
const webgl = canvas.getContext('webgl'); // 获取 canvas webgl对象 

ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

```