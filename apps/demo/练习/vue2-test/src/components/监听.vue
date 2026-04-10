<template>
  <div>
    <input type="text" v-model="value" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    };
  },
  watch: {
    value(newVal) {
      if (newVal === 'hello world') {
        alert('hello world');
      }
    }
  }
  // mounted() {
  //   this.value = 'hello world';
  // },
  // methods: {
  //   onInput(e) {
  //     if (e.target.value === 'hello world') {
  //       alert('hello world');
  //     }
  //   },
  // },
};
</script>

<style></style>
