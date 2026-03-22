



## 父组件.vue
```vue
<script setup>
import { ref } from 'vue';
const a = { a: 1, b: 2 }; // v-bind批量传递
const a1 = ref([]) // 传变量
function fn() {}
</script>

<template>
  <子组件
    v-bind="a"
    :xixi="a1"
    :xixi="(value) => fn(value, 123)"
    xixi1="123"
  ></子组件>
</template>
```



## 子组件.vue
```vue
<script setup> 
// compom api 
const props = defineProps({
    xixi1: null, // 接收任意类型
    xixi2: undefined, // 接收任意类型
    xixi3: {
      type: Array,
      default: () => []
    }
})
</script>


<script>
// option API 
export default {
  props: { 
    xixi1: null, // 接收任意类型
    xixi2: undefined, // 接收任意类型
    xixi3: {
      type: Array,
      default: () => []
    }
  }
}
</script>
```

## 父组件的响应式数据 props对象
```javascript
// props 也是响应式数据 是父组件的响应式数据 也可以是爷爷 爷爷的父亲 都行
6 props 是外面传递的响应式变量 不能直接修改props 
  只能调用父组件的方法 让父组件修改props（props也就是函数形参）

porps的默认值是undefined 设置了defalut也没用 
  defalut也只有watch初始化执行外面没有传递才能拿到default设置的值 
 
const props = defineProps({
  value: {
    type: [String],
    default: ''
  },
  name: {
    type: String,
    required: true,
  },
});
// 等价于下面（可以这样理解） 当外面传value 就是赋值 对 props.value = value
// 只能外面进行赋值 里面不能对 props进行赋值
const props = ref({
  value: '',
  name: undefined,
})



1 props就是响应式数据 和 ref 或 data 一样 
    区别就是props是属于父组件的 子组件不能直接修改 只能间接修改 

2 


// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}

// 使用 <script setup>
const props = defineProps({
   text1: String, // 限制为 String 
   text2: [String, null], // 限制为 String 或 null 
})








porps的应用场景
  1 用watch 监听到 props的值 然后 用props 修改 响应式数据  作为响应式数据的初始值
  2 子组件 直接渲染 props 的值 {{ props.xx }}
  3 其他地方 拿到的是 props 第一次传递的值 注意不是默认值 第一次传递的值之前就是默认值 
  4 限制类型 


porps需要改变的场景1 
const props = defineProps(['initialCounter'])
// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter)

porps需要改变的场景2
const props = defineProps(['size'])
// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase())

watch(
  () => props.xx,
  (newValue, oldValue) => {
      console.log(newValue, oldValue)
  }
)



props校验
https://cn.vuejs.org/guide/components/props.html#prop-validation
const props = defineProps({
  // 基础类型检查 
  xixi: null, // 允许任意类型
  xixi1: undefined, // 允许任意类型 
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // 必传但可为 null 的字符串
  propD: {
    type: [String, null],
    required: true
  },
  // Number 类型的默认值
  propE: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default: (rawProps) => [],
    default: (rawProps) => ({}),
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propG: {
    validator(value, props) {
      // 限制props只能是其中一个 
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propH: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})

props的默认值：
  除了Boolean外 默认值都是 undefined
  Boolean的默认值是false 可以更改默认值 default: undefined

type可以是 原生构造函数（类）
String
Number
Boolean
Array
Object
Date
Function
Symbol
Error 
自定义的构造函数（自定义的类）
底层原理都是通过 instanceof 原型链来匹配 






props是父级的响应式数据
一个响应式数据 有没有改变 只有2个人知道 1 改变它的人 2 监听（watch computed）这个响应式数据

初始化 setup beforeCreate created beforeMoute mounted
都是 只能拿到 第一次传递的值 这是因为这些钩子只是初始化时执行一次只有当外面不传的时候 初始化时才能（也只能）拿到默认值


computed watch 都是监听 只要改变都会执行 变不变 取决于 新值-==旧值（也就是说 赋值一个相同的值 不算是改变props）
有一种情况监听不到 爷一-传->父--传->子爷爷组件传下去时候 子组件v-if="false"当子组件v-if="true”初始化时添加watch 已经晚了 子组件已经是新值了 初始化时拿到的也是新值 但watch是监听不到的
应用场景：props的值 作为 组件某个变量的初始值


emit 修改props 是异步的 也就是 下一行同步打印 拿不到最新的值 异步打印才可以拿到最新的值
emit('xx', 123) 
console.log(xx) //  同步打印 
setTimeout(() => {
  console.log(xx) // 异步打印
})



```



```markdown
// props传递下来的值 是异步的 不知道值什么时候传递下来 
//     1 props 配置项 computed 和 watch 和 <template> 可以拿到 每次更新的值
//     2 除了computed和watch和 template 其他地方拿props的值都是 第一次传递的值 不会更新
//     比如 data里面 return {xixi: this.value}
//     created mounted 等地方 即使加了 nextTick也没用
//     只能拿到第一次传递的值

//     3 props是只读的 不能修改

//     4 template里面用 xxx-xxx  script里面用小驼峰 xxxXxx

//     正常情况是不会改props的 只有数据源 才有资格改数据 如果要改 通知父组件改数据
1 props传递下来的值是 异步的 不知道值什么时候传递下来
 computed 和 watch 和 template 可以拿到 每次更新的props值
 除了computed和watch和 template 其他地方拿props的值都是 第一次传递的props值 不会更新
 一般都是用watch 监听props 每次传递props值 都会被watch监听到 
 实现把props的值赋给组件内部的变量作为变量的初始值

 组件外部 给 props 重新赋值 并不是修改 只有赋值和上一次不一样 才视为修改props 
 组件内部 的 监听属性 tempalte模版
```

```javascript
// vue2 
export default {
  props: {
    xxx: { type: Boolean, defalut: true }
  }
}
this.xxx

// vue3.0 setup() 
export default {
  props: {
    xxx: { type: Boolean, defalut: true }
  },
  // vue3	需要接收emits 
  emits: ['update:xxxx', 'xx', ],
  setup(props, {emit}) {
    props.xxx
    emit('update:xxxx', 传值)
  } 
}

// vue3.2 script setup
const props = defineProps({ //defineProps不需要引入
  xxxx: { type: String, default: '' }
})
const emits = defineEmits(['update:xxx', 'xxx']) // defineEmits不需要引入
porps.xxxx
emits('update:xxx', 传值)
```



