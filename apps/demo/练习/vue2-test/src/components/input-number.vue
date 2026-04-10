<!-- html css js -->
<template>
  <div>
    <button @click="onReduce" :disabled="!reduceAble">-</button>
    <!-- 差值表达式 -->
    <!-- {{ counter }} -->
    <input type="text" v-model.number="counter" @blur="onBlur" />
    <button @click="onAdd" :disabled="!addAble">+</button>
  </div>
</template>

<script>
// 数据驱动DOM
export default {
  data() {
    return {
      counter: 1,
      // 某个变量(与能力有关的)
      reduceAble: false,
      addAble: true
    };
  },
  methods: {
    onAdd() {
      this.counter++;
      // 点击+时 放开-的禁用
      if (this.counter > 1) {
        this.reduceAble = true;
      }
      // 加到顶了
      if (this.counter === 10) {
        this.addAble = false;
      }
    },
    onReduce() {
      // 减到1之后就不能再减了
      this.counter--;
      // 点击-时 放开+的禁用
      if (this.counter < 10) {
        this.addAble = true;
      }
      // 减到底了
      if (this.counter === 1) {
        this.reduceAble = false;
      }
    },
    onBlur() {
      if (this.counter < 1) {
        this.counter = 1;
      }
      if (this.counter > 10) {
        this.counter = 10;
      }

      // 如果小于10就放开+
      if (this.counter < 10) {
        this.addAble = true;
      }
      // 如果大于1就放开-
      if (this.counter > 1) {
        this.reduceAble = true;
      }
      if (this.counter === 1) {
        this.reduceAble = false;
      }
      if (this.counter === 10) {
        this.addAble = false;
      }
    }
  }
  // mounted() {
  //   // div初次渲染完成时 执行的动作
  //   setInterval(() => {
  //     this.counter++;
  //   }, 1000);
  // },
};
</script>

<style></style>
