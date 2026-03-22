<template>
  <div id="abc">
    <span>{{ counter }}</span>
    <button @click="onAdd">+1</button>
  </div>
</template>

<script>
// let timer = null;
export default {
  data() {
    return {
      msg: 'hello world',
    }
  },
  // beforeCreate() {
  //   console.log('创建前', this.msg);
  // },
  created() {
    // console.log('创建后', this.msg);
    // timer = setInterval(() => {
    //   console.log(1);
    // }, 1000);
  },
  // beforeMount() {
  //   console.log('挂载前', document.querySelector('#abc'));
  // },
  mounted() {
    // 页面初始化的时候 操作DOM
    // console.log('挂载后', document.querySelector('#abc'));
    document.addEventListener('click', this.onClick)
  },
  // beforeUpdate() {
  //   console.log('更新前', document.querySelector('#abc span').innerText);
  // },
  // updated() {
  //   console.log('更新后', document.querySelector('#abc span').innerText);
  // },
  beforeDestroy() {
    // 清空定时器
    // clearInterval(timer);
    // 清除闭包
    // 清除事件监听(document, window)
    document.removeEventListener('click', this.onClick)
    // console.log('销毁前', document.querySelector('#abc'));
  },
  // destroyed() {
  //   console.log('销毁后', document.querySelector('#abc'));
  // },
  data() {
    return {
      msg: 'hello world',
      counter: 1,
    }
  },
  methods: {
    onClick() {
      console.log(123)
    },
    onAdd() {
      this.counter++
    },
  },
}
</script>

<style></style>
