<script setup>
import MyCounter from './components/计数器.vue';
import MySwitch from './components/开关.vue';
import MyVModel from './components/双向绑定.vue';
import MyVFocus from './components/自定义指令.vue';
import LifeCycle from './components/生命周期.vue';
import MyRef from './components/ref.vue';
import ParentComponent from './components/组件/父组件.vue';
import ButtonParent from './components/组件/按钮父组件.vue';
import TimePickerParent from './components/组件/时间选择器父组件.vue';
import MyInput from './components/组件/输入框父组件.vue';
</script>

<template>
  <!-- <my-counter /> -->
  <!-- <my-switch /> -->
  <!-- <my-v-model /> -->
  <!-- <my-v-focus /> -->
  <!-- <life-cycle /> -->
  <!-- <my-ref /> -->
  <!-- <parent-component /> -->
  <!-- <button-parent /> -->
  <time-picker-parent />
  <!-- <my-input /> -->
</template>
