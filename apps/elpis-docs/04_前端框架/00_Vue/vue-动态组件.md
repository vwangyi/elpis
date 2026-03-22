
# component动态组件


```vue
<script setup>
    import comp1 from 'xx/xx1.vue'
    import comp2 from 'xx/xx2.vue'

  const components = [
    comp1, 
    comp2
  ]
  const index = ref(0)
</script>

<template>
  <component :is="components[index]" />	
</template>
```