<script setup>
import * as THREE from 'three';
import { ref, onMounted, provide } from 'vue';

const props = defineProps({
  renderer: {
    type: Object,
    default() {
      return {};
    }
  },
  scene: {
    type: Object,
    default() {
      return {};
    }
  },
  camera: {
    type: Object,
    default() {
      return {};
    }
  }
});

const container = ref(null);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer(props.renderer);
renderer.setSize(window.innerWidth, window.innerHeight);

provide('scene', scene);

camera.position.set(...props.camera.position);
camera.lookAt(...(props.camera.lookAt || [0, 0, 0]));

onMounted(() => {
  container.value.appendChild(renderer.domElement);
  // 动画
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
</script>

<template>
  <div ref="container">
    <slot />
  </div>
</template>
