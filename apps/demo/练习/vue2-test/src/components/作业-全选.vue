<template>
  <div>
    <!-- 全选 -->
    <label class="all-check-wrapper">
      <span class="all-check">{{ allCheckStatus }}</span>
      <input
        class="all-check-hide"
        type="checkbox"
        @change="onAllCheckChange"
      />
      全选
    </label>

    <label v-for="item in data" :key="item.cityId">
      <input type="checkbox" v-model="item.checked" />
      {{ item.value }}
    </label>
  </div>
</template>

<script>
export default {
  computed: {
    allCheckStatus() {
      // 列表中所有都没选 全选 >>> ''
      // 列表中所有都选中 全选 >>> 'v'
      // 其它           全选 >>> '-'
      if (this.data.every(d => !d.checked)) {
        return '';
      }
      if (this.data.every(d => d.checked)) {
        return 'v';
      }
      return '-';
    }
  },
  methods: {
    // 切换全选
    onAllCheckChange() {
      // if (this.allCheckStatus === 'v') {
      //   this.data = this.data.map(d => ({ ...d, checked: false }));
      // } else {
      //   this.data = this.data.map(d => ({ ...d, checked: true }));
      // }
      this.data = this.data.map(d => ({
        ...d,
        checked: this.allCheckStatus !== 'v'
      }));
    }
  }
};
</script>

<!-- language -->
<style lang="less" scoped>
// js语法的注释
// 1. 嵌套语法, &代表自己
// 2. 声明变量
// 3. 样式复用

@r: red;

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.all-check-wrapper {
  line-height: 1em;

  .all-check {
    width: 12px;
    height: 12px;
    display: inline-block;
    outline: 1px solid blue;
    line-height: 12px;
    text-align: center;
    vertical-align: middle;
    color: @r;
    background: @r;
    .center;

    &:hover {
      outline: 1px solid @r;
    }
  }

  .all-check-hide {
    display: none;
  }
}
</style>
