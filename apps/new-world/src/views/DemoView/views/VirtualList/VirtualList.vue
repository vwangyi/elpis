<script setup>
import VirtualList from './components/VirtualList.vue';

// 500000
// 499995 499995
// 500000 300000 5000000 ( 335544 | 335545)
const data = new Array(500000).fill(0).map((item, i) => {
  return {
    id: i + 1,
    name: `Item ${i + 1}`
  };
});
</script>

<template>
  <div style="height: 500px">
    <!-- 给虚拟列表一个固定高度 -->
    <VirtualList
      :list="data"
      :item-height="50"
      :buffer-count="0"
      item-key="id"
    >
      <template #item="{ item }">
        <div class="custom-item">
          <span>{{ item.name }}</span>
        </div>
      </template>
    </VirtualList>
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
