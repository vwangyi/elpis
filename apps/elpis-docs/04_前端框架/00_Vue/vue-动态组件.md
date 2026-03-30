
# component动态组件


```vue
<script setup>
import comp1 from 'xx/xx1.vue';
import comp2 from 'xx/xx2.vue';
const componentsMap = { 
  comp1, 
  comp2
}
const key = ref('comp1')
</script>

<template>
  <component :is="componentsMap[key]" />	
</template>
```


```js

import comp1 from 'xx/xx1.vue';
import comp2 from 'xx/xx2.vue';
import comp2000 from 'xx/xx2000.vue';

export default { 
  comp1, 
  comp2,
  comp2000
} 
```
```vue
<script setup>
import componentsMap from './componentsMap.js'; 
const key = ref('comp1')
</script>

<template>
  <component :is="componentsMap[key]" />	
</template>
```


## 动态组件
> component 组件  动态组件本质就是把组件当成一个变量去使用
```vue
<!-- 

应用场景有很多 比如同一个dom位置 需要根据条件展示不同的组件
比如弹窗内容 弹窗是同一个 但是内容不同 内容就用动态组件 

动态组件： 运用场景 当多个组件需要切换展示在同一组件中时 用 `<compoent :is="组件名"></compoent>` 传is为组件名 组件名是变量 可以动态
如下所示 Patients Students ReadTeacher 等组件 需要展示在 conponent组件   
类似于 router-view 多个子组件需要根据条件展示在 父组件的router-view的地方


动态组件 把组件当成一个变量去使用
动态路由 把路由 路径 当成一个变量去使用
动态属性 把属性名 :[xx]="xx" 当成一个变量去使用




-->
 
<template>
    <div>
    <!--        传is  是   Patients 或者 Patients 或 Teacher       -->
        <component :is="roletype2component[this.$route.query.roletype]" />
    </div>
</template>

<script>
    // 如果this.$route.query.roletype === '标准化病人'   
    import Patients from './Patients.vue'
    import Students from './UserList/Students.vue'
    import ReadTeacher from './UserList/ReadTeacher.vue' 

    const roletype2component = {
        标准化病人: 'Patients',
        系统管理员: 'Patients',
        教员: 'Teacher', 
    }
    export default {
        components: {
            Patients,
            Students,
            ReadTeacher, 
        },
        data() {
            return {
                 
            }
        }
    }
</script>
``` 
