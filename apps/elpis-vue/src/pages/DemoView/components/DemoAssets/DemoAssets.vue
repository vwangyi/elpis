<script setup>
const path = ref('');

import one from './img/1.png';
import two from './img/2.png';
import three from './img/3.png';
// 缺点： 麻烦

async function getUrl(val) {
  await import(
    `./img/${val}.png`
  ); // 返回promise 所以 await
}

/*

    导入静态资源图片的方案
    方案1:  import one from './img/1.png' // 缺点：导入100个 要写100次
    方案2:  import (`./img/${val}.png`)  // 缺点：import动态导入 代码并没有执行 那么脚手架在处理 的时候 会把 img下所有资源 都打包到最终产物里面去  代码没执行 val的值是不确定的 每一个图片都会生成单独的js 会增加网络请求次数
    方案3:  new URL(`./img/${val}.png`, import.meta.url);

*/
async function getUrl1(val) {
  const url = new URL(
    `./img/${val}.png`,
    import.meta.url
  );
}
</script>

<template>
  <div
    class="test"
    :style="`background-image: url(${getUrl(1)}) ;`"
  >
    <button></button>
  </div>
</template>

<style scoped>
.test {
  width: 100vw;
  height: 100vh;
}
</style>
