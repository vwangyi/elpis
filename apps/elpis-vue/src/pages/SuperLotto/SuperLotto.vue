<script setup lang="ts">
import { frontSection, backZone } from './data';
</script>

<template>
  <div>
    {{ backZone }}

    <iframe
      v-if="false"
      :style="{ width: '100vw', height: '100vh' }"
      src="https://www.lottery.gov.cn/xytc/"
      frameborder="0"
    ></iframe>
  </div>
</template>
