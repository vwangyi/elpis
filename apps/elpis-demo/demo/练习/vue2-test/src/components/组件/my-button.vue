<template>
  <button @click="onClick" :class="`${size} ${type}`">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    size: String, // large / small / mini
    type: String, // primary / danger
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>

<style>
.large {
  font-size: large;
}
.small {
  font-size: small;
}
.mini {
  font-size: 10px;
}
.primary {
  background-color: #00f;
}
.danger {
  background-color: #f00;
}
</style>
