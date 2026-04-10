<template>
  <div>
    <input type="text" v-model="value" />
    <button @click="getValue">取值</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    };
  },
  methods: {
    getValue(e) {
      // 第一种方式取值
      console.log(this.value);
      // 稳妥的方式
      // console.log(e.target.value);
    }
  }
};
</script>
