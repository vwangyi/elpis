<template>
  <div>
    <el-table v-bind="tableProps" class="my-table">
      <el-table-column
        v-for="(col, i) in columns"
        :key="col.id !== undefined ? col.id : i"
        v-bind="col"
      >
        <template slot-scope="scope">
          <!-- 不自定义 -->
          <span v-if="!col.custom">{{ scope.row[col.prop] }}</span>
          <!-- 自定义 -->
          <slot v-else :name="col.prop" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-if="paginationProps" v-bind="paginationProps" v-on="paginationEvents" />
  </div>
</template>

<script>
export default {
  name: 'MyTable',
  props: {
    // https://element.eleme.cn/#/zh-CN/component/table#table-attributes
    tableProps: {
      type: Object,
      default: () => ({}),
    },
    // ts: ElementTableColumnProps[]
    // https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
    columns: {
      type: Array,
      default: () => [],
    },
    paginationProps: {
      type: Object,
      default: () => undefined,
    },
    paginationEvents: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>

<style scoped>
.my-table {
  width: 100%;
}
</style>
