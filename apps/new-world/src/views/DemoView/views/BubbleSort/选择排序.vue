<script setup lang="ts">
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
    let maxIndex = 0;
    for (let j = 0; j < arr.length - i; j++) {
      if (compare(arr[maxIndex] as number, arr[j] as number)) {
        maxIndex = j;
      }
      exchange(arr, maxIndex, arr.length - 1 - i);
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
