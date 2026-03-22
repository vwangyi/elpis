<template>
  <ul>
    <li v-for="(item, i) in list" :key="i">
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      list: ['a', 'b', 'c'],
    }
  },
}
</script>
