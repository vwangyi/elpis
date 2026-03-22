<script setup>
const props = defineProps({
  value: Number, // 1
  step: {
    type: Number,
    default: 1,
  },
})
const emits = defineEmits(['change'])

function onReduce() {
  emits('change', props.value - props.step)
}
function onAdd() {
  emits('change', props.value + props.step)
}
</script>

<template>
  <button @click="onReduce">-</button>
  <input type="text" :value="props.value" />
  <button @click="onAdd">+</button>
</template>

<style scope></style>
