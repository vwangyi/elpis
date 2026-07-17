

## KeepAlive
- https://cn.vuejs.org/guide/built-ins/keep-alive.html#keepalive



## 
keepalive 一般是配合 动态组件使用 或二级路由使用，当某一个div需要切换显示视图时，不显示的视图默认是销毁的，用keep-alive可以缓存之前的组件状态。














## Vue 的 keep-alive 详解

### 1. 什么是 keep-alive？

`keep-alive` 是 Vue 内置的一个抽象组件，用于**缓存不活动的组件实例**，而不是销毁它们。当组件在 `keep-alive` 内部切换时，它的状态会被保留，避免重复渲染造成的性能开销。

### 2. 基本用法

```vue
<template>
  <div>
    <!-- 基本用法：缓存所有子组件 -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
    
    <!-- 或者配合 router-view -->
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'ComponentA'
    }
  }
}
</script>
```

### 3. 生命周期钩子

被 `keep-alive` 缓存的组件会新增两个生命周期钩子：

```javascript
export default {
  name: 'CachedComponent',
  
  // 首次进入和每次从缓存中唤醒时调用
  activated() {
    console.log('组件被激活（进入/唤醒）');
    // 可以在这里刷新数据、恢复状态等
  },
  
  // 组件被缓存（离开）时调用，不是销毁
  deactivated() {
    console.log('组件被缓存（离开）');
    // 可以在这里保存状态、暂停计时器等
  },
  
  // 注意：mounted/unmounted 只在首次挂载和彻底销毁时触发
  mounted() {
    console.log('组件首次挂载');
  },
  unmounted() {
    console.log('组件被销毁（很少触发）');
  }
}
```

### 4. 属性配置（重点）

#### 4.1 `include` - 白名单

只有匹配的组件会被缓存（支持字符串、正则、数组）：

```vue
<template>
  <!-- 字符串：逗号分隔 -->
  <keep-alive include="ComponentA,ComponentB">
    <router-view />
  </keep-alive>
  
  <!-- 正则表达式 -->
  <keep-alive :include="/^Component[A-Z]/">
    <router-view />
  </keep-alive>
  
  <!-- 数组 -->
  <keep-alive :include="['ComponentA', 'ComponentB']">
    <router-view />
  </keep-alive>
</template>
```

#### 4.2 `exclude` - 黑名单

匹配的组件**不会**被缓存：

```vue
<template>
  <!-- 除了 ComponentA 和 ComponentB，其他都缓存 -->
  <keep-alive exclude="ComponentA,ComponentB">
    <router-view />
  </keep-alive>
</template>
```

#### 4.3 `max` - 最大缓存数量

限制最多缓存多少个组件实例，超出时会**自动淘汰最久未访问的**（LRU 策略）：

```vue
<template>
  <!-- 最多缓存 5 个组件 -->
  <keep-alive :max="5">
    <router-view />
  </keep-alive>
</template>
```

### 5. 实际应用场景

#### 场景一：列表页 + 详情页（最常见）

```vue
<!-- App.vue -->
<template>
  <div>
    <keep-alive>
      <!-- 只缓存列表页，详情页不缓存 -->
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<!-- router.js -->
const routes = [
  {
    path: '/list',
    component: ListPage,
    meta: { keepAlive: true }  // 标记为需要缓存
  },
  {
    path: '/detail/:id',
    component: DetailPage,
    meta: { keepAlive: false } // 不缓存详情页
  }
]
```

```javascript
// ListPage.vue - 列表页
export default {
  name: 'ListPage',
  data() {
    return {
      list: [],
      scrollTop: 0
    }
  },
  activated() {
    // 从详情页返回时恢复滚动位置
    document.documentElement.scrollTop = this.scrollTop;
    // 或者刷新数据（如果需要）
    // this.fetchList();
  },
  deactivated() {
    // 离开时保存滚动位置
    this.scrollTop = document.documentElement.scrollTop;
  }
}
```

#### 场景二：Tab 切换（多标签页）

```vue
<template>
  <div>
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="currentTab = tab.key"
        :class="{ active: currentTab === tab.key }"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- 缓存所有标签页 -->
    <keep-alive :max="10">
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script>
import TabA from './TabA.vue';
import TabB from './TabB.vue';
import TabC from './TabC.vue';

export default {
  data() {
    return {
      currentTab: 'A',
      tabs: [
        { key: 'A', label: '标签A' },
        { key: 'B', label: '标签B' },
        { key: 'C', label: '标签C' }
      ]
    }
  },
  computed: {
    currentTabComponent() {
      return {
        A: TabA,
        B: TabB,
        C: TabC
      }[this.currentTab]
    }
  }
}
</script>
```

### 6. 常见问题与解决方案

#### 问题1：缓存后数据不更新

```javascript
// 解决方案：在 activated 中重新获取数据
export default {
  activated() {
    // 判断是否需要刷新数据
    if (this.needRefresh) {
      this.fetchData();
      this.needRefresh = false;
    }
  },
  
  // 或者使用路由守卫
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 从详情页返回时刷新
      if (from.path.startsWith('/detail')) {
        vm.fetchData();
      }
    });
  }
}
```

#### 问题2：动态设置 include/exclude

```vue
<template>
  <keep-alive :include="cachedComponents">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  data() {
    return {
      cachedComponents: ['ListPage'] // 默认只缓存列表页
    }
  },
  watch: {
    '$route' (to) {
      // 根据路由动态决定是否缓存
      if (to.meta.keepAlive && !this.cachedComponents.includes(to.name)) {
        this.cachedComponents.push(to.name);
      }
    }
  }
}
</script>
```

#### 问题3：缓存过多导致内存溢出

```vue
<template>
  <!-- 设置 max 限制缓存数量 -->
  <keep-alive :max="20">
    <router-view />
  </keep-alive>
</template>
```

### 7. 原理简述

`keep-alive` 内部维护一个缓存对象（`cache`）和键数组（`keys`）：

1. **缓存机制**：当组件首次渲染时，将 VNode 存入 `cache`
2. **复用机制**：再次渲染时，直接从 `cache` 取出 VNode 并渲染
3. **LRU 策略**：当达到 `max` 限制时，删除最久未使用的缓存

```javascript
// 简化版实现
const cache = new Map();
const keys = [];

function pruneCacheEntry(key) {
  cache.delete(key);
  const index = keys.indexOf(key);
  if (index > -1) keys.splice(index, 1);
}

// 访问缓存时更新 keys
if (cache.has(key)) {
  // 移到最近使用
  keys.splice(keys.indexOf(key), 1);
  keys.push(key);
} else {
  cache.set(key, vnode);
  keys.push(key);
  if (keys.length > max) {
    pruneCacheEntry(keys[0]); // 淘汰最旧
  }
}
```

### 8. 最佳实践总结

| 场景 | 推荐做法 |
|------|---------|
| 列表+详情页 | 使用 `meta.keepAlive` + 两个 `router-view` |
| 表单页 | 一般**不缓存**，避免数据残留 |
| Tab 切换 | 使用 `keep-alive` + `component`，设置 `max` |
| 大数据表格 | 缓存并配合 `activated` 刷新数据 |
| 组件名必须设置 | `keep-alive` 通过 `name` 匹配，所以组件必须写 `name` 选项 |

**核心原则**：用 `keep-alive` 缓存**需要保留状态**的组件，而不是所有组件，避免不必要的内存占用。



















当前页面 跳转详情页 再回来 需要keep-alive 
跳转 不是详情页 回来 不需要keep-alive 