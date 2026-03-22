<template>
  <span class="link-wrapper">
    <span v-if="disabled" class="mask" />
    <a
      :class="{
        link: true,
        [type]: true,
      }"
      href=""
    >
      <slot />
    </a>
  </span>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default',
    },
    disabled: Boolean,
  },
}
</script>

<style lang="less" scoped>
.link-wrapper {
  display: inline-block;
  position: relative;
  margin: 20px;
}
.mask {
  background: rgba(255, 255, 255, 0.7);
  display: inline-block;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: not-allowed;
}
.link {
  text-decoration: none;

  &.default {
    color: #333;
  }

  &.primary {
    color: #00eeff;
  }

  &.danger {
    color: red;
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>
