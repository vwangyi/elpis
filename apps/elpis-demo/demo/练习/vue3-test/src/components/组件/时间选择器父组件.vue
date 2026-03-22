<script setup>
import TimePicker from './时间选择器组件.vue'
import { ref } from 'vue'

const time = ref(1661505554340)

function onOk(newTime) {
  console.log(newTime)
  time.value = newTime
}

function onSelect(newTime) {
  time.value = newTime
}
</script>

<template>
  <time-picker :value="time" @ok="onOk" @select="onSelect" />
</template>
