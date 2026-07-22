<template>
  <div class="controlBtns" @mousedown="onMouseDown">
    <div class="closeBtn fa-solid fa-close" @click="closeWindow"></div>
    <div
      class="minimizeBtn fa-solid fa-angle-down"
      @click="minimaizeWindow"
    ></div>
  </div>
</template>

<script setup>
import { ipcRenderer } from 'electron';
// 拖拽逻辑
let offset = null; // 记录用户拖动的偏移值
let isDragging = false; // 记录用户是否正在拖动
function onMouseDown(e) {
  // 进入此分支，说明用户是在最上方按下的鼠标
  // 可以进行拖拽操作
  isDragging = true;
  // 记录当前用户按下鼠标这一刻的 offset 的值
  offset = {
    x: e.screenX - window.screenX,
    y: e.screenY - window.screenY
  };
  document.onmousemove = e => {
    if (isDragging) {
      // 计算窗口新的位置
      const x = e.screenX - offset.x;
      const y = e.screenY - offset.y;
      // 更新窗口位置
      window.moveTo(x, y);
    }
  };
  document.onmouseup = () => {
    // 鼠标抬起的时候，拖拽结束
    isDragging = false;
    offset = null;
    document.onmousemove = null;
    document.onmouseup = null;
  };
}

// 关闭应用
function closeWindow() {
  ipcRenderer.send('closeWindow');
}
// 最小化应用
function minimaizeWindow() {
  ipcRenderer.send('minimaizeWindow');
}
</script>

<style scoped>
.controlBtns {
  width: 100vw;
  height: 30px;
  /* outline: 1px solid; */
  display: flex;
  align-items: center;
  background-color: var(--bg-4);
}

.controlBtns > div {
  width: 14px;
  height: 14px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  margin-left: 8px;
  cursor: pointer;
}

.controlBtns > div:first-child {
  background-color: rgb(237, 26, 26);
  color: rgb(237, 26, 26);
  transition: 0.5s;
}

.controlBtns > div:first-child:hover {
  color: var(--gray2);
}

.controlBtns > div:last-child {
  background-color: rgb(252, 162, 6);
  color: rgb(252, 162, 6);
  transition: 0.5s;
  padding-top: 2px;
}

.controlBtns > div:last-child:hover {
  color: var(--gray2);
}
</style>
