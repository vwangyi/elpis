<template>
  <div>
    <slot />
    {{ counterFromParent }}
  </div>
</template>

<script>
export default {
  // 三个地方的数据 可响应
  // data, computed, props
  // props: ['counterFromParent'],

  props: {
    counterFromParent: Number,
    abc: Function
    // counterFromParent: {
    //   type: Number,
    //   default: 1,
    // },
  },
  data() {
    return {
      // 自己的状态
      msg: 'hello world'
    };
  },
  mounted() {
    // vue调用传下来的事件
    // this.$emit('abc', this.msg);
    this.abc(this.msg);
  }
};
</script>

<style></style>
