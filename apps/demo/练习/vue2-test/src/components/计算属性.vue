<template>
  <div>
    counter1: {{ counter1 }}
    <br />
    counter: {{ counter }}
    <button @click="onAdd">+1</button>
    <button @click="onReduce">-1</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 1
      // counter1: 2,
    };
  },
  // 计算属性
  computed: {
    // 挂在this上 直接使用this.counter1即可
    // 可以认为是只读的
    counter1() {
      return this.counter * 2;
    }
  },
  methods: {
    onAdd() {
      this.counter++;
      // this.counter1 = this.counter * 2;
    },
    onReduce() {
      this.counter--;
      // this.counter1 = this.counter * 2;
    }
  }
};
</script>

<style></style>
