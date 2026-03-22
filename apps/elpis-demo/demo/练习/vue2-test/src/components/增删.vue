<template>
  <div>
    <input v-model="value" type="text" />
    <button @click="onAdd">新增</button>
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.value }}
        <button @click="onRemove(item.id)">删除</button>
        <!-- <button @click="() => onRemove(i)">删除</button> -->
      </li>
    </ul>
  </div>
</template>

<script>
let idCounter = 1

export default {
  data() {
    return {
      list: [],
      value: '',
    }
  },
  methods: {
    onAdd() {
      this.list.push({
        value: this.value,
        id: idCounter++,
      })
      this.value = ''
    },
    onRemove(id) {
      // const idx = this.list.findIndex(item => item.id === id);
      // this.list.splice(idx, 1);
      this.list = this.list.filter((item) => item.id !== id)
    },
  },
}
</script>
