import { useState, useEffect } from 'react'
import G6, { Graph } from './lib/g6'

const data = {
  nodes: [
    {
      id: '1',
      label: '请求回放1（开始）',
      type: 'begin',
    },
    {
      id: '2',
      label: '交易创建',
    },
    {
      id: '3',
      label: '请求回放3',
    },
    {
      id: '4',
      label: '请求回放4',
    },
    {
      id: '5',
      label: '请求回放5',
    },
    {
      id: '6',
      label: '请求回放6',
    },
    {
      id: '7',
      label: '请求回放2（结束）',
      type: 'end',
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
    },
    {
      source: '1',
      target: '3',
    },
    {
      source: '2',
      target: '5',
    },
    {
      source: '5',
      target: '6',
    },
    {
      source: '6',
      target: '7',
    },
    {
      source: '3',
      target: '4',
    },
    {
      source: '4',
      target: '7',
    },
  ],
}

export default function App() {
  let graph: Graph | null = null

  useEffect(() => {
    graph = new G6.Graph({
      container: 'container',
      width: innerWidth,
      height: innerHeight,
      layout: {
        type: 'dagre',
        rankdir: 'LR',
      },
      modes: {
        default: ['drag-canvas'],
      },
      defaultNode: {
        shape: 'aa',
        labelCfg: {
          style: {
            fill: '#fff',
            fontSize: 14,
          },
        },
      },
      defaultEdge: {
        shape: 'bb',
        style: {
          endArrow: true,
          lineWidth: 2,
          stroke: '#ccc',
        },
      },
    })
  }, [])

  useEffect(() => {
    graph?.data(data)
    graph?.render()
  }, [graph, data])

  return <div id="container" />
}
