<template>
  <select @change="onChange">
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :selected="value === option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String,
    options: Array
  },
  methods: {
    onChange(e) {
      // const options = Array.from(e.target);
      // const v = options.find(o => o.selected)?.value;
      // this.$emit('change', v);
      this.$emit('change', e.target.value);
    }
  }
};
</script>
