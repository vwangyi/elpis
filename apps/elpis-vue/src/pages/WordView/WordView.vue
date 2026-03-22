<script setup>
import { ref } from "vue";
import req from "@/utils/request";

const word = ref("goods");
const audioValue = ref("");

// 处理音频 blob 数据
function handleAudioBlob(audioBlob) {
  // 创建 blob URL
  const audioUrl = URL.createObjectURL(audioBlob);

  // 创建音频元素
  const audio = new Audio(audioUrl);

  // 播放音频
  audio.play().catch(e => console.error("播放失败:", e));

  // 清理资源（重要！）
  audio.addEventListener("ended", () => {
    URL.revokeObjectURL(audioUrl);
  });

  audio.addEventListener("error", () => {
    URL.revokeObjectURL(audioUrl);
  });

  return audio;
}

// http://dict.youdao.com/dictvoice?type=0&audio=goods
async function handleRequest() {
  const res = await req.get("/youdao/dictvoice", {
    query: {
      type: 0,
      audio: word.value
    },
    responseType: "blob"
  });
  console.log("回来了", res);
  handleAudioBlob(res);
  // audioValue.value = URL.createObjectURL(res)
}
</script>

<template>
  <h1>单词发音</h1>
  <a-input v-model:value="word" />
  <a-button @click="handleRequest">发请求</a-button>
  <audio width="200" height="300"></audio>
</template>

<style scoped></style>
