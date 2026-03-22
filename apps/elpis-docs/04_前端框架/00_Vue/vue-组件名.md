
# 组件名

组件名 name
应用场景一 
● <keep-alive> 的 include 和 exclude 属性根据组件的 name 进行匹配，如果想要条件性地被 keep-alive 缓存，就必须显式声明一个 name 属性。
应用场景二：
● 组件递归引用自己，在 Vue 组件中只需要引用的组件名称与当前组件 name 属性保持一直，组件是可以自己引用自己的，这点在编写类似于 Tree 树形组件时十分有用。需要注意的一点是，为避免死循环递归，请带上条件语句。


```vue 
<script>
export default {
  name: 'vue2.x组件名',
  // 其他...
}
</script>
 
```
```vue 
<script setup>
  defineOptions({
    name: 'vue3.2 方式一',
    // 其他...
  })
</script>

```
```vue 
<script>
export default {
  name: 'vue3.2 方式二 多写一个script ',
  // 其他...
}
</script>
<script setup> 
</script>

```

```vue 
<script lang="ts" setup name="xxx"> 
// vue3.2 方式三 需要ts和下载插件vite-plugin-vue-setup-extend
</script>
```