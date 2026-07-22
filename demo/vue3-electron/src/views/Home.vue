<template>
  <div id="music" class="music">
    <div class="music-player" id="music-player">
      <Header />
      <AlbumDetails />
    </div>
    <div>
      <PlayControls />
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import AlbumDetails from '../components/AlbumDetails.vue';
import PlayControls from '../components/PlayControls.vue';
import Footer from '../components/Footer.vue';
</script>

<style scoped>
.music {
  position: relative;
  background: var(--bg-2);
  width: 25rem;
  height: 100vh;
  /* border-radius: 0.5rem; */
  overflow: hidden;
}

.music-player {
  padding: 0 2rem;
  height: 28rem;
}
</style>
