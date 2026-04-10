<template>
  <ul>
    <li v-for="(value, key) in obj" :key="key">
      {{ `${key}:${value}` }}
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        name: 'zs',
        age: 18,
        sex: 'nan'
      }
    };
  },
  methods: {}
};
</script>

<style></style>
