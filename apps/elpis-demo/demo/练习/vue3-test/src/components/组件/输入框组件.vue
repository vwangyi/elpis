<script setup>
const props = defineProps(['value'])
const emits = defineEmits(['update:value'])

function onChange(e) {
  emits('update:value', e.target.value)
}
</script>

<template>
  <input type="text" :value="props.value" @input="onChange" />
</template>

<style scope></style>
