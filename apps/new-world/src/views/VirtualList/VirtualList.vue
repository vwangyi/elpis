<!-- eslint-disable -->
<script setup lang="ts">
/* eslint-disable */
import { ref, computed } from 'vue';
defineProps({
  list: Array
});
const topHeight = ref(0);
const l = computed(() => {
  return new Array(1000000)
    .fill(0)
    .map((item, index) => {
      const height = 70;
      topHeight.value += height;
      return {
        id: index,
        height,
        top: topHeight
      };
    });
});

const cache = 10; // 缓存的项数

function getStartIndex(
  scrollTop: number
) {
  return Math.floor(scrollTop / 70);
}
function getEndIndex(
  scrollTop: number,
  clientHeight: number
) {
  return (
    Math.ceil(clientHeight / 70) +
    getStartIndex(scrollTop)
  );
}
const scrollTopValue = ref(0);
const startIndexValue = ref(-1);
const endIndexValue = ref(-1);

function handleScroll(e: unknown) {
  const { scrollTop, clientHeight } = (
    e as any
  ).currentTarget;
  let startIndex =
    getStartIndex(scrollTop);
  let endIndex = getEndIndex(
    scrollTop,
    clientHeight
  );
  const len = l.value.length;
  // 开始索引-cache是为了上缓存有cache项 最小索引为0
  startIndex = Math.max(
    0,
    startIndex - cache
  );
  // 结束索引+cache是为了下缓存有cache项 最大索引为len。因为slice不包含结束索引 所以不能-1
  endIndex = Math.min(
    len,
    endIndex + cache
  );
  // 每次滚动动态计算触发渲染
  scrollTopValue.value = scrollTop;
  startIndexValue.value = startIndex;
  endIndexValue.value = endIndex;
}
</script>

<template>
  <div
    class="container"
    @scroll="handleScroll"
  >
    <div
      v-for="item in l"
      :key="item.id"
      class="item"
      :style="{
        height: item.height + 'px',
        top: item.top + 'px'
      }"
    ></div>
  </div>
</template>

<style scoped>
.container {
  width: 200px;
  height: 500px;
  border: 1px solid red;
  overflow: auto;
}

.item {
  width: 100%;
  height: 70px;
  border-top: 1px solid blue;
}
</style>
