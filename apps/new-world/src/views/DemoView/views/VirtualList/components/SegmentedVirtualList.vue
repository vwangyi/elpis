<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick
} from 'vue';

const props = defineProps({
  // 列表数据
  list: {
    type: Array,
    required: true,
    default: () => []
  },
  // 每个列表项的固定高度（px）
  itemHeight: {
    type: Number,
    required: true
  },
  // 每段条数。单段高度 = segmentSize * itemHeight 必须 ≤ maxScrollHeight，
  // 组件会自动向下取整到安全范围内（单段永不超过浏览器滚动上限，因此不会被裁掉）。
  segmentSize: {
    type: Number,
    default: 100000
  },
  // 单段允许的最大高度（浏览器滚动内容上限），用于约束 segmentSize。
  maxScrollHeight: {
    type: Number,
    default: 15000000
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
  // 容器高度（字符串或数字，数字按 px 处理）
  height: {
    type: [String, Number],
    default: '500px'
  }
});

const containerRef = ref(null);
const scrollTop = ref(0); // 当前段内的滚动距离
const containerHeight = ref(0);
const currentSegment = ref(0); // 当前段索引（0 基）

// 实际生效的每段条数：保证单段高度不超浏览器上限
const effectiveSegmentSize = computed(
  () =>
    Math.max(
      1,
      Math.min(
        props.segmentSize,
        Math.floor(
          props.maxScrollHeight /
            props.itemHeight
        )
      )
    )
);

const totalSegments = computed(() =>
  Math.max(
    1,
    Math.ceil(
      props.list.length /
        effectiveSegmentSize.value
    )
  )
);

const segmentStart = computed(
  () =>
    currentSegment.value *
    effectiveSegmentSize.value
);
const segmentEnd = computed(() =>
  Math.min(
    props.list.length,
    segmentStart.value +
      effectiveSegmentSize.value
  )
);
const segmentLength = computed(
  () =>
    segmentEnd.value -
    segmentStart.value
);

// 撑高元素高度：单段 ≤ maxScrollHeight，永远不会触发浏览器裁剪
const phantomHeight = computed(
  () =>
    segmentLength.value *
    props.itemHeight
);
// 当前段内最大可滚动距离
const maxTop = computed(() =>
  Math.max(
    0,
    phantomHeight.value -
      containerHeight.value
  )
);

// 段内虚拟列表索引
const startIndex = computed(() => {
  const idx =
    Math.floor(
      scrollTop.value / props.itemHeight
    ) - props.bufferCount;
  return Math.max(0, idx);
});
const endIndex = computed(() => {
  const idx =
    Math.ceil(
      (scrollTop.value +
        containerHeight.value) /
        props.itemHeight
    ) + props.bufferCount;
  return Math.min(
    segmentLength.value,
    idx
  );
});

// 实际渲染的数据（全局下标 = 段内下标 + segmentStart）
const visibleData = computed(() =>
  props.list.slice(
    segmentStart.value +
      startIndex.value,
    segmentStart.value + endIndex.value
  )
);

// 偏移量（段内无缩放，恒等于 startIndex * itemHeight）
const offsetY = computed(
  () =>
    startIndex.value * props.itemHeight
);

const resolveKey = item =>
  typeof props.itemKey === 'function'
    ? props.itemKey(item)
    : item[props.itemKey];

// —— 跨段切换 ——

// 向上跨段时，程序化设置 scrollTop 会触发一次 scroll 事件，
// 需要用标记屏蔽它，否则会被误判成“到达本段底部”而立即又向下跨段。
let suppressAdvance = false;
let suppressTimer = null;

// 向下跨段：滚动到本段底部后，自动回到顶部并进入下一段
const handleScroll = e => {
  const el = e.currentTarget;
  const top = el.scrollTop;
  scrollTop.value = top;

  if (suppressAdvance) {
    suppressAdvance = false;
    if (suppressTimer) {
      clearTimeout(suppressTimer);
      suppressTimer = null;
    }
    return;
  }

  // 到达本段底部 → 进入下一段（滚动条回到顶部）
  if (
    maxTop.value > 0 &&
    top >= maxTop.value - 1 &&
    currentSegment.value <
      totalSegments.value - 1
  ) {
    currentSegment.value += 1;
    scrollTop.value = 0;
    el.scrollTop = 0; // 同步重置，保证每次只跨一段
  }
  // 最后一段到底后不再前进（真实终点）
};

// 向上跨段：在本段顶部继续向上滚动时，回到上一段底部
const handleWheel = e => {
  const el = containerRef.value;
  if (!el) return;
  if (
    e.deltaY < 0 &&
    el.scrollTop <= 0 &&
    currentSegment.value > 0
  ) {
    currentSegment.value -= 1;
    const targetTop = Math.max(
      0,
      phantomHeight.value -
        containerHeight.value
    );
    scrollTop.value = targetTop; // 先更新逻辑位置，避免闪烁
    if (e.cancelable)
      e.preventDefault(); // 阻止页面被带动滚动
    nextTick(() => {
      suppressAdvance = true; // 屏蔽本次程序化滚动触发的 scroll 事件
      el.scrollTop = targetTop;
      suppressTimer = setTimeout(() => {
        suppressAdvance = false;
        suppressTimer = null;
      }, 60);
    });
  }
};

const updateContainerHeight = () => {
  if (containerRef.value)
    containerHeight.value =
      containerRef.value.clientHeight;
};

let resizeObserver = null;
let wheelListener = null;
onMounted(() => {
  updateContainerHeight();
  if (
    typeof ResizeObserver !==
      'undefined' &&
    containerRef.value
  ) {
    resizeObserver = new ResizeObserver(
      updateContainerHeight
    );
    resizeObserver.observe(
      containerRef.value
    );
  }
  // 用非 passive 监听，以便必要时 preventDefault
  wheelListener = handleWheel;
  containerRef.value?.addEventListener(
    'wheel',
    wheelListener,
    { passive: false }
  );
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (
    wheelListener &&
    containerRef.value
  ) {
    containerRef.value.removeEventListener(
      'wheel',
      wheelListener
    );
  }
  if (suppressTimer)
    clearTimeout(suppressTimer);
});
</script>

<template>
  <div
    class="segmented-virtual-list"
    :style="{
      height:
        typeof height === 'number'
          ? height + 'px'
          : height
    }"
  >
    <div
      ref="containerRef"
      class="virtual-list-container"
      @scroll="handleScroll"
    >
      <!-- 每段撑高元素，高度被限制在浏览器上限以内 -->
      <div
        class="phantom"
        :style="{
          height: phantomHeight + 'px'
        }"
      >
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
            <slot
              name="item"
              :item="item"
            ></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 段进度指示，便于直观确认分段滚动生效 -->
    <div class="segment-badge">
      第 {{ currentSegment + 1 }} /
      {{ totalSegments }} 段 · 共
      {{ list.length }} 条
      <span class="seg-range"
        >（本段
        {{ segmentStart + 1 }}–{{
          segmentEnd
        }}）</span
      >
    </div>
  </div>
</template>

<style scoped>
.segmented-virtual-list {
  position: relative;
}

.virtual-list-container {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.phantom {
  margin: 0;
  padding: 0;
}

.visible-area {
  will-change: transform;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

* {
  box-sizing: border-box;
}

.segment-badge {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 4px 10px;
  font-size: 12px;
  line-height: 1.4;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 999px;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.seg-range {
  opacity: 0.8;
}
</style>
