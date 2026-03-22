import G6, { IGroup, Item } from '@antv/g6'

// 注册各种东西
G6.registerNode(
  'aa',
  {
    drawShape(cfg, group) {
      console.log(123)
      const rect = (group as IGroup).addShape('rect', {
        attrs: {
          x: -75,
          y: -25,
          width: 150,
          height: 50,
          radius: 4,
          fillOpacity: 1,
          fill: 'red',
        },
      })
      return rect
    },
    // 设置状态
    setState(name, value, item) {
      var group = (item as Item).getContainer()
      var shape = group.get('children')[0] // 顺序根据 draw 时确定

      if (name === 'selected') {
        if (value) {
          shape.attr('fill', '#F6C277')
        } else {
          shape.attr('fill', '#FFD591')
        }
      }
    },

    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ]
    },
  },
  'single-shape',
)

const defaultPostion = { x: 0, y: 0 }

G6.registerEdge('bb', {
  itemType: 'edge',
  draw(cfg, group) {
    var startPoint = cfg?.startPoint || defaultPostion
    var endPoint = cfg?.endPoint || defaultPostion
    var centerPoint = {
      x: (startPoint.x + endPoint.x) / 2,
      y: (startPoint.y + endPoint.y) / 2,
    }
    // 控制点坐标
    var controlPoint = {
      x: (startPoint.x + centerPoint.x) / 2,
      y: startPoint.y,
    }

    // 为了更好的展示效果, 对称贝塞尔曲线需要连到箭头根部
    var path = (group as IGroup).addShape('path', {
      attrs: {
        path: [
          ['M', startPoint.x, startPoint.y],
          ['Q', controlPoint.x + 8, controlPoint.y, centerPoint.x, centerPoint.y],
          ['T', endPoint.x - 8, endPoint.y],
          ['L', endPoint.x, endPoint.y],
        ],
        stroke: '#ccc',
        lineWidth: 1.6,
        endArrow: {
          path: 'M 4,0 L -4,-4 L -4,4 Z',
          d: 4,
        },
      },
    })

    // 如果是不对称的贝塞尔曲线，需要计算贝塞尔曲线上的中心点
    // 参考资料 https://stackoverflow.com/questions/54216448/how-to-find-a-middle-point-of-a-beizer-curve
    // 具体Util方法可以参考G：https://github.com/antvis/g/blob/4.x/packages/g-math/src/quadratic.ts

    return path
  },
})

export default G6
export { Graph } from '@antv/g6'
