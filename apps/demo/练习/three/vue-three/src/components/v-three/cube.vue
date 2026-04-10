<script setup>
import * as THREE from 'three';
import { inject, onUpdated } from 'vue';

const props = defineProps({
  position: {
    type: Array,
    default: () => [0, 0, 0]
  },
  size: {
    type: Array,
    default: () => [1, 1, 1]
  },
  material: {
    type: Object,
    default: () => ({})
  }
});

const scene = inject('scene');

const geometry = new THREE.BoxGeometry(...props.size);
const material = new THREE.MeshPhongMaterial({
  ...props.material,
  color: new THREE.Color(props.material.color || '#fff')
});
const cube = new THREE.Mesh(geometry, material);
cube.position.set(...props.position);

scene.add(cube);

onUpdated(() => {
  cube.scale.set(...props.size);
  cube.position.set(...props.position);
});
</script>

<template></template>
