<script setup>
import DynamicSegmentedVirtualList from './components/DynamicSegmentedVirtualList.vue';

// 100 万条数据，每条高度各不相同（40~60px）
const data = new Array(400000).fill(0).map((item, i) => {
  return {
    id: i + 1,
    name: `Item ${i + 1}`,
    h: 40 + ((i * 37) % 21) // 40 ~ 60，不定高度
  };
});
</script>

<template>
  <div style="height: 500px">
    <DynamicSegmentedVirtualList
      :list="data"
      :estimated-item-height="60"
      item-key="id"
    >
      <template #item="{ item }">
        <div
          class="custom-item"
          :style="{
            height: item.h + 'px'
          }"
        >
          <span class="idx">#{{ item.id }}</span>
          <span>{{ item.name }}（高 {{ item.h }}px）</span>
        </div>
      </template>
    </DynamicSegmentedVirtualList>
  </div>
</template>

<style>
.custom-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  /* 高度由组件测量（这里用行内 style 控制），不要写死固定值 */
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.custom-item .idx {
  color: #888;
  font-variant-numeric: tabular-nums;
}
</style>
