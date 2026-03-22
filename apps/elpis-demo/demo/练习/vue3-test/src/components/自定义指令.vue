<script setup>
const vFocus = {
  mounted: (el) => el.focus(),
}
</script>

<template>
  <input v-focus type="text" />
</template>
