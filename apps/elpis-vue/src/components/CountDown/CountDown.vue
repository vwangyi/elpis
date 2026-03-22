<script setup>
/* 倒计时组件 */
import { ref, computed, onBeforeUnmount } from "vue";

const maxMilliseconds = 8640000000; // 最大毫秒数 100天 最大支持 99天23时59分59秒
const timeRemaining = ref(0); // 倒计时时间戳

/* 获取当前时间戳：本地系统时间可能被恶意修改，所以获取服务器的当前时间 然后减去网络请求的耗时 以求更精准 */
const currentTimestamp = (async () => {
  const start = performance.now();
  // 模拟请求服务器时间
  const serverTime = await new Promise(resolve => {
    setTimeout(() => {
      resolve(+new Date()); // 假设服务器返回的时间戳
    }, 100); // 模拟网络延迟 100ms
  });
  const end = performance.now();
  const timeDelta = end - start; // 网络请求耗时

  return serverTime + timeDelta / 2; // 返回更精准的当前时间戳
})();

// /* 天 */
// const days = computed(() => {
//     if (timeRemaining.value <= 0) return `--`;
//     const d = Math.floor(timeRemaining.value / (1000 * 60 * 60 * 24));
//     return d <= 9 ? `0${d}` : d;
// });

// /* 时 */
// const hours = computed(() => {
//     if (timeRemaining.value <= 0) return `--`;
//     const h = Math.floor((timeRemaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     return h <= 9 ? `0${h}` : h;
// });

// /* 分 */
// const minutes = computed(() => {
//     if (timeRemaining.value <= 0) return `--`;
//     const m = Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60));
//     return m <= 9 ? `0${m}` : m;
// });

// /* 秒 */
// const seconds = computed(() => {
//     if (timeRemaining.value <= 0) return `--`;
//     const s = Math.floor((timeRemaining.value % (1000 * 60)) / 1000);
//     return s <= 9 ? `0${s}` : s;
// });

/* 获取目标时间并更新 */
async function countDown() {
  const res = "2025-11-31 09:57:00"; // await request.get('xx/xx', {}); // '2025-10-22 12:34:22'

  const targetTimestamp = +new Date(res);
  /* 目标时间只能在 当前时间和100天后 这个范围之间 */
  if (targetTimestamp >= +new Date() + maxMilliseconds) {
    console.log("最大支持100天");
    return;
  }

  /* 开启 每一秒都实时更新 倒计时时间戳 */
  requestAnimationFrame(countDown);
}

requestAnimationFrame(countDown); // 获取目标时间并进行倒计时
</script>

<template>
  <div class="count-down">
    <div class="time">
      <div class="box bg days">{{ days }}天</div>
      <div class="box bg hours">{{ hours }}时</div>
      <div class="box bg minutes">{{ minutes }}分</div>
      <div class="box bg seconds">{{ seconds }}秒</div>
    </div>
  </div>
</template>

<style scoped></style>
