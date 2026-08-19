<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

/*
 * 不定高度（动态高度）分段虚拟列表
 * -------------------------------------------------------------
 * 核心模型（区别于旧版的关键，避免白屏）：
 *   - 位置真源 = (displaySegIndex, containerScrollTop)：当前显示第几段 + 段内滚动距离
 *   - globalTop（视口顶在全局坐标的像素位置）由上面二者推导，仅用于渲染，不作为真源
 *   - 所有「段相关」计算属性都读取 tick，确保高度测量后 segmentsArr 被重建时能重算，不会用过期段
 *   - 跨段切换靠「确定性重算」，不再依赖易失效的 isProgrammatic 标志 + 定时器
 *
 * 其它：
 *   1. 用 ResizeObserver 测量每个渲染出来的 item 真实高度；
 *   2. 用 Fenwick 树（BIT）维护累计高度 / 偏移量，O(logN) 更新与查询；
 *   3. 按累计像素高度切段，每段高度 ≤ maxScrollHeight × 0.9，单段永不超过浏览器滚动上限；
 *   4. 滚到本段底部 → 滚动条回顶，进入下一段；向上滚到顶 → 回到上一段底部；
 *   5. 测量导致高度变化时做滚动锚定：位于当前段视口上方的 item 高度变化，同步修正 containerScrollTop，避免跳动；
 *   6. 分段重建时用全局锚点（视口顶像素位置）精确还原显示位置，不会错位。
 *
 * 注意：estimatedItemHeight 建议取「所有 item 高度的上界」。高估安全，低估可能让某段在测量前短暂超过上限。
 */

// —— Fenwick 树：单点加、前缀和、按前缀和定位（O(logN)）——
class FenwickTree {
  constructor(n, initValue = 0) {
    this.n = n;
    this.tree = new Float64Array(n + 1);
    if (initValue) for (let i = 0; i < n; i++) this.add(i, initValue);
  }
  // 0-based 单点加 delta
  add(i, delta) {
    let x = i + 1;
    while (x <= this.n) {
      this.tree[x] += delta;
      x += x & -x;
    }
  }
  // 前缀和 [0, i) → 即 offsets[i]
  sum(i) {
    let s = 0;
    let x = i;
    while (x > 0) {
      s += this.tree[x];
      x -= x & -x;
    }
    return s;
  }
  // 给定全局位置 pos，返回包含它的 item 下标 i，钳制到 [0, n-1]
  findIndex(pos) {
    if (pos <= 0) return 0;
    let idx = 0;
    let bitMask = 1;
    while (bitMask <= this.n) bitMask <<= 1;
    let accum = 0;
    for (let m = bitMask; m > 0; m >>= 1) {
      const next = idx + m;
      if (next <= this.n && accum + this.tree[next] <= pos) {
        accum += this.tree[next];
        idx = next;
      }
    }
    return idx >= this.n ? this.n - 1 : idx;
  }
}

const props = defineProps({
  list: {
    type: Array,
    required: true
  },
  // 未测量 item 的预估高度（建议取所有 item 高度的上界）
  estimatedItemHeight: {
    type: Number,
    default: 50
  },
  // 单段允许的最大像素高度（浏览器滚动内容上限）
  maxScrollHeight: {
    type: Number,
    default: 15000000
  },
  // 可视区域外额外渲染的缓冲数量
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
const displaySegIndex = ref(0); // 当前显示第几段（位置真源之一）
const containerScrollTop = ref(0); // 当前段内滚动距离（位置真源之二）
const containerHeight = ref(0);

// 非响应式大数据结构（不进 Vue 响应式，避免开销）
let heights = new Float64Array(0);
let bit = null;
let segmentsArr = []; // [[start, end), ...] 每段 item 下标区间
const tick = ref(0); // 高度/分段变化计数，所有段相关计算属性都读它以触发重算

// 段像素目标：留 0.9 倍余量，降低低估导致超限的风险
const SEG_TARGET = computed(() => Math.floor(props.maxScrollHeight * 0.9));

const resolveKey = item =>
  typeof props.itemKey === 'function'
    ? props.itemKey(item)
    : item[props.itemKey];

// 初始化高度表与 Fenwick 树（同步执行，保证首次渲染前 bit 已建好）
function initHeights() {
  const N = props.list.length;
  heights = new Float64Array(N).fill(props.estimatedItemHeight);
  bit = new FenwickTree(N, props.estimatedItemHeight);
  segmentsArr = buildSegments();
  displaySegIndex.value = 0;
  containerScrollTop.value = 0;
  tick.value++;
}

// 按累计像素高度切段：每段高度 ≤ SEG_TARGET
function buildSegments() {
  const N = props.list.length;
  const target = SEG_TARGET.value;
  const segs = [];
  let segStart = 0;
  let acc = 0;
  for (let i = 0; i < N; i++) {
    const h = heights[i];
    if (i > segStart && acc + h > target) {
      segs.push([segStart, i]);
      segStart = i;
      acc = 0;
    }
    acc += h;
  }
  segs.push([segStart, N]);
  return segs;
}

// 给定全局位置，返回所在段下标（读取实时 segmentsArr）
function segmentIndexAt(pos) {
  let lo = 0;
  let hi = segmentsArr.length - 1;
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (bit.sum(segmentsArr[mid][0]) <= pos) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

// —— 段相关 computed（全部读 tick，防止 segmentsArr 重建后用过期段）——
const segments = computed(() => {
  // tick.value;
  return segmentsArr;
});
const totalSegments = computed(() => segments.value.length);
// 钳制，避免 displaySegIndex 越界（重建后段数可能变化）
const currentSegIndex = computed(() =>
  Math.min(
    Math.max(0, displaySegIndex.value),
    Math.max(0, segments.value.length - 1)
  )
);
const currentSeg = computed(
  () => segments.value[currentSegIndex.value] || [0, props.list.length]
);
const segStartOffset = computed(() => bit.sum(currentSeg.value[0]));
const segHeight = computed(() =>
  Math.max(0, bit.sum(currentSeg.value[1]) - segStartOffset.value)
);
const maxTop = computed(() =>
  Math.max(0, segHeight.value - containerHeight.value)
);
// 段内滚动距离（钳制到合法范围）
const localScrollTop = computed(() =>
  Math.min(Math.max(0, containerScrollTop.value), maxTop.value)
);
// 视口顶在全局坐标的像素位置（推导值，仅用于渲染/锚点）
const globalTop = computed(() => segStartOffset.value + localScrollTop.value);

// 当前段内第一个可见 item
const startIndex = computed(() => {
  // tick.value;
  const gi = bit.findIndex(globalTop.value);
  return Math.max(currentSeg.value[0], gi - props.bufferCount);
});
// 当前段内最后一个可见 item（扫描累计高度直到覆盖视口）
const endIndex = computed(() => {
  // tick.value;
  const seg = currentSeg.value;
  const startOff = bit.sum(seg[0]);
  let cum = bit.sum(startIndex.value) - startOff; // 第一个 item 顶部（段内坐标）
  let end = startIndex.value;
  const bottom = localScrollTop.value + containerHeight.value;
  while (end < seg[1] && cum < bottom) {
    cum += heights[end];
    end++;
  }
  return Math.min(seg[1], end + props.bufferCount);
});

const visibleData = computed(() =>
  props.list.slice(startIndex.value, endIndex.value)
);

// 可见区域偏移量：让首个渲染 item 出现在正确屏幕位置。
// 注意：visible-area 是容器内的绝对定位元素，会随滚动一起上移，
// 因此 offsetY = 首个渲染 item 的「段内全局偏移」即可，不要再减 localScrollTop（否则滚动量被减两遍，item 飞出视口）。
const offsetY = computed(
  () => bit.sum(startIndex.value) - segStartOffset.value
);

// 撑高元素高度 = 当前段真实高度（已测量则用真实高度，保证 ≤ 上限）
const phantomHeight = computed(() => segHeight.value);

// 必须在首次渲染前同步初始化
initHeights();

// —— 测量：ResizeObserver 观察每个渲染出来的 item ——
let ro = null;
function setItemRef(el, index) {
  if (el) {
    el.dataset.index = index;
    if (!el.__observed) {
      ro?.observe(el);
      el.__observed = true;
    }
  }
}

let suppressNextScroll = false; // 程序化设置 scrollTop 时，忽略紧接着的那次 scroll 事件（仅用于「向上跨段」兜底）
let rebuildScheduled = false;

function scheduleRebuild() {
  if (rebuildScheduled) return;
  rebuildScheduled = true;
  requestAnimationFrame(() => {
    rebuildScheduled = false;
    // 记录当前视口顶的全局像素位置与所在 item，用于重建后精确还原
    const anchorTop = globalTop.value;
    segmentsArr = buildSegments();
    const newSeg = segmentIndexAt(anchorTop);
    const newStart = bit.sum(segments.value[newSeg][0]);
    const newMaxTop = Math.max(
      0,
      bit.sum(segments.value[newSeg][1]) - newStart - containerHeight.value
    );
    const newLocal = Math.min(Math.max(0, anchorTop - newStart), newMaxTop);
    displaySegIndex.value = newSeg;
    containerScrollTop.value = newLocal;
    tick.value++;
    // 同步 DOM 滚动位置（避免内容跳动）；该次 scroll 事件由 suppressNextScroll 屏蔽
    if (containerRef.value) {
      suppressNextScroll = true;
      containerRef.value.scrollTop = newLocal;
    }
  });
}

// —— 跨段切换 ——
function handleScroll(e) {
  const el = e.currentTarget;
  if (suppressNextScroll) {
    suppressNextScroll = false;
    return;
  }
  const local = el.scrollTop;
  const segIdx = currentSegIndex.value;
  // 向下滚到本段底部 → 进入下一段并把滚动条回顶（回顶后 scrollTop=0，不会再次触发跨段）
  if (local >= maxTop.value - 1 && segIdx < segments.value.length - 1) {
    displaySegIndex.value = segIdx + 1;
    containerScrollTop.value = 0;
    el.scrollTop = 0;
    return;
  }
  containerScrollTop.value = local;
}

const handleWheel = e => {
  const el = containerRef.value;
  if (!el) return;
  // 向上滚到本段顶部 → 回到上一段底部（target == maxTop，会被误判成「到底」，故用 suppressNextScroll 屏蔽）
  if (e.deltaY < 0 && el.scrollTop <= 0 && currentSegIndex.value > 0) {
    const newIdx = currentSegIndex.value - 1;
    const seg = segments.value[newIdx];
    const startOff = bit.sum(seg[0]);
    const h = bit.sum(seg[1]) - startOff;
    const target = Math.max(0, h - containerHeight.value);
    displaySegIndex.value = newIdx;
    containerScrollTop.value = target;
    suppressNextScroll = true;
    el.scrollTop = target;
    if (e.cancelable) e.preventDefault();
  }
};

const updateContainerHeight = () => {
  if (containerRef.value)
    containerHeight.value = containerRef.value.clientHeight;
};

let resizeObserver = null;
let wheelListener = null;
onMounted(() => {
  updateContainerHeight();
  if (containerRef.value)
    containerRef.value.scrollTop = containerScrollTop.value;
  ro = new ResizeObserver(entries => {
    let needAnchor = false;
    let anchorDelta = 0;
    for (const entry of entries) {
      const idx = +entry.target.dataset.index;
      if (Number.isNaN(idx)) continue;
      const h =
        entry.borderBoxSize && entry.borderBoxSize[0]
          ? entry.borderBoxSize[0].blockSize
          : entry.target.offsetHeight;
      if (h > 0 && Math.abs(h - heights[idx]) > 0.5) {
        const delta = h - heights[idx];
        heights[idx] = h;
        bit.add(idx, delta);
        // 滚动锚定：仅当该 item 位于「当前段、视口上方」时，修正段内滚动距离避免跳动
        if (idx >= currentSeg.value[0] && idx < startIndex.value) {
          anchorDelta += delta;
          needAnchor = true;
        }
        tick.value++;
      }
    }
    if (needAnchor && anchorDelta !== 0) {
      containerScrollTop.value = Math.max(
        0,
        containerScrollTop.value + anchorDelta
      );
    }
    scheduleRebuild();
  });
  if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
    resizeObserver = new ResizeObserver(updateContainerHeight);
    resizeObserver.observe(containerRef.value);
  }
  wheelListener = handleWheel;
  containerRef.value?.addEventListener('wheel', wheelListener, {
    passive: false
  });
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  ro?.disconnect();
  ro = null;
  if (wheelListener && containerRef.value) {
    containerRef.value.removeEventListener('wheel', wheelListener);
  }
});

watch(() => props.list.length, initHeights);
</script>

<template>
  <div
    class="dynamic-segmented-virtual-list"
    :style="{
      height: typeof height === 'number' ? height + 'px' : height
    }"
  >
    <div
      ref="containerRef"
      class="virtual-list-container"
      @scroll="handleScroll"
    >
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
            v-for="(item, i) in visibleData"
            :key="resolveKey(item)"
            :ref="el => setItemRef(el, startIndex + i)"
            class="list-item"
          >
            <slot
              name="item"
              :item="item"
            ></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="segment-badge">
      第 {{ currentSegIndex + 1 }} / {{ totalSegments }} 段 · 共
      {{ list.length }} 条
      <span class="seg-range"
        >（本段 {{ currentSeg[0] + 1 }}–{{ currentSeg[1] }}）</span
      >
    </div>
  </div>
</template>

<style scoped>
.dynamic-segmented-virtual-list {
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

.list-item {
  /* 高度由内容决定，组件通过 ResizeObserver 测量 */
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
