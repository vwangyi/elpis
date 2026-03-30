
# 插槽
 
- https://cn.vuejs.org/guide/components/slots.html#slots


传插槽 其实就是传递一个函数 

<!--    v-slot:  等价  #  -->
## 传递插槽 
```vue
<template>
  <compo>
 
    <template v-slot:header="scoped">{{ scoped }}</template>
    <template #header="scoped">{{ scoped }}</template>
    <template #default></template>
    <template v-slot="slotProps" > {{ slotProps}} </template>
    <template v-slot:footer></template>
  
    <template #[slotName]></template> 

      <template #header="headerProps">
        {{ headerProps }}
      </template>
    
      <template #default="defaultProps">
        {{ defaultProps }}
      </template>
    
      <template #footer="footerProps">
        {{ footerProps }}
      </template>
  </compo>
</template>
```

## 接收插槽
```vue
<template>
  <div class="container">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"  :xx1="xx" :xx2="xx" />
    </div>
 
   <div v-for="slotName in $slots" class="card-header">
      <!-- <slot name="header"  :xx1="xx" :xx2="xx" /> -->
    </div>
    
  <header>
    <slot name="header" :xx1="xx" :xx2="xx" >默认内容</slot>
  </header>
  <main>
    <slot name="default"  :xx1="xx" :xx2="xx" >默认内容</slot>
  </main>
  <footer>
    <slot name="footer"  :xx1="xx" :xx2="xx" >默认内容</slot>
  </footer>
</div>
</template>

<!-- slot标签 和 $slots 来接收插槽  -->
```

