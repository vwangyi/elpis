import { createRouter, createWebHashHistory } from 'vue-router'
import { manifest } from '../manifest'

// 占位组件只负责让这条路由合法命中，真正的子应用内容后面由主应用手动挂载。
const RoutePlaceholder = {
  template: '<div></div>',
}

// 从子应用默认路径里提取业务前缀，比如从 /orders/list 提取出 orders。
function getBaseSegment(appName) {
  const [, segment] = manifest[appName].defaultPath.split('/')
  return segment
}

// 主应用读地址栏时，先把旧格式或重复前缀的路径收敛成标准格式。
// 这个函数主要是在做“路径纠偏”：
// 标准格式希望是 /orders/detail/2048、/finance/bills 这样只带一层业务前缀。
// 但如果因为历史兼容或外部跳转，拿到的是 /finance/finance/invoice/908 这种重复前缀路径，
// 这里就要把它收敛回 /finance/invoice/908，避免后面主应用和子应用用的不是同一套路径格式。
function normalizeHostChildPath(appName, path) {
  const baseSegment = getBaseSegment(appName)
  // 先把路径拆成干净的片段，方便后面判断有没有“重复前缀”。
  // 例如 /finance/finance/invoice/908 会变成：['finance', 'finance', 'invoice', '908']
  const segments = path.split('/').filter(Boolean)

  // 这个 if 判断的是：
  // 1. 路径至少有两段；
  // 2. 第二段又正好等于当前子应用的业务前缀。
  // 满足这两个条件时，就说明路径里出现了重复前缀。
  // 例如当前是 finance 子应用：
  // - /finance/invoice/908 的第二段是 invoice，不重复，直接跳过这个 if
  // - /finance/finance/invoice/908 的第二段还是 finance，说明多套了一层旧前缀，需要收敛
  if (segments.length >= 2 && segments[1] === baseSegment) {
    // 这里保留第一层标准前缀，再把后面的真实业务路径拼回去。
    // 例如 ['finance', 'finance', 'invoice', '908'] 会收敛成 /finance/invoice/908。
    return `/${[baseSegment, ...segments.slice(2)].join('/')}`
  }

  // 如果本来就是标准格式，例如 /orders/list 或 /finance/bills，就原样返回。
  return path
}

// 为某个子应用生成一条宿主路由规则，让主应用先根据 URL 前缀认出该加载谁。
function createMicroAppRoute(appName) {
  const baseSegment = getBaseSegment(appName)

  return {
    path: `/${baseSegment}/:childPath(.*)*`,
    component: RoutePlaceholder,
    meta: {
      appName,
    },
  }
}

// 把子应用内部路径转换成主应用最终写入地址栏的宿主路径。
// 这里不会额外去拼 appName，因为 childPath 本身已经带了业务前缀。
// 例如订单子应用传入 /orders/detail/2048，结果还是 /orders/detail/2048；
// 如果传入的是 orders/detail/2048，这里会补成 /orders/detail/2048。
// appName 主要是给默认值用的：当没有传 childPath 时，就退回 manifest 里该子应用的 defaultPath。
export function buildHostPath(appName, childPath = manifest[appName].defaultPath) {
  return childPath.startsWith('/') ? childPath : `/${childPath}`
}

// 从当前宿主路由里反推出“现在应该加载哪个子应用、它当前应该停在哪个内部页面”。
// 例如当前地址是 /orders/detail/2048，这里会得到：
// { appName: 'order', childPath: '/orders/detail/2048' }
// 例如当前地址是 /finance/bills，这里会得到：
// { appName: 'finance', childPath: '/finance/bills' }
// 如果当前地址只是 /，说明还没有明确落到某个业务页，
// 这里就回退到该子应用在 manifest 里配置的默认页，例如订单默认回到 /orders/list。
// 这个返回结果会交给主应用的 App.vue 使用，后面它就知道该加载谁、挂到哪里、初始路由是什么。
export function getRouteState(route) {
  // appName 来自前面 createMicroAppRoute() 挂到 meta 里的标记。
  // 如果当前路由没有命中业务前缀，就先默认按 order 处理。
  const appName = route.meta.appName ?? 'order'
  // 根路径 / 本身没有具体业务含义，所以这里要替换成该子应用的默认业务页。
  const path = route.path === '/' ? manifest[appName].defaultPath : route.path

  return {
    appName,
    // 再把最终路径收敛成主应用内部统一使用的 childPath，供后续挂载和路由同步使用。
    childPath: normalizeHostChildPath(appName, path),
  }
}

// 创建主应用自己的路由器：先注册各子应用前缀，再用最后一条规则兜底未知地址。
export function createHostRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      createMicroAppRoute('order'),
      createMicroAppRoute('finance'),
      // 这是最后一条兜底规则：前面订单、财务两条都没命中时，说明当前 URL 不属于已知子应用。
      // path 里的 /:pathMatch(.*)* 是 Vue Router 4 常见的“全匹配”写法：
      // :pathMatch 是参数名，表示把匹配到的内容收进这个参数里；
      // (.*) 是正则，意思是“匹配任意字符”；
      // 最后的 * 表示这个参数可以重复匹配多个路径片段。
      // 例如 /foo/bar/baz 这种未知地址，也会被这一条接住，而不会直接落成空白页。
      // 这里接住以后，不展示 404，而是统一重定向到订单子应用的默认页 /orders/list，
      // 这样就算地址输错了，主应用也能回到一个可正常展示的业务页面。
      {
        path: '/:pathMatch(.*)*',
        redirect: buildHostPath('order'),
      },
    ],
  })
}