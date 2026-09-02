<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { manifest } from './manifest'
import { buildHostPath, getRouteState } from './router'

const route = useRoute()
const router = useRouter()
// 把 manifest 转成可直接给模板 v-for 使用的 [name, meta] 数组，左侧菜单就是靠它渲染出来的。
const buttons = computed(() => Object.entries(manifest))

// 根据当前地址栏，算出“主应用接下来应该去哪里”。
// 例如当前地址是 #/finance/invoice/908，这里算出来的就是：
// { appName: 'finance', childPath: '/finance/invoice/908' }
// 可以拿这份目标状态去判断：
// 是要切到另一个子应用，还是只在同一个子应用内部切页。
const targetState = computed(() => getRouteState(route))
console.log(targetState);

// 单独取出当前命中的子应用名，主要给菜单高亮状态使用。
const selectedAppName = computed(() => targetState.value.appName)

// 已经加载过的子应用入口模块缓存起来，切回同一个应用时不必再次 import。
const moduleCache = new Map()

// 给页面状态面板展示：当前业务区里挂着的是哪个子应用。
const currentAppLabel = ref('未加载模块')

// 给页面状态面板展示：子应用最近一次上报的内部路由。
const currentRouteLabel = ref('-')

// 给页面业务区展示当前阶段提示，例如“加载中” “已挂载完成” “接入失败”。
const stageMessage = ref('正在准备业务模块。')

// 指向模板里子应用宿主容器的真实 DOM，后面 mount 时会把子应用挂到这里。
const subapp = ref(null)

// 下面这几个 let 不是给模板直接渲染用的，而是主应用调度流程内部维护的“当前真实状态”。
// 保存当前已经挂到页面上的子应用入口模块对象，后面切页或切走时要继续调用它的 navigate / unmount。
let currentModule = null

// 记录当前真正挂在页面上的子应用名，例如 order 或 finance。
let currentAppName = ''

// 记录当前真正生效的子应用内部路由，会用它和目标路由比较，判断是不是只发生了同应用内部切页。
let currentChildPath = ''

// 按“子应用名 -> 上次停留的内部路由”保存最近访问位置。
// 它大概长这样：
// {
//   order: '/orders/refund/1024',
//   finance: '/finance/invoice/908'
// }
// 也就是说：订单子应用上次停在退款页，财务子应用上次停在开票页。
// 这样用户从订单切到财务，再切回订单时，主应用就能把订单恢复到 /orders/refund/1024，
// 而不是每次都退回默认页 /orders/list。
// 刚初始化时，这个对象里的每个值先用 manifest 里的 defaultPath 兜底。
const lastVisitedPathByApp = Object.fromEntries(
  Object.entries(manifest).map(([name, meta]) => [name, meta.defaultPath]),
)

// 这是一个递增的版本号，每次路由同步时都会 +1。它的作用是：
// 1. 当用户快速切换子应用时，可能会出现“上一个子应用还没加载完，下一个子应用就开始加载了”的情况。
// 2. 这时如果上一个子应用加载完成后再去 mount，它就会把下一个子应用给覆盖掉，导致页面显示错乱。
// 3. 所以每次路由同步时都会 +1，子应用加载完成后会检查这个版本号是否和自己启动时的版本号一致，如果不一致就说明自己已经过时了，就不再 mount
let switchToken = 0;

// 统一输出主应用侧的运行日志，方便观察宿主是按什么顺序调度子应用的。
function writeHostLog(message, tone = 'info') {
  if (tone === 'error') {
    console.error(`[host] ${message}`)
    return
  }

  console.info(`[host] ${message}`)
}

// 在真正挂载子应用之前，先把宿主容器切成“加载中”状态。
function renderLoading(meta) {
  stageMessage.value = `正在加载 ${meta.label}。`

  if (!subapp.value) {
    return
  }

  subapp.value.innerHTML = `
    <div class="loading-card">
      <span class="eyebrow eyebrow-soft">加载中</span>
      <h3>${meta.label} 正在启动</h3>
      <p>${meta.entry}</p>
      <small>请稍候，模块资源加载完成后会自动显示。</small>
    </div>
  `
}

// 如果子应用入口加载或挂载失败，就把失败信息渲染到宿主容器里。
function renderError(meta, error) {
  stageMessage.value = `${meta.label} 接入失败了。`

  if (!subapp.value) {
    return
  }

  subapp.value.innerHTML = `
    <div class="error-card">
      <span class="eyebrow eyebrow-warn">加载失败</span>
      <h3>${meta.label} 启动失败</h3>
      <p>${error.message}</p>
    </div>
  `
}

// 把子应用内部路由整理成页面上展示用的标签格式，例如 /orders/list -> #/orders/list。
function formatRouteLabel(childPath) {
  return childPath ? `#${childPath}` : '-'
}

// 统一兼容子应用回传的不同路由格式，最终收敛成主应用内部统一使用的 childPath。
function normalizeChildPayload(payload, appName) {
  // 第一优先级：直接使用子应用回传的 path。
  // 例如子应用回传 { path: '/finance/bills' }，那就直接得到 /finance/bills。
  // 如果子应用回传的是 { path: 'finance/bills' }，这里会顺手补成 /finance/bills，
  // 保证主应用内部统一使用“以 / 开头”的标准路径格式。
  if (typeof payload?.path === 'string' && payload.path.length > 0) {
    return payload.path.startsWith('/') ? payload.path : `/${payload.path}`
  }

  // 第二优先级：兼容子应用只回传 route 字符串的情况。
  // 例如收到 { route: '#/orders/detail/2048' }，这里会去掉开头的 #，
  // 最终收敛成主应用后续统一处理的 /orders/detail/2048。
  if (typeof payload?.route === 'string' && payload.route.startsWith('#/')) {
    return payload.route.slice(1)
  }

  // 如果子应用这次没有回传可用路径，就兜底退回该子应用的默认页。
  // 例如订单子应用兜底到 /orders/list，财务子应用兜底到 /finance/bills。
  // 这样主应用至少还能落在一个合法页面上，不会因为脏数据把状态搞乱。
  return manifest[appName].defaultPath
}

// 点击左侧菜单时，只负责改主应用地址；真正的子应用切换交给 syncToRoute 统一处理。
function handleAppSwitch(name) {
  // 点击菜单时先改主应用 URL，再由 watch -> syncToRoute 统一完成后续切换流程。
  router.push(buildHostPath(name, lastVisitedPathByApp[name]))
}

async function loadModule(name){
  const meta = manifest[name]

  if(moduleCache.has(name)){
    writeHostLog(`子应用 ${meta.label} 已经加载过，直接复用缓存模块。`)
    return moduleCache.get(name)
  }

  writeHostLog(`正在加载子应用 ${meta.label}，入口 ${meta.entry}。`)

  // 加载子应用远程入口模块
  const remoteModule = await import(/* @vite-ignore */meta.entry)

  // 主应用和子应用之间的约定：子应用必须在入口模块里导出一个名为 mount/unmount 的函数，主应用才能调用它。
  if (typeof remoteModule.mount !== 'function' || typeof remoteModule.unmount !== 'function') {
    throw new Error(`子应用 ${meta.label} 的入口模块没有正确导出 mount/unmount 函数。`)
  }

  moduleCache.set(name, remoteModule)
  writeHostLog(`子应用 ${meta.label} 加载完成，已缓存模块。`)
  return remoteModule
}

async function syncToRoute(){
  if(!subapp.value){
    return;
  }
  const {appName, childPath} = targetState.value
  const meta = manifest[appName]

  // 进入这一轮路由同步之前，当前子应用原来停留的内部路由先记录下来
  // 可以拿这个值做比较，判断是不是“同一个子应用内部路由的切换”。
  const previousChildPath = currentChildPath

  // 每次await 回来后，都会拿它和最新的switchToken比较，如果不一致就说明自己已经过时了,
  // 发生了竞态，用户已经发起了更新一轮的切换
  // 旧流程中的内容会被直接丢弃
  const token = ++switchToken

  currentRouteLabel.value = formatRouteLabel(childPath)

  currentChildPath = childPath

  lastVisitedPathByApp[appName] = childPath

  if(currentAppName === appName && currentModule){
    if(previousChildPath !== childPath && typeof currentModule.navigate === 'function'){
      await currentModule.navigate(childPath)
    }

    currentAppLabel.value = meta.label
    stageMessage.value = `${meta.label} 已挂载完成。`
    return;
  }

  try{

    if(currentModule){
      writeHostLog(`正在卸载子应用 ${manifest[currentAppName].label}。`)
      await currentModule.unmount()
      
      if(token !== switchToken){
        writeHostLog(`子应用 ${manifest[currentAppName].label} 卸载完成，但已过时，直接丢弃。`)
        return;
      }
    }

    renderLoading(meta)

    const nextModule = await loadModule(appName)

    if(token !== switchToken){
      writeHostLog(`子应用 ${meta.label} 加载完成，但已过时，直接丢弃。`)
      return;
    }

    writeHostLog(`正在挂载子应用 ${meta.label}。`)
    await nextModule.mount({
      container: subapp.value,
      initialPath: childPath,
      hostApi:{
        onMounted(message){
          stageMessage.value = message;
          writeHostLog(message);
        },
        onChildRouteChange(payload){
          // 路径规范化处理。比如统一把 /finance/bills 和 finance/bills 都收敛成 /finance/bills。
          const nextChildPath = normalizeChildPayload(payload, appName)
          // 主应用最终要写回地址栏的地址
          const nextHostPath = buildHostPath(appName, nextChildPath)

          // 同步主应用当前停留的位置
          currentChildPath = nextChildPath
          lastVisitedPathByApp[appName] = nextChildPath
          currentRouteLabel.value = formatRouteLabel(nextChildPath)
          writeHostLog(`子应用 ${meta.label} 内部路由切换到 ${nextChildPath}，同步主应用地址栏为 ${nextHostPath}。`)

          // 通过 router.push 改地址栏，触发主应用路由同步流程。
          if(router.currentRoute.value.fullPath !== nextHostPath){
            router.push(nextHostPath)
          }
        }
      }
    })

    // mount 完成后再检查一次 token，确保自己还没过时。
    if(token !== switchToken){
      writeHostLog(`子应用 ${meta.label} 挂载完成，但已过时，直接丢弃。`)
      await nextModule.unmount()
      return;
    }

    currentAppName = appName
    currentModule = nextModule
    currentAppLabel.value = meta.label
    stageMessage.value = `${meta.label} 已挂载完成。`

  }catch(error){
    writeHostLog(`子应用 ${meta.label} 接入失败：${error.message}`, 'error')
    currentAppLabel.value = '挂载失败';
    currentRouteLabel.value = '-';
    renderError(meta, error)
  }
}

onMounted(()=>{
  syncToRoute()
})

watch(
  ()=>route.fullPath, 
  ()=>{
    syncToRoute()
  }
)

</script>

<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <span class="eyebrow">微前端控制台</span>
        <h1>运营管理平台</h1>
        <p>统一入口，按业务模块加载订单系统和财务系统。</p>
      </div>

      <section class="sidebar-card">
        <h2>业务菜单</h2>
        <div class="menu-list">
          <button
            v-for="[name, meta] in buttons"
            :key="name"
            class="menu-button"
            :class="{ active: selectedAppName === name }"
            type="button"
            @click="handleAppSwitch(name)"
          >
            {{ meta.label.replace('子应用', '系统') }}
          </button>
        </div>
      </section>
    </aside>

    <main class="workspace">
      <header class="hero-panel">
        <div>
          <span class="eyebrow eyebrow-main">业务门户</span>
          <h2>统一承载多个业务模块</h2>
          <p>主应用负责导航和容器，具体业务模块在运行时按需加载。</p>
        </div>
        <div class="status-grid">
          <div class="status-card">
            <span>当前挂载</span>
            <strong>{{ currentAppLabel }}</strong>
          </div>
          <div class="status-card">
            <span>子应用最新路由</span>
            <strong>{{ currentRouteLabel }}</strong>
          </div>
        </div>
      </header>

      <section class="panel stage-panel">
        <div class="panel-head">
          <div>
            <h3>业务内容区</h3>
            <p>{{ stageMessage }}</p>
          </div>
          <span class="panel-tag">#subapp</span>
        </div>
        <div ref="subapp" class="subapp-host"></div>
      </section>
    </main>
  </div>
</template>