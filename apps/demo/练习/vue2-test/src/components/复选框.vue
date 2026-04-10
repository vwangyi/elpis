<template>
  <div>
    <input
      :class="{
        checked
      }"
      v-model="checked"
      type="checkbox"
      id="a"
    />
    <label
      :class="{
        checked
      }"
      for="a"
    >
      备选项
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false
    };
  }
};
</script>

<style>
input.checked {
  outline: 2px solid red;
}
label.checked {
  color: red;
}
</style>
