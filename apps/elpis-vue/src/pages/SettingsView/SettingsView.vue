<script setup lang="ts">
import {
  onBeforeUnmount,
  ref,
  type Ref
} from 'vue';
import { onMounted } from 'vue';

import {
  useRoute,
  useRouter
} from 'vue-router';

const route = useRoute();
const router = useRouter();
const isFullscreenPlay: Ref<boolean> =
  ref(false); // 是否全屏播放模式

/* 处理路由参数 */
function handleRouteQuery() {
  const { fullscreen } =
    route.query;
  // 如果参数值为 '1' 则设置为 true，否则为 false
  isFullscreenPlay.value =
    fullscreen === '1';
}

/* 页面卸载执行 */
function unmount() {
  // 这里可以执行一些清理工作，例如取消订阅、清除定时器等
  console.log(
    'SettingsView unmounted'
  );
}

/* 页面初始化执行 */
function init() {
  handleRouteQuery();
  onBeforeUnmount(unmount);
}
onMounted(init);

defineExpose({
  init
});
</script>

<template>设置页面</template>
