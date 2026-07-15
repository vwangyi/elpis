<script setup>
/* 富文本编辑器 */
import { onMounted, ref, computed, useTemplateRef, inject } from 'vue';

import { useAuthStore } from '@/stores/auth.js';
import { useCategoryStore } from '@/stores/category.js';
import { useNoteStore } from '@/stores/note.js';

import RichEditor from '@/components/RichEditor/RichEditor.vue';
import CardList from '@/components/CardList/CardList.vue';
import ElpisEditor from '@/components/ElpisEditor/ElpisEditor.vue';
// import ElpisVditor from "@/components/editor/editor.vue";
// import ElpisVditor from "@/components/editor1/editor1.vue";
// import ElpisVditor from "@/components/editor2/editor1.vue";

import ElpisDialog from '@/components/ElpisDialog/ElpisDialog.vue';

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const noteStore = useNoteStore();
const categoryList = computed(() => categoryStore.categoryList);
const categoryItem = ref({});
const openDialog = ref(false);

const activeCategoryIndex = ref(0); // 当前选中的分类索引

function handleSelectCategory(item, index) {
  activeCategoryIndex.value = index;
}
const xxx = useTemplateRef('title');

function handleClickCard(item) {
  categoryItem.value = item;
  // 打开详情 弹窗
  openDialog.value = true;
  console.log('点击card', categoryItem.value);
}

const { test } = inject('haha');
onMounted(() => {
  noteStore.findAll();
});
</script>

<template>
  <div class="main-content hide-scrollbar">
    <!-- 导航栏 -->
    <div class="navbar hide-scrollbar">
      <div
        v-for="(item, index) in categoryList"
        :key="item"
        class="nav"
        :class="{
          active: index === activeCategoryIndex
        }"
        @click="handleSelectCategory(item, index)"
      >
        {{ item.title }}
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div class="list">
        <div
          v-for="(item, index) in noteStore.list"
          :key="item"
          class="card"
          :style="{
            backgroundImage: `url(https://picsum.photos/300/417?${index})`
            // backgroundImage: `url(https://source.unsplash.com/featured/300x417?nature)`
          }"
          @click="handleClickCard(item)"
        ></div>
      </div>
    </div>

    <elpis-dialog v-model:open="openDialog">
      <div
        style="
          width: 1100px;
          height: calc(100vh - 40px);
          background-color: aliceblue;
          color: red;
        "
      >
        <elpis-editor
          v-if="openDialog"
          type="update"
          :data="categoryItem"
        ></elpis-editor>
      </div>
    </elpis-dialog>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.navbar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: var(--feeds-width);
  height: 72px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  font-size: 16px;
  overflow-x: auto;
  > .nav {
    height: 40px;
    text-align: center;
    line-height: 40px;
    padding: 0 16px;
    border-radius: 20px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
  }
  > .nav.active {
    background: #141414;
    color: #fff;
    cursor: pointer;
  }
  > .nav:hover {
    background: #141414;
    color: #fff;
    cursor: pointer;
  }
}

.content {
  width: var(--feeds-width);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: var(--verticalGapPx) var(--horizontalGapPx);
  // background-color: #fff;

  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--verticalGapPx) var(--horizontalGapPx);
    padding-bottom: 72px;

    .card {
      width: var(--columnWidth);
      height: 417px;
      background-color: #828a92;
      border-radius: var(--note-card-corner-radius);
      align-self: flex-start;
      cursor: pointer;
      // background-image: url(https://picsum.photos/300/417);
    }
  }
}
</style>
