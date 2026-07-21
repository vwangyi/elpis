<script lang="ts">
/* eslint-disable */
class User {}
class User2 {}

type twoParams = new (arg1: any, arg2: any) => User;

type Inst = InstanceType<twoParams>; // 得到twoParams的返回值类型
</script>

<template>
  <div>hello</div>
</template>

<style scoped></style>
