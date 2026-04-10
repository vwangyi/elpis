<script setup>
import { onMounted, ref, onUnmounted, reactive, computed, watch } from 'vue';
import { isPlayer } from '@/utils/remotePlayerService.js';

// isShowScreenSaver 是否显示屏保
import {
  isShowScreenSaver,
  handleDispatcher,
  handleLifecycle,
  getScreenSaverConfig,
  startScreenSaverCountdown,
  clearScreenSaverCountdown,
  screenSaverData,
  imageVisible,
  timeRemaining,
  activityCountdownTimer,
  activityTimer,
  countdownTimer,
  carouselTimer,
  intervalTime,
  intervalTimeCountdown,
  activeTime,
  imageAnimation,
  clearCarouselCountdown,
  hideScreenSaver,
  screenSaverSwitch
} from '@/components/ScreenSaver/useScreenSaver';

/* 初始化 */
onMounted(async () => {
  const result = await getScreenSaverConfig();
  console.log('擦火腿肠不活到 result', result);
  if (result === true) {
    // 启动进入屏保的定时器
    startScreenSaverCountdown();
    window.JsView?.addEventListener('dispatcher', handleDispatcher);
    window.JsView?.addEventListener('lifecycle', handleLifecycle);
  }
});

/* 监听是否存在播放器 */
watch(
  () => isPlayer.value,
  () => {
    //  '搜索逻辑要一样'
    console.log('监听是否存在播放器', isPlayer.value);
    clearScreenSaverCountdown();
    clearCarouselCountdown();
    hideScreenSaver();
    if (isPlayer.value === false) {
      startScreenSaverCountdown();
    }
  }
);

/* 卸载 */
onUnmounted(() => {
  window.JsView?.removeEventListener('dispatcher', handleDispatcher);
  window.JsView?.removeEventListener('lifecycle', handleLifecycle);
  hideScreenSaver(); // 隐藏屏保
  clearScreenSaverCountdown();
  clearCarouselCountdown();
});
</script>

<template>
  <div
    :style="{
      width: 1920,
      height: 1080,
      zIndex: 99999999999999
    }"
  >
    <!-- 屏保状态 -->
    <div
      v-if="isShowScreenSaver"
      :style="{
        width: 1920,
        height: 1080,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgb(0,0,0)'
      }"
    >
      <!-- 轮播图片容器 -->
      <div
        v-for="(item, index) in screenSaverData"
        :key="index"
        v-show="imageVisible[index] === 1"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          backgroundImage: `url(${item.itemIcon})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: imageAnimation[index]
        }"
        @animationend="event => handleAnimationEnd(event, index)"
      ></div>
    </div>

    <!-- 调试信息 -->
    <div
      v-if="false"
      :style="{
        left: 900,
        position: 'absolute',
        zIndex: 100,
        color: 'red',
        fontSize: 50
      }"
    >
      <div :style="{ top: 50 }">是否存在播放器: {{ isPlayer }}</div>
      <div :style="{ top: 100 }">
        剩余时间: {{ timeRemaining }} / {{ activeTime }} >>>
        {{ activityCountdownTimer === null ? 'null' : activityCountdownTimer }}
        --- {{ activityTimer === null ? 'null' : activityTimer }}
      </div>
      <div :style="{ top: 150 }">
        间隔倒计时: {{ intervalTimeCountdown }} / {{ intervalTime }} >>>
        {{ carouselTimer === null ? 'null' : carouselTimer }} ---
        {{ countdownTimer === null ? 'null' : countdownTimer }}
      </div>
      <div :style="{ top: 200 }">图片数量: {{ screenSaverData.length }}</div>
      <div :style="{ top: 250 }">当前是否显示屏保: {{ isShowScreenSaver }}</div>
      <div :style="{ top: 300 }">当前屏保开关状态: {{ screenSaverSwitch }}</div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fullFadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fullFadeOutHide {
  0% {
    opacity: 1;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes fullFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
