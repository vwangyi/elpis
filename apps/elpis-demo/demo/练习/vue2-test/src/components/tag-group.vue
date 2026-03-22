<template>
  <div>
    <div v-for="(item, i) in data" class="tag" :key="i">
      {{ item }}
      <div class="close" @click="onClose(i)">x</div>
    </div>

    <div v-if="!editing" class="add-btn" @click="onFocus">+ New Tag</div>
    <div v-else class="add-input-wrapper with-outline">
      <input v-focus type="text" class="add-input" @blur="onBlur" @keyup.enter="onEnter" />
    </div>
    <!-- <input class="add-input" type="text"> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: ['asdasdnj', 'dwakuhdawhu', 'ewayu'],
      editing: false,
    }
  },
  methods: {
    onClose(i) {
      this.data.splice(i, 1)
    },
    onFocus() {
      // 数据更新
      this.editing = true
      // this.$nextTick(() => {
      //   this.$refs.a.focus();
      // });

      // console.log(this.$refs.a);
    },
    onBlur(e) {
      if (e.target.value.trim()) {
        this.data.push(e.target.value)
      }
      this.editing = false
    },
    onEnter(e) {
      e.target.blur()
    },
  },
}
</script>

<style>
.tag {
  display: inline-flex;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d9ecff;
  background-color: #ecf5ff;
  color: #409eff;
  margin-right: 16px;
  align-items: center;
}
.tag .close {
  margin-left: 4px;
  border-radius: 50%;
  height: 16px;
  width: 16px;
  color: #409eff;
  line-height: 16px;
  text-align: center;
  user-select: none;
}
.tag .close:hover {
  background: #409eff;
  color: white;
  cursor: pointer;
}
.add-btn {
  display: inline-flex;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-right: 16px;
  align-items: center;
  color: #606266;
  font-weight: bold;
}
.add-btn:hover {
  border: 1px solid #d9ecff;
  background-color: #ecf5ff;
  color: #409eff;
  cursor: pointer;
}
.add-input-wrapper {
  display: inline-flex;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #d9ecff;
  /* background-color: #ecf5ff;
  color: #409eff; */
  margin-right: 16px;
  align-items: center;
  font-size: 16px;
  width: 100px;
  height: 41px;
  box-sizing: border-box;
}
.add-input-wrapper .add-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
}
.add-input-wrapper.with-outline {
  border: 1px solid #409eff;
}
</style>
