<template>
  <div>
    <div
      v-for="i in max"
      :class="{
        circle: true,
        active: tmpRate === -1 ? i <= score : i <= tmpRate,
      }"
      :key="i"
      :id="i"
      @click="onMark(i)"
      @mouseenter="onMarkOver(i)"
      @mouseleave="onMarkOut"
    />
  </div>
</template>

<script>
export default {
  // 双向绑定
  model: {
    prop: 'score',
    event: 'change',
  },
  props: {
    score: Number,
    max: Number,
    abc: Number,
  },
  data() {
    return {
      // rate: 4, // 整数
      tmpRate: -1,
      // fullRate: 5,
    }
  },
  methods: {
    onMark(i) {
      // this.rate = i;
      this.$emit('change', i)
      this.$emit('update:abc', i)
    },
    // 鼠标进入
    onMarkOver(i) {
      this.tmpRate = i
    },
    // 鼠标移出
    onMarkOut() {
      this.tmpRate = -1
    },
  },
}
</script>

<style>
.circle {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 1px solid #aaa;
  display: inline-block;
  margin-right: 12px;
}
.circle.active {
  background: yellowgreen;
}
</style>
