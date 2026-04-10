<script setup>
import { PointLight, Color } from 'three';
import { inject } from 'vue';

const props = defineProps({
  position: {
    type: Array,
    default: () => [0, 0, 0]
  },
  color: {
    type: String, // '#fff' | rgba(0, 0, 0, 1)
    default: '#fff'
  },
  // 光照强度
  intensity: {
    type: Number,
    default: 1
  }
});

const scene = inject('scene');

const light = new PointLight(new Color(props.color), props.intensity);
light.position.set(...props.position);
scene.add(light);
</script>

<template></template>
