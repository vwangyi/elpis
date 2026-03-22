+ 
+ 
+ vue2: [https://v2.cn.vuejs.org/](https://v2.cn.vuejs.org/) 
+ vue3: [https://cn.vuejs.org/](https://cn.vuejs.org/) 
+ vue2 vue3 都要会 理论实践 都要过关  实现各种业务。



views / pages 又叫页面组件或路由组件，因为这里面的组件 会被 router 直接引用。

组合式API 和 选项式API 区别： 组合式API颗粒度更细 可以把响应式数据单独抽离 脱离组件 选项式API无法把响应式数据和组件进行分离

一个项目 某个区域或 某个div 的布局类似 form表单900多个。通过封装一个组件实现 而这个组件可以实现解析json-schema 

## vue 的 key
+ crypto.randomUUID()
+ Symbol()



# v-on 和 v-bind 传递函数有什么区别
很好的问题！这两种方式确实都可以传递函数，但它们的用途和语义完全不同：

## 📊 **核心区别对比**
| 特性 | `v-on` (事件监听) | `v-bind` (属性传递) |
| --- | --- | --- |
| **数据流向** | 子组件 → 父组件 | 父组件 → 子组件 |
| **语法** | `v-on:event="handler"` 或 `@event="handler"` | `v-bind:prop="value"` 或 `:prop="value"` |
| **触发时机** | 子组件主动触发时 | 父组件数据变化时立即更新 |
| **通信方向** | 向上通信 (子通知父) | 向下传递 (父传递给子) |
| **典型用途** | 用户交互、状态变化通知 | 配置、初始数据、回调函数 |


## 💻 **代码示例**
### **1. v-on 事件监听方式**
```vue
<!-- 父组件 Parent.vue -->
<template>
  <ChildComponent 
    @button-clicked="handleButtonClick"
    @form-submit="handleFormSubmit"
  />
</template>
<script>
export default {
  methods: {
    handleButtonClick(data) {
      console.log('子组件按钮被点击了', data)
    },
    handleFormSubmit(formData) {
      console.log('表单提交了', formData)
    }
  }
}
</script>
<!-- 子组件 ChildComponent.vue -->
<template>
  <button @click="emitButtonClick">点击我</button>
  <form @submit="emitFormSubmit">
    <input v-model="formData" />
    <button type="submit">提交</button>
  </form>
</template>
<script>
export default {
  data() {
    return {
      formData: ''
    }
  },
  methods: {
    emitButtonClick() {
      this.$emit('button-clicked', { time: new Date(), action: 'click' })
    },
    emitFormSubmit() {
      this.$emit('form-submit', this.formData)
    }
  }
}
</script>

```

### **2. v-bind 传递函数方式**
```vue
<!-- 父组件 Parent.vue -->
<template>
  <ChildComponent 
    :on-success="handleSuccess"
    :on-error="handleError"
    :fetch-data="fetchApiData"
  />
</template>
<script>
export default {
  methods: {
    handleSuccess(result) {
      console.log('操作成功', result)
    },
    handleError(error) {
      console.log('操作失败', error)
    },
    fetchApiData(params) {
      return axios.get('/api/data', { params })
    }
  }
}
</script>
<!-- 子组件 ChildComponent.vue -->
<template>
  <div>
    <button @click="executeCallback">执行回调</button>
    <button @click="callFetchData">获取数据</button>
  </div>
</template>
<script>
export default {
  props: {
    onSuccess: Function,
    onError: Function,
    fetchData: Function
  },
  methods: {
    executeCallback() {
      try {
        // 执行一些操作...
        const result = { message: '操作成功' }
        // 调用父组件传递的回调函数
        if (this.onSuccess) {
          this.onSuccess(result)
        }
      } catch (error) {
        if (this.onError) {
          this.onError(error)
        }
      }
    },
    
    async callFetchData() {
      if (this.fetchData) {
        const data = await this.fetchData({ page: 1 })
        console.log('获取到的数据:', data)
      }
    }
  }
}
</script>

```

## 🎯 **应用场景**
### **使用 **`v-on`** 的场景：**
```javascript
// 1. 用户交互事件
@click, @input, @submit, @change

// 2. 组件生命周期事件
@mounted, @updated, @before-destroy

// 3. 业务状态变化
@status-change, @data-loaded, @validation-error

// 4. 动作确认
@confirm, @cancel, @save, @delete
```

### **使用 **`v-bind`** 传递函数的场景：**
```javascript
// 1. 配置回调函数
:on-success, :on-error, :on-complete

// 2. 传递数据处理函数
:formatter, :validator, :filter

// 3. 传递异步操作
:fetch-function, :save-function

// 4. 传递工具函数
:format-date, :calculate-price
```

## 🔧 **实际项目中的混合使用**
```vue
<!-- 复杂的组件通信示例 -->
<template>
  <DataTable
    :data="tableData"
    :columns="columns"
    :on-row-click="handleRowClick"           <!-- v-bind 传递回调 -->
    :format-cell="formatCellContent"         <!-- v-bind 传递格式化函数 -->
    @sort-change="handleSortChange"          <!-- v-on 监听排序事件 -->
    @filter-apply="handleFilterApply"        <!-- v-on 监听过滤事件 -->
    @page-change="handlePageChange"          <!-- v-on 监听分页事件 -->
  />
</template>
<script>
export default {
  methods: {
    // v-bind 传递的函数（子组件主动调用）
    handleRowClick(rowData) {
      console.log('行被点击', rowData)
    },
    
    formatCellContent(value, column) {
      return column.type === 'date' 
        ? this.$dayjs(value).format('YYYY-MM-DD')
        : value
    },
    
    // v-on 监听的事件（子组件主动触发）
    handleSortChange(sortConfig) {
      this.loadData({ sort: sortConfig })
    },
    
    handleFilterApply(filters) {
      this.loadData({ filters })
    },
    
    handlePageChange(pageInfo) {
      this.loadData(pageInfo)
    },
    
    loadData(params) {
      // 加载数据...
    }
  }
}
</script>

```

## ⚡ **性能与最佳实践**
### **v-on 的优势：**
```javascript
// 事件是惰性的，只在需要时触发
// 更符合 Vue 的响应式理念
// 调试更直观（DevTools 中可看到事件流）
```

### **v-bind 函数的注意事项：**
```javascript
// 避免内联函数，会导致不必要的重新渲染
<!-- ❌ 不推荐 -->
:on-click="() => doSomething()"

<!-- ✅ 推荐 -->
:on-click="handleClick"

methods: {
  handleClick() {
    this.doSomething()
  }
}
```

## 🚀 **组合式 API 中的使用**
```vue
<!-- 使用 Composition API -->
<script setup>
// 父组件
const handleEvent = (data) => {
  console.log('事件数据:', data)
}

const callbackFunction = (result) => {
  console.log('回调结果:', result)
}
</script>
<template>
  <ChildComponent 
    @custom-event="handleEvent"           <!-- v-on -->
    :on-callback="callbackFunction"       <!-- v-bind -->
  />
</template>
<!-- 子组件 -->
<script setup>
const emit = defineEmits(['custom-event'])
const props = defineProps({
  onCallback: Function
})

const triggerEvents = () => {
  emit('custom-event', { action: 'test' })           // 触发事件
  props.onCallback?.('callback result')              // 调用回调
}
</script>

```

## 💡 **决策指南**
**使用 **`v-on`** 当：**

+ 子组件需要**通知**父组件某个事件发生了
+ 用户交互需要向上传递
+ 组件状态变化需要告知父组件
+ 需要清晰的**事件流**调试

**使用 **`v-bind`** 传递函数当：**

+ 子组件需要**调用**父组件提供的功能
+ 传递配置性的回调函数
+ 需要父组件提供数据处理能力
+ 实现类似"依赖注入"的模式

**简单记法：**

+ `v-on`：**子组件说**"我做了某事"
+ `v-bind`：**父组件给**"你做事时用这个函数"

## ------






### 页面上同一个地方 会展示多个不同的组件，用动态路由和动态组件都可以实现，他们有什么区别？
这两种方式都可以实现组件动态展示，但在使用场景和特性上有重要区别：

## 📊 **核心区别对比**
| 特性 | 动态路由 (router-view) | 动态组件 (component) |
| --- | --- | --- |
| **URL 反映状态** | ✅ URL 变化，可分享链接 | ❌ URL 不变 |
| **浏览器历史记录** | ✅ 有历史记录，可前进后退 | ❌ 无历史记录 |
| **组件生命周期** | ✅ 切换时销毁重建 | ⚠️ 可配置 keep-alive |
| **SEO 友好** | ✅ 每个页面可单独优化 | ❌ 单页面，SEO 差 |
| **实现复杂度** | ⚠️ 需要配置路由 | ✅ 简单直接 |
| **适用场景** | 主要页面/功能模块 | 标签页/模态框/局部切换 |


## 💻 **代码示例对比**
### **1. 动态路由方式**
```javascript
// router.js
const routes = [
  {
    path: '/content/:type',
    component: Layout,
    children: [
      { path: 'componentA', component: ComponentA },
      { path: 'componentB', component: ComponentB }
    ]
  }
]

// 父组件 Layout.vue
<template>
  <div>
    <router-link to="/content/componentA">显示A</router-link>
    <router-link to="/content/componentB">显示B</router-link>
    <router-view></router-view>
  </div>
</template>
// 导航方式
this.$router.push('/content/componentA')
```

### **2. 动态组件方式**
```javascript
// 父组件 Parent.vue
<template>
  <div>
    <button @click="currentComponent = 'ComponentA'">显示A</button>
    <button @click="currentComponent = 'ComponentB'">显示B</button>
    
    <component :is="currentComponent" />
  </div>
</template>
<script>
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

export default {
  data() {
    return {
      currentComponent: 'ComponentA'
    }
  },
  components: {
    ComponentA,
    ComponentB
  }
}
</script>

```

## 🎯 **使用场景建议**
### **使用动态路由的场景：**
```javascript
// 当这些组件代表不同的"页面"时使用路由
- 用户资料页 / 设置页
- 商品列表 / 商品详情
- 文章编辑 / 文章预览
- 需要分享特定状态的页面

// 示例：博客系统
routes: [
  { path: '/post/edit', component: PostEdit },
  { path: '/post/preview', component: PostPreview }
]
```

### **使用动态组件的场景：**
```javascript
// 当这些组件是同一页面的不同"视图"时使用动态组件
- 标签页切换 (Tab)
- 表单步骤向导
- 数据的不同展示模式 (卡片/列表)
- 模态框内容切换

// 示例：仪表板标签页
<template>
  <div>
    <tabs>
      <tab name="统计" component="DashboardStats"/>
      <tab name="图表" component="DashboardCharts"/>
      <tab name="设置" component="DashboardSettings"/>
    </tabs>
    <component :is="activeTabComponent"/>
  </div>
</template>

```

## 🔧 **高级用法对比**
### **动态路由的参数传递**
```javascript
// 路由配置传参
{ path: '/user/:id/profile', component: UserProfile, props: true }

// 组件内接收
export default {
  props: ['id'],
  created() {
    // 根据 id 加载用户数据
  }
}
```

### **动态组件的参数传递**
```javascript
<template>
  <component 
    :is="currentComponent" 
    :userData="userData"
    @save="handleSave"
  />
</template>

```

### **保持组件状态**
```javascript
// 动态路由 + keep-alive
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
// 动态组件 + keep-alive
<keep-alive>
  <component :is="currentComponent" />
</keep-alive>

```

## 🚀 **性能考虑**
### **动态路由：**
+ ✅ 懒加载支持好
+ ✅ 代码分割自动处理
+ ⚠️ 路由切换有轻微开销

```javascript
// 路由懒加载
const ComponentA = () => import('./ComponentA.vue')
```

### **动态组件：**
+ ✅ 切换速度快
+ ⚠️ 需要预加载所有组件
+ ⚠️ 初始包体积可能较大

## 📝 **决策指南**
**选择动态路由当：**

+ 用户需要分享链接到特定状态
+ 需要浏览器前进后退功能
+ 组件代表完整的页面
+ 对 SEO 有要求

**选择动态组件当：**

+ 切换很频繁的局部内容
+ 不需要 URL 记录状态
+ 简单的标签页功能
+ 希望实现更简单

## 💡 **实际项目建议**
对于大多数项目，我建议：

+ **主要功能模块** → 使用动态路由
+ **页面内的标签页/视图切换** → 使用动态组件
+ **复杂的状态管理** → 结合两者使用

你的具体场景是什么？我可以给出更针对性的建议。你说得对！**router-view 也可以使用 keep-alive**，我之前的表格描述不够准确。感谢指正！让我详细说明两者的 keep-alive 使用：

## 🔄 **两者都支持 keep-alive**
### **1. router-view 使用 keep-alive**
```vue
<template>
  <!-- 基本用法 -->
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
  <!-- 更高级的用法 -->
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>
<script>
export default {
  data() {
    return {
      cachedViews: ['ComponentA', 'ComponentB'] // 指定要缓存的组件名
    }
  }
}
</script>

```

### **2. 动态组件使用 keep-alive**
```vue
<template>
  <keep-alive :include="['TabContent1', 'TabContent2']">
    <component :is="currentComponent" />
  </keep-alive>
</template>

```

## 📊 **修正后的对比表格**
| 特性 | 动态路由 (router-view) | 动态组件 (component) |
| --- | --- | --- |
| **URL 反映状态** | ✅ URL 变化，可分享链接 | ❌ URL 不变 |
| **浏览器历史记录** | ✅ 有历史记录，可前进后退 | ❌ 无历史记录 |
| **keep-alive 支持** | ✅ 完全支持 | ✅ 完全支持 |
| **SEO 友好** | ✅ 每个页面可单独优化 | ❌ 单页面，SEO 差 |
| **实现复杂度** | ⚠️ 需要配置路由 | ✅ 简单直接 |


## 🎯 **router-view + keep-alive 的高级用法**
### **按路由meta配置缓存**
```javascript
// router.js
const routes = [
  {
    path: '/list',
    component: UserList,
    meta: { keepAlive: true, title: '用户列表' }
  },
  {
    path: '/detail/:id',
    component: UserDetail,
    meta: { keepAlive: false } // 详情页不缓存
  }
]
```

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component 
        :is="Component" 
        v-if="route.meta.keepAlive" 
        :key="route.name"
      />
    </keep-alive>
    <component 
      :is="Component" 
      v-if="!route.meta.keepAlive" 
      :key="route.name"
    />
  </router-view>
</template>

```

### **条件性缓存管理**
```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :max="10" :include="cachedComponents">
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
  </router-view>
</template>
<script>
export default {
  data() {
    return {
      cachedComponents: [] // 动态管理缓存组件
    }
  },
  watch: {
    '$route'(to, from) {
      // 根据路由动态管理缓存
      if (to.meta.keepAlive && !this.cachedComponents.includes(to.name)) {
        this.cachedComponents.push(to.name)
      }
    }
  }
}
</script>

```

## 🔧 **keep-alive 的核心特性（两者通用）**
### **生命周期变化**
```javascript
// 被 keep-alive 缓存的组件
export default {
  activated() {
    // 组件激活时调用（从缓存恢复）
    console.log('组件被激活')
  },
  deactivated() {
    // 组件停用时调用（进入缓存）
    console.log('组件被停用')
  }
  // created/mounted 只会在第一次创建时调用
}
```

### **缓存控制参数**
```vue
<keep-alive 
  :include="['CompA', 'CompB']"  <!-- 只缓存这些组件 -->
  :exclude="['CompC']"           <!-- 不缓存这些组件 -->
  :max="10"                      <!-- 最大缓存实例数 -->
>
  <router-view />
</keep-alive>

```

## 💡 **使用建议**
### **适合用 router-view + keep-alive 的场景：**
```javascript
// 需要保持状态的列表页、表单页
- 数据表格（保持筛选条件、分页状态）
- 多步骤表单（保持已填写内容）
- 复杂的筛选页面
- Tab切换的列表内容
```

### **适合用动态组件 + keep-alive 的场景：**
```javascript
// 同一页面内的多个视图切换
- 仪表板的多个图表视图
- 设置页的不同配置面板
- 编辑器的不同模式（代码/预览）
```

## 🚀 **性能优化技巧**
### **路由级别的懒加载 + 缓存**
```javascript
// router.js
const routes = [
  {
    path: '/heavy-component',
    component: () => import('./HeavyComponent.vue'), // 懒加载
    meta: { keepAlive: true } // 但第一次加载后缓存
  }
]
```

**总结：router-view 和动态组件都完全支持 keep-alive，选择哪个主要基于你的业务需求（是否需要URL路由、历史记录等），而不是基于缓存能力。**

