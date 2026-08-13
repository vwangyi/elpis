<script setup>
import SegmentedVirtualList from './components/SegmentedVirtualList.vue';

// 100 万条数据，分成每 10 万一段（共 10 段）
const data = new Array(1000000)
  .fill(0)
  .map((item, i) => {
    return {
      id: i + 1,
      name: `Item ${i + 1}`
    };
  });
</script>

<template>
  <div style="height: 500px">
    <SegmentedVirtualList
      :list="data"
      :item-height="50"
      :segment-size="100000"
      item-key="id"
    >
      <template #item="{ item }">
        <div class="custom-item">
          <span>{{ item.name }}</span>
        </div>
      </template>
    </SegmentedVirtualList>
  </div>
</template>

<style>
.custom-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 50px;
  /* 必须与传入的 itemHeight 一致 */
  border-bottom: 1px solid #eee;
}
</style>
