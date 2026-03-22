<script setup>
// defineProps
// 接props
const props = defineProps({
  msg: String,
})
const emits = defineEmits(['fn'])
// vue3: emits => vue2: this.$emit
emits('fn')
</script>

<template>123</template>
