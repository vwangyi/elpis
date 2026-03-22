<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function handleBeian() {
  window.open("https://beian.miit.gov.cn/");
}
var a = 1;

function handleBeianGongAn() {
  window.open("https://beian.mps.gov.cn/");
}
function toHome() {
  router.push("/");
}
</script>
<template>
  <div class="app-info">
    <div @click="handleBeian">蜀ICP备2025170363号</div>
    <div @click="handleBeianGongAn">粤公网安备44011102484440号</div>
    <div>WeChat: codewy</div>
    <div>Email: codewy@qq.com</div>
    <div @click="toHome">Copyright© 2025-{{ new Date().getFullYear() }} WANGYI</div>
  </div>
</template>

<style lang="scss" scoped>
$fontsize: 10px;
.app-info {
  position: absolute;
  bottom: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  // background-color: #f8f9fa;
  font-size: $fontsize;
  color: #828a92;
  line-height: $fontsize;
  > div {
    border-right: 1px solid #828a92;
    padding: 0 6px;
    cursor: pointer;
  }
  > div:last-child {
    border-right: none;
  }
}
</style>
