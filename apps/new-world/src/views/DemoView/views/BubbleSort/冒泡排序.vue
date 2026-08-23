<script setup lang="ts">
// 冒泡排序

const arr = [4, 1, 6, 9, 3, 2, 8, 7];
function compare(a: number, b: number) {
  // js数组的sort方法传入的回调就是compare
  if (a > b) return true;
  return false;
}
function exchange(arr: number[], a: number, b: number) {
  // if (typeof arr[b] === 'number' && typeof arr[a] === 'number') {
  const tmp: number = arr[a] as number;
  arr[a] = arr[b] as number;
  arr[b] = tmp;
  // }
}

function sort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (compare(arr[j] as number, arr[j + 1] as number)) {
        exchange(arr, j, j + 1);
      }
    }
  }
}

sort(arr);
console.log(arr);
</script>

<template>
  <div>
    {{ JSON.stringify(arr) }}
  </div>
</template>
