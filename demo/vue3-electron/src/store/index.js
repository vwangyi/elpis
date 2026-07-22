import { defineStore } from 'pinia';
import Amplitude from 'amplitudejs/dist/amplitude.min.js';
export const useMusicStore = defineStore('music', {
  state: () => ({
    albumCover: '', // 当前唱片封面
    albumTitle: '', // 当前唱片标题
    albumArtist: '', // 当前唱片艺术家
    navigationDirection: 'forward' // 该状态用于跟踪导航的方向
  }),
  actions: {
    // 更新当前播放的歌曲信息
    updateCurrentSong() {
      // 获取当前正在播放的歌曲的信息
      const song = Amplitude.getActiveSongMetadata();
      // 然后进行一个更新操作
      this.albumCover = song.cover_art_url;
      this.albumTitle = song.name;
      this.albumArtist = song.artist;
    },
    // 设置导航方向
    // 回头导航的方向就两个是，回退是“backward”，而向前导航的方向是“forward”
    setNavigationDirection(direction) {
      this.navigationDirection = direction;
    }
  }
});
