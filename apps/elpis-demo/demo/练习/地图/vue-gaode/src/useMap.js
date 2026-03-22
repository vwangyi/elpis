import { onMounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

export default function useMap(callback) {
  onMounted(() => {
    AMapLoader.load({
      key: '758243bc2f718078ab06b843cdf7bf1e', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
      const map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 12, //初始化地图级别
        center: [116.397428, 39.90923], //初始化地图中心点位置
      })

      // 封装函数时使用回调函数
      // 使用者：知道函数逻辑 不知道什么时候调用
      // 封装者：不知道函数逻辑 知道什么时候调用
      callback(map, AMap)
    })
  })
}
