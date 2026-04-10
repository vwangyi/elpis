<script setup>
import useMap from './useMap.js';

useMap((map, AMap) => {
  const points = [
    {
      name: 'zsssssss',
      position: [116.397428, 39.90923]
    },
    {
      name: 'lssssssss',
      position: [116.41, 39.93]
    }
  ];

  for (const point of points) {
    const pointMarker = new AMap.Text({
      position: point.position,
      text: point.name,
      anchor: 'bottom-center', // 设置文本标记锚点
      draggable: true,
      cursor: 'pointer',
      style: {
        padding: '4px',
        'background-color': 'white',
        'border-width': 0,
        'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
        'text-align': 'center',
        'font-size': '12px',
        color: 'blue',
        'margin-bottom': '4px'
      }
    });
    map.add(pointMarker);
  }
});
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>
