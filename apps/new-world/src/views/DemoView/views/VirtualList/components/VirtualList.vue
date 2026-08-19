<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  // 列表数据
  list: {
    type: Array,
    required: true
  },
  // 每个列表项的固定高度（px）
  itemHeight: {
    type: Number,
    required: true
  },
  // 可视区域外额外渲染的缓冲数量，防止快速滚动出现白屏
  bufferCount: {
    type: Number,
    default: 5
  },
  // 唯一标识字段名或函数
  itemKey: {
    type: [String, Function],
    default: 'id'
  },
  // 撑高元素（phantom）允许的最大高度。
  // 浏览器对单个滚动容器的内容高度存在上限（Chrome≈33,554,432px，Firefox≈17,895,698px）。
  // 为兼容所有主流浏览器，默认值取一个安全上限；当总高度超过该值时，
  // 组件会自动按比例缩放滚动映射，保证所有数据都能滚动到、底部不会被截掉。
  // 如果明确只运行在 Chrome/Electron 等环境，可把该值调大（如 33000000）以获得更精确的滚动条。
  maxScrollHeight: {
    type: Number,
    default: 15000000
  }
});

// 容器 DOM 引用
const containerRef = ref(null);
// 当前滚动距离（phantom 坐标系）
const scrollTop = ref(0);
// 容器可视高度（H）
const containerHeight = ref(0);

// 理论总高度
const totalHeight = computed(() => props.list.length * props.itemHeight);

// 撑高元素实际渲染高度：不超过浏览器上限，避免被裁剪
const phantomHeight = computed(() =>
  Math.min(totalHeight.value, props.maxScrollHeight)
);

// 滚动映射比例：把 phantom 滚动区间 [0, phantomHeight - H]
// 线性映射到真实内容滚动区间 [0, totalHeight - H]。
// 用「减 H」而不是「totalHeight / phantomHeight」是关键：
// 这样滚动到最底部时 realTop 恰好等于 totalHeight - H，
// 最后一屏数据能被完整显示，不会像朴素缩放那样把底部 (scale-1)*H 截掉。
const scrollRatio = computed(() => {
  const H = containerHeight.value;
  const ph = phantomHeight.value;
  // 内容不足一屏，或无需缩放（总高度未超上限）
  if (ph <= H || totalHeight.value <= ph) return 1;
  return (totalHeight.value - H) / (ph - H);
});

// 真实滚动位置（内容坐标系）
const realTop = computed(() => scrollTop.value * scrollRatio.value);

// 开始索引（向上多渲染 bufferCount 条做缓冲）
const startIndex = computed(() => {
  const idx = Math.floor(realTop.value / props.itemHeight) - props.bufferCount;
  return Math.max(0, idx);
});

// 结束索引（向下多渲染 bufferCount 条做缓冲）
const endIndex = computed(() => {
  const H = containerHeight.value;
  const idx =
    Math.ceil((realTop.value + H) / props.itemHeight) + props.bufferCount;
  return Math.min(props.list.length, idx);
});

// 实际要渲染的数据
const visibleData = computed(() => {
  return props.list.slice(startIndex.value, endIndex.value);
});

// 可见区域偏移量：让首个渲染项出现在正确的屏幕位置
// （包含被滚出视口的上半截部分，保证与滚动位置对齐）
const offsetY = computed(
  () => scrollTop.value + startIndex.value * props.itemHeight - realTop.value
);

// 滚动事件处理
const handleScroll = e => {
  scrollTop.value = e.currentTarget.scrollTop;
};

// 容器高度可能在布局/响应式时变化，监听以确保比例准确
const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight;
  }
};

let resizeObserver = null;
onMounted(() => {
  updateContainerHeight();
  if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
    resizeObserver = new ResizeObserver(updateContainerHeight);
    resizeObserver.observe(containerRef.value);
  }
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

// 暴露给父组件的 key 解析
const resolveKey = item =>
  typeof props.itemKey === 'function'
    ? props.itemKey(item)
    : item[props.itemKey];
</script>

<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    @scroll="handleScroll"
  >
    <!-- 占位元素，用于撑开滚动条，高度被限制在浏览器上限以内 -->
    <div
      class="phantom"
      :style="{
        height: phantomHeight + 'px'
      }"
    >
      <!-- 实际渲染的可视区域列表，通过 translateY 偏移 -->
      <div
        class="visible-area"
        :style="{
          transform: `translateY(${offsetY}px)`
        }"
      >
        <div
          v-for="item in visibleData"
          :key="resolveKey(item)"
          class="list-item"
          :style="{
            height: itemHeight + 'px'
          }"
        >
          <!-- 使用作用域插槽将数据传递给父组件 -->
          <slot
            name="item"
            :item="item"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-list-container {
  /* 或固定高度，如 600px */
  height: 500px;
  overflow-y: auto;
  position: relative;
}

.phantom {
  /* 普通流，高度由行内样式控制，无需额外定位 */
  margin: 0;
  padding: 0;
}

.visible-area {
  /* 提示浏览器优化变换 */
  will-change: transform;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

* {
  /* 高度由父组件传入的 itemHeight 动态控制 */
  box-sizing: border-box;
}
</style>
