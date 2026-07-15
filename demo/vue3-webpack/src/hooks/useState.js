import { ref } from 'vue';
export function useState(value = undefined) {
  const state = ref(value);
  const setState = value => (state.value = value);
  return [state, setState];
}
