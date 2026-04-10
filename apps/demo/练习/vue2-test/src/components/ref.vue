<template>
  <div ref="abc">
    <span ref="abcd">123</span>
    <my-list ref="list" />
  </div>
</template>

<script>
import MyList from '../components/列表渲染.vue';

export default {
  components: {
    MyList
  },
  mounted() {
    // 不要拿其它人的实例属性/方法
    console.log(this.$refs.list);
  }
};
</script>

<style></style>
