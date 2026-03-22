<template>
  <div id="app">
    <my-table
      :table-props="{
        data: tableData,
        border: true,
        size: 'small',
      }"
      :columns="[
        {
          prop: 'date',
          label: '日期',
          width: 200,
        },
        {
          prop: 'name',
          label: '姓名',
          width: 200,
          custom: true,
        },
        {
          prop: 'address',
          label: '地址',
        },
      ]"
      :pagination-props="{
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 400,
        pageSize: 100,
        pageSizes: [100, 200, 300, 400],
        currentPage,
      }"
      :pagination-events="{
        'current-change': currentChange,
      }"
    >
      <template v-slot:name="scope">
        <el-tag v-if="scope.row.admin" type="success">{{ scope.row.name }}</el-tag>
        <span v-else>{{ scope.row.name }}</span>
      </template>
    </my-table>
  </div>
</template>

<script>
import MyTable from './components/my-table/index.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    MyTable,
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
    }
  },
  methods: {
    currentChange(current) {
      console.log(current)
    },
  },
  created() {
    axios({
      method: 'get',
      url: '/api/users',
    }).then((res) => {
      this.tableData = res.data.data
    })
  },
}
</script>
