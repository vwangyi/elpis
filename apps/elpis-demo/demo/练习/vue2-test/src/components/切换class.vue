<template>
  <!-- <div :class="`switch ${ off ? 'off' : '' }`"> -->
  <div
    :class="{
      switch: true,
      off: !value,
    }"
    :style="{
      'background-color': value ? activeColor : inactiveColor,
    }"
    @click="toggle"
  >
    <div class="btn"></div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Boolean,
    activeColor: String, // on
    inactiveColor: String, // off
  },
  methods: {
    toggle() {
      this.$emit('change', !this.value)
    },
  },
}
</script>

<style>
.switch {
  width: 200px;
  height: 100px;
  background-color: #0ef;
  border-radius: 50px;
  position: relative;
  transition: background-color 1s ease;
}

.switch .btn {
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
  transition:
    transform 1s ease,
    width 0.2s ease;
}

.switch.off:active .btn {
  width: 90px;
  transform: translateX(-90px);
}

.switch:active .btn {
  width: 90px;
  /* transform: translateX(-90px); */
}

.switch.off {
  background-color: #aaa;
}

/*
            重排: 需要重新计算位置大小的时候
            重绘: 比如颜色的改变
        */

.switch.off .btn {
  /* 改定位产生的位置 会发生重排 */
  /* right: 110px; */
  /*
                不会产生重排
                而只产生重绘
                CSS3 transform: translate
             */
  transform: translateX(-100px);
}
</style>
