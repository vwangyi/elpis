<template>
  <div>
    <!-- size: large / small / mini -->
    <!-- type: primary / danger -->
    <my-button size="large" type="danger" @click="onAbc"> 提交 </my-button>
    <!-- <child-component
      :counterFromParent="123"
      @abc="onAbc"
    /> -->
  </div>
</template>

<script>
// import ChildComponent from './子组件.vue';
import MyButton from './my-button.vue';

export default {
  components: {
    // ChildComponent,
    MyButton
  },
  data() {
    return {
      counter: 1
    };
  },
  methods: {
    onAdd() {
      this.counter++;
    },
    onAbc(msg) {
      console.log(msg);
    }
  }
};
</script>

<style></style>
