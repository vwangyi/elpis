<template>
  <div>
    <div v-for="(item, i) in list" class="item" :key="i">
      <!-- 圈+线 -->
      <div class="line-wrapper">
        <div class="circle"></div>
        <div class="line"></div>
      </div>
      <div class="content-wrapper">
        <div class="date">{{ item.date }}</div>
        <div class="card">
          <p>{{ item.msg }}</p>
          <p class="commit-msg">{{ item.author }} 提交于 {{ item.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

// @vue/cli

export default {
  props: {
    data: Array
  },
  computed: {
    list() {
      return this.data.map(d => ({
        ...d,
        date: moment(d.timestamp).format('YYYY/M/D'),
        time: moment(d.timestamp).format('YYYY/M/D H:mm')
      }));
    }
  },
  methods: {}
};
</script>

<style scoped>
.item {
  display: flex;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
}
/* 数组项左边的线的容器 */
.item .line-wrapper {
  /* width: 20px; */
  position: relative;
  margin-right: 24px;
}
.item .line-wrapper .circle {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #eee;
}
.item .line-wrapper .line {
  height: calc(100% + 32px);
  width: 2px;
  background: #eee;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.item:last-child .line-wrapper .line {
  display: none;
}
/* 数组项右边的内容的容器 */
.item .content-wrapper {
  flex: 1;
  /* background: #eee; */
}
.item .card {
  width: 100%;
  box-shadow: 5px 5px 10px #e9e9e9;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #eee;
  margin-top: 8px;
}
.item .commit-msg {
  color: #99a;
}
.item .date {
  color: #aaa;
  font-size: 14px;
}
</style>
