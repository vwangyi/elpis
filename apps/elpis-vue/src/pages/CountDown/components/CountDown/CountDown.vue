<script setup>
/* 倒计时组件 */
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
const maxMilliseconds = 8640000000; // 最大毫秒数 100天 最大支持 99天23时59分59秒
const timeRemaining = ref(0); // 倒计时时间戳
let intervalId;

/* 获取目标时间并更新 */
async function countDown() {
  const res = '2025-11-21 09:57:00'; // await request.get('xx/xx', {}); // '2025-10-22 12:34:22'

  const targetTimestamp = +new Date(res);
  /* 目标时间只能在 当前时间和 100天后 这个范围之间 */
  if (targetTimestamp >= +new Date() + maxMilliseconds) {
    console.log('最大支持100天');
    return;
  }
  /* 开启 每一秒都实时更新 倒计时时间戳 */
  intervalId = setInterval(() => {
    if (targetTimestamp <= +new Date()) {
      console.log('活动已经结束啦');
      clearInterval(intervalId);
      return;
    }
    timeRemaining.value = targetTimestamp - +new Date();
  }, 1000);
}

/* 天 */
const days = computed(() => {
  if (timeRemaining.value <= 0) return `--`;
  const d = Math.floor(timeRemaining.value / (1000 * 60 * 60 * 24));
  return d <= 9 ? `0${d}` : d;
});
/* 时 */
const hours = computed(() => {
  if (timeRemaining.value <= 0) return `--`;
  const h = Math.floor(
    (timeRemaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  return h <= 9 ? `0${h}` : h;
});

/* 分 */
const minutes = computed(() => {
  if (timeRemaining.value <= 0) return `--`;
  const m = Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60));
  return m <= 9 ? `0${m}` : m;
});

/* 秒 */
const seconds = computed(() => {
  if (timeRemaining.value <= 0) return `--`;
  const s = Math.floor((timeRemaining.value % (1000 * 60)) / 1000);
  return String(s).padStart(2, '0');
});

/* 倒计时结束 清除定时器 */
onBeforeUnmount(() => {
  clearInterval(intervalId);
});

countDown(); // 开始倒计时
</script>

<template>
  <div class="count-down">
    还剩{{ days }}天{{ hours }}时{{ minutes }}分{{ seconds }}秒
  </div>
</template>

<style scoped></style>
