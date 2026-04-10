<template>
  <div>
    <span v-if="visible">hello world!</span>
    <button @click="hide">
      {{ visible ? '隐藏' : '显示' }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true
    };
  },
  methods: {
    hide() {
      this.visible = !this.visible;
    }
  }
};
</script>
