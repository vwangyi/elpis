<template>
  <div>
    <input :type="visible ? 'text' : 'password'" />
    <button @click="onSwitch">眼睛</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    onSwitch() {
      this.visible = !this.visible
    },
  },
}
</script>
