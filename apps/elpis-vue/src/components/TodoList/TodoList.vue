<script setup>
import { computed, ref } from "vue";

const list = ref([]);
const inputValue = ref("");

const calcList = computed(() => list.value.map((item, index) => ({ id: index, ...item })));

function handleInputEnter(e) {
  if (e.key !== "Enter") return;
  console.log("enter", e.target.value, inputValue.value);

  inputValue.value = e.target.value;
  list.value.unshift({ text: e.target.value });
  inputValue.value = "";
}
</script>

<template>
  <div class="todo-list">
    <input type="text" :value="inputValue" @keydown="handleInputEnter" />
    <div v-for="{ id, text } in calcList" :key="id" class="list">
      <div>id: {{ id }}</div>
      <div>text: {{ text }}</div>
    </div>
  </div>
</template>

<style scoped>
@import "./style.scss";
.todo-list {
  border: 1px solid red;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > div:nth-child(1) {
    margin-right: 16px;
  }
}
</style>
