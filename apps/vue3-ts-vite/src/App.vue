<script setup lang="ts">
interface A {
  T1: string;
}
interface B {
  T2: string;
}

interface C extends A, B {
  // interface可以多继承
  T3: boolean;
}
const u: C = {
  T1: '',
  T2: '',
  T3: true
};
console.log(u);
</script>

<template>
  <div>hello</div>
</template>

<style scoped></style>
