<!-- <template>

  <div>
    <my-badge :value="99999" :max="99999">
      <img src="https://img0.baidu.com/it/u=2029936336,3680262465&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500">
    </my-badge>

    <my-badge :value="100" :max="10">
      <button size="small">回复</button>
    </my-badge>
  </div>

</template> -->

<template>
  <div>
    <my-link disabled>
      <img
        src="https://img0.baidu.com/it/u=2029936336,3680262465&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
      />
    </my-link>
    <my-link type="primary">主要链接</my-link>
    <my-link type="danger" :disabled="true">危险链接</my-link>
  </div>
</template>

<script>
// import MyBadge from './作业-未读数量.vue';
import MyLink from './作业-链接.vue';

export default {
  components: {
    // MyBadge,
    MyLink
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style></style>
