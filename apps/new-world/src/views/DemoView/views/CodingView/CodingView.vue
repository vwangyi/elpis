<script lang="ts" setup>
const test = `
  let a = 1;
  function a() {
    console.log(a);
  }
  console.log(a);
`;
</script>

<template>
  <div>1. 手写 防抖节流</div>
  <div>2. 手写 instanceof原理</div>
  <div>3. 手写 new操作符原理</div>
  <div>4. 手写 call/bind/apply</div>
  <div>5. this指向</div>
  <pre>
  <code>
    {{ test }}
  </code></pre>
</template>
