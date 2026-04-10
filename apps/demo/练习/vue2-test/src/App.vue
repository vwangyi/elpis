<template>
  <div>
    <!-- <input-number /> -->
    <!-- <condition-render /> -->
    <!-- <switch-ball /> -->
    <!-- <password-input /> -->
    <!-- <checkbox-label /> -->
    <!-- <list-render /> -->
    <!-- <todo-list /> -->
    <!-- <obj-list /> -->
    <!-- <tag-group /> -->
    <!-- <my-rate
      v-model="a"
      :max="5"
      :abc.sync="b"
    /> -->
    <!-- <my-computed /> -->
    <!-- <my-watch /> -->
    <!-- <homework /> -->
    <!-- <time-line /> -->
    <!-- <parent-component /> -->
    <!-- <switch-ball
      v-model="value"
      active-color="#13ce66"
      inactive-color="#ff4949"
    /> -->
    <!-- <my-select
      v-model="value"
      :options="[
        { label: 'aaa', value: 'a' },
        { label: 'bbb', value: 'b' },
        { label: 'ccc', value: 'c' },
      ]"
    /> -->
    <!-- <life-cycle v-if="visible" />
    <button @click="visible = !visible">开关</button> -->
    <!-- <my-ref /> -->
    <!-- <my-html></my-html> -->
    <!-- <component :is="componentName" /> -->
    <my-next-tick>
      <span>123</span>
      <template #suffix>
        <div>hello world</div>
      </template>
    </my-next-tick>
  </div>
</template>

<script>
// import InputNumber from './components/input-number.vue';
// import ConditionRender from './components/条件渲染.vue';
// import SwitchBall from './components/切换class.vue';
// import PasswordInput from './components/密码框.vue';
// import CheckboxLabel from './components/复选框.vue';
// import ListRender from './components/列表渲染.vue';
// import TodoList from './components/增删.vue';
// import ObjList from './components/对象列表渲染.vue';
// import TagGroup from './components/tag-group.vue';
// // import MyRate from './components/my-rate.vue';
// import MyComputed from './components/计算属性.vue';
// import MyWatch from './components/监听.vue';
// import Homework from './components/作业-全选.vue';
// import TimeLine from './components/作业-时间轴.vue';
// // import ParentComponent from './components/组件/父组件.vue';
// // import ParentComponent from './components/组件/作业父组件.vue';
// import MySelect from './components/my-select.vue';
// import LifeCycle from './components/生命周期.vue';
// import MyRef from './components/ref.vue';
// import MyHtml from './components/结构.vue';
import myNextTick from './components/next-tick.vue';

export default {
  components: {
    // InputNumber,
    // ConditionRender,
    // SwitchBall,
    // PasswordInput,
    // CheckboxLabel,
    // ListRender,
    // TodoList,
    // ObjList,
    // TagGroup,
    // // MyRate,
    // MyComputed,
    // MyWatch,
    // Homework,
    // TimeLine,
    // // ParentComponent,
    // MySelect,
    // LifeCycle,
    // MyRef,
    // MyHtml,
    myNextTick
  }
  // data() {
  //   return {
  //     componentName: 'my-html',
  //   };
  // },
};
</script>
