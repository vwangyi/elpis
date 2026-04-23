<script setup>
import { ref } from 'vue';

const dataSource = ref([
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
]);

const columns = ref([
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
]);

setTimeout(() => {
  dataSource.value = dataSource.value.map(item => ({
    ...item,
    name: item.name + '1'
  }));
}, 5000);
</script>

<template>
  <a-table :dataSource="dataSource" :columns="columns" />
</template>
