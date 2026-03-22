const data = [
  { month: '1月', todo: 100, done: 80 },
  { month: '2月', todo: 120, done: 90 },
  { month: '3月', todo: 130, done: 100 },
  { month: '4月', todo: 90, done: 70 },
  { month: '5月', todo: 150, done: 110 },
  { month: '6月', todo: 110, done: 80 },
  { month: '7月', todo: 180, done: 120 },
  { month: '8月', todo: 130, done: 90 },
  { month: '9月', todo: 150, done: 100 },
  { month: '10月', todo: 110, done: 80 },
  { month: '11月', todo: 180, done: 120 },
  { month: '12月', todo: 130, done: 90 },
]
  .map((d) => ({
    ...d,
    doneRate: (d.done / d.todo).toFixed(2),
  }))
  .sort((a, b) => b.doneRate - a.doneRate)
