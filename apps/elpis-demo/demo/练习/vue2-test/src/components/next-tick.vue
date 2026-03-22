<template>
  <span ref="a">
    {{ counter }}
    <button @click="onAdd">+1</button>
  </span>
</template>

<script>
export default {
  data() {
    return {
      counter: 1,
    }
  },
  created() {
    // 发请求
    Promise.resolve(9999).then((res) => {
      this.counter = res
      // 数据更新完成 && DOM渲染完成
      // 本轮此项目所有DOM更新完成
      this.$nextTick(() => {
        // 完成了
        console.log(this.$refs.a.offsetWidth)
        console.log('xixi', document.querySelector('#abc').offsetLeft)
      })
    })
  },
  // mounted() {
  //   console.log('xixi', document.querySelector('#abc').offsetLeft);
  // },
  methods: {
    onAdd() {
      this.counter++
    },
  },
}
</script>

<style></style>
