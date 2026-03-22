<template>
  <div class="slot-wrapper">
    <div v-if="value > 0" class="count">{{ msg }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    max: {
      type: Number,
      default: Infinity,
    },
  },
  computed: {
    msg() {
      if (this.value > this.max) {
        return `${this.max}+`
      }
      return this.value
    },
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.slot-wrapper {
  display: inline-block;
  position: relative;
}
.count {
  padding: 4px 8px;
  color: white;
  background: red;
  font-size: 14px;
  line-height: 1;
  border-radius: calc(0.5em + 5px);
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(calc(100% - 0.5em - 4px), -50%);
  border: 1px solid white;
  box-sizing: border-box;
}
</style>
