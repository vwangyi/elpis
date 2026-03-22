<script setup>
import Stage from './components/v-three/stage.vue'
import PointLight from './components/v-three/point-light.vue'
import Cube from './components/v-three/cube.vue'
import { ref } from 'vue'

// const height = ref(.1);

// setInterval(() => {
//   height.value += .1;
// }, 100);
</script>

<template>
  <div ref="container">
    <Stage
      :renderer="{ antialias: true }"
      :camera="{
        position: [0, 6, 6],
        lookAt: [0, 0, 0],
      }"
    >
      <Cube
        :size="[0.5, 0.5, 0.5]"
        :position="[-2, 0, 0]"
        :material="{
          color: 'red',
        }"
      />
      <Cube
        :size="[1, 1, 1]"
        :position="[0, 0, 0]"
        :material="{
          color: 'green',
        }"
      />
      <Cube
        :size="[1.5, 1.5, 1.5]"
        :position="[2, 0, 0]"
        :material="{
          color: 'blue',
        }"
      />
      <PointLight :position="[10, 20, 30]" color="#fff" />
      <PointLight :position="[-10, -20, -30]" color="#aaa" />
    </Stage>
  </div>
</template>
