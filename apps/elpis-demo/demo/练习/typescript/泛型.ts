// interface中的泛型
interface InputProps<T> {
  value: T
  prevValue: T
}

const obj: InputProps<string> = {
  value: '',
  prevValue: '',
}

// 数组的使用
// const arr: number[] = [1, 2, 3];
// const arr: Array<number> = [1, 2, 3];

// 函数中的使用
function map<T, S>(arr: T[], getItem: (item: T) => S): S[] {
  const res: S[] = []
  for (const item of arr) {
    const newItem = getItem(item)
    res.push(newItem)
  }
  return res
}

// 实现some
function some<T>(arr: T[], getCondition: (item: T) => boolean): boolean {
  for (const item of arr) {
    const condition = getCondition(item)
    if (condition) {
      return true
    }
  }
  return false
}

// nginx >> engine x

// [1, 2, 3] >>> [1, 4, 9]
console.log(map<number, number>([1, 2, 3], (n) => n ** 2))
console.log(
  map<string, { name: string }>(['zs', 'ls', 'ww'], (name) => ({
    name,
  })),
)
