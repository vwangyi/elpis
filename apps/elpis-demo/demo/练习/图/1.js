const data = [
  { source: 0, target: 1 },

  { source: 1, target: 2 },
  { source: 1, target: 3 },
  { source: 1, target: 4 },

  { source: 2, target: 5 },
  { source: 2, target: 6 },

  { source: 3, target: 11 },
  { source: 3, target: 4 },

  // { source: 4, target: 11 },

  { source: 5, target: 7 },
  { source: 5, target: 8 },

  { source: 6, target: 9 },
  { source: 6, target: 10 },

  { source: 7, target: 11 },
  { source: 8, target: 11 },
  { source: 9, target: 11 },
  { source: 10, target: 11 },
]

function getMatrix(data) {
  const map = {}
  for (const d of data) {
    map[d.source] = 0
    map[d.target] = 0
  }
  const matrix = {}
  for (const k in map) {
    matrix[k] = { ...map }
  }
  for (const { source, target } of data) {
    matrix[source][target] = 1
  }
  return matrix
}

function getPaths(matrix, source, target) {
  const paths = []
  ;(function run(source) {
    // source为2选出5, 6
    // source为5选出7, 8
    // 选出所有值为1的
    const nextSources = Object.keys(matrix[source]).filter((k) => matrix[source][k]) // 7, 8
    // 找出模板path
    const tmpPathIdx = paths.findIndex((p) => p.slice(-1)[0] == source)
    const tmpPath = paths[tmpPathIdx] || [source]
    // 删除原链路
    paths.splice(tmpPathIdx, 1)
    paths.push(...nextSources.map((s) => tmpPath.concat(s)))

    for (const nextSource of nextSources) {
      if (nextSource != target) {
        run(nextSource)
      }
    }
  })(source)
  return paths
}

console.log(getPaths(getMatrix(data), 0, 11))
console.log(getPaths(getMatrix(data), 2, 11))
console.log(getPaths(getMatrix(data), 3, 4))
console.log(getPaths(getMatrix(data), 4, 5))
