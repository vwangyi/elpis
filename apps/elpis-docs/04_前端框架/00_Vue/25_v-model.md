
# v-model

- 是否可以传 v-model 取决于 组件封装者有没有提供 v-model 功能
- 原生 input 虽然不支持 v-model 但支持 value 属性和 input 事件

```vue
<script setup>
const a = ref(0);

</script>

<template> 
  <组件 v-model:xxx="a" / >
</template>

```



```vue
<script setup>

// 组件内部

const props = defineProps({
   xxx: {
     type: Number,
     default: 0
   }
})
const emit = defineEmits([
  "update:xxx",
])
</script>
```


```js
model: { prop: 'input', event: 'change' }

defineModel({
  prop: 'input',
  event: 'change' 
})
```




### v-model 
> 双向数据绑定 从视图到数据 v-bind 从数据到视图 v-on    v-bind + v-on = v-model
> v2只能传一个v-model 多个用 v-bind + .sync
```js
<el-input :value="value" @input="value = $event" /> 

如果input事件仅仅只是修改value值 那么可以简写为
<el-input v-model="value" />
如果input事件除了修改value值 还有其他操作 那么就不能简写了
只能写全 并且在事件函数内部手动修改value值 然后做其他操作
 

<my-test :a.sync="value1" :b.sync="value2" /> 
  
  文本输入框 -- value
  单选框 -- checked  传v-model的变量  因为单选框没有value属性 只有checked 所以需要手动传value值   
  多选框 -- checked  传v-model的变量  因为多选框没有value属性 只有checked 所以需要手动传value值   因为是多选框 所以初始值给[]
  下拉框 -- value 
  文本域 -- value
  自定义组件 -- value 

export default { 
  // model的value和input 这是默认的 不写也是这样
  // 当一个组件的model配置项是这样 我们传递的v-model才相当于 
  // 传递了 :value="" @input="" 
  // 如果我们修改为 model: { prop: 'checked', event: 'change' }
  // 那么传递的v-model 就相当于 传递了 :checked="" @change=""
  model: { prop: 'value', event: 'input' }, 

  
}
  v-model的修饰符
// > v-model.lazy=""  把input事件改成change事件 
// > v-model.number=""    把用户输入的值转为 数值类型 
// > v-model.trim=""  把用户输入的值去掉前后空格

 vue3的v-model 
<my-test v-model="value" /> 
相当于
<my-test :modelValue="value" @update:modelValue="value = $event" />

<my-test v-model:abc="value" /> 
相当于
<my-test :abc="value" @update:abc="value = $event" />


 vue3相当于 内部少了 model 这个配置项   v3的 v-model 类似于 v2的 .sync 

```