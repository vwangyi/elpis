<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue';
import { useDraggable } from '@vueuse/core';
import { BrowserWindow, app } from 'electron';

console.log('BBrowserWindow', BrowserWindow, app);
const open = ref<boolean>(false);
const modalTitleRef = ref<HTMLElement | null>(null);
const showModal = () => {
  open.value = true;
};
const { x, y, isDragging } = useDraggable(modalTitleRef);
const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef?.value!.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect?.width;
    dragRect.value.bottom = bodyRect.height - titleRect?.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value;
  }
});
</script>
<template>
  <div>
    <div @click="showModal">
      <slot><a-button type="primary">采集影像</a-button></slot>
    </div>
    <a-modal
      ref="modalRef"
      title="采集影像"
      style="top: 50px"
      v-model:open="open"
      @ok="handleOk"
      :width="1000"
      :footer="null"
    >
      <div class="dir">
        <div>影像目录</div>
        <div>采集身份证正面</div>
        <div>采集身份证反面</div>
        <div>采集客户人脸</div>
      </div>

      <div class="shutter"></div>
      <div></div>
    </a-modal>
  </div>
</template>

<style scoped>
.dir {
  width: 200px;
  height: 600px;
  border: 1px solid red;
}
</style>
