<script setup lang="ts">
// Quick Sort 快速排序   比我小站左边 比我大站右边

// 这是基本的写法 用性能换取容易理解

const arr = [4, 1, 6, 9, 3, 2, 8, 7];
function quickSort(arr: number[]): number[] {
  if (!(Array.isArray(arr) && arr.length)) return [];

  // 选班长
  const leader = arr[0] as number;
  // 小的站左边 大的站右边
  let left: number[] = [];
  let right: number[] = [];
  for (let i = 1; i < arr.length; i++) {
    if ((arr[i] as number) < leader) left.push(arr[i] as number);
    else right.push(arr[i] as number);
  }
  return [...quickSort(left), leader, ...quickSort(right)];
}
console.log(quickSort(arr));
</script>

<template>
  <div>
    {{ quickSort(arr) }}
  </div>
</template>
