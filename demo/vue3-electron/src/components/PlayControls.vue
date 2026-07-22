<template>
  <!-- 控制面板 -->
  <div class="player_controls">
    <!-- 控制面板上方部分 -->
    <div class="audio">
      <div class="play-container">
        <!-- 播放按钮 -->
        <div class="playBtnContainer">
          <div
            class="playBtn amplitude-play-pause"
            :class="{
              'amplitude-playing': isPlaying,
              'amplitude-paused': !isPlaying
            }"
            @click="togglePlay"
          ></div>
        </div>
        <!-- 播放时间 -->
        <div class="time-container">
          <!-- 当前时间 -->
          <span class="current-time">
            <span class="amplitude-current-minutes"></span>:<span
              class="amplitude-current-seconds"
            ></span>
          </span>
          <span class="separator">/</span>
          <!-- 总时长 -->
          <span class="duration">
            <span class="amplitude-duration-minutes"></span>:<span
              class="amplitude-duration-seconds"
            ></span>
          </span>
        </div>
        <!-- 播放进度 -->
        <!-- 注意这里播放进度的滑块儿和音量控制的滑块儿在同一个 div 里面 -->
        <div class="progress-volume-container">
          <!-- 播放进度滑块儿 -->
          <div
            class="progress-container"
            :style="{ width: progressContainerWidth }"
          >
            <input
              type="range"
              v-model="currentSongProgess"
              @input="updateSongProgress"
            />
          </div>
          <!-- 音量控制滑块儿 -->
          <div
            class="volume-container"
            :style="{
              width: volumeContainerWidth,
              display: volumeContainerDisplay
            }"
          >
            <input type="range" v-model="currentVolume" @input="updateVolume" />
          </div>
        </div>
        <!-- 静音按钮 -->
        <div
          class="mute-button amplitude-mute"
          :class="{
            'amplitude-muted': isMuted,
            'amplitude-not-muted': !isMuted
          }"
          @click="toggleMute"
          @mouseenter="showVolumeControl"
        ></div>
      </div>
    </div>
    <!-- 控制面板下方部分 -->
    <div class="addl-controls">
      <button class="prev btn" @click="prevSong">
        <i class="fa-solid fa-backward"></i>
      </button>
      <button
        class="shuffle btn"
        :class="{
          'shuffle-active': isShuffle
        }"
        @click="toggleShuffle"
      >
        <i class="fa-solid fa-shuffle"></i>
      </button>
      <button class="next btn" @click="nextSong">
        <i class="fa-solid fa-forward"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Amplitude from 'amplitudejs/dist/amplitude.min.js';
import { useMusicStore } from '../store';
const musicStore = useMusicStore();
// 定义一个控制是否播放的状态
const isPlaying = ref(false);
// 定义一个控制静音的状态
const isMuted = ref(false);
// 定义一个控制是否随机播放的状态
const isShuffle = ref(false);

// 用于记录之前的音量
let volume = 0;

// 该方法用于切换播放状态
function togglePlay() {
  // 可以获取当前的状态 playing、pasued、stopped
  const playState = Amplitude.getPlayerState();
  if (playState === 'playing') {
    Amplitude.pause(); // 暂停播放
    isPlaying.value = false;
  } else if (playState === 'paused' || playState === 'stopped') {
    Amplitude.play(); // 开始播放
    isPlaying.value = true;
  }
}

// 该方法用于切换静音状态
function toggleMute() {
  console.log('first');
  if (isMuted.value) {
    // 新版本的 Amplitude 没有提供静音方法，只提供了 setVolume 方法
    Amplitude.setVolume(volume); // 取消静音
    isMuted.value = false;
  } else {
    volume = Amplitude.getVolume(); // 获取当前音量
    Amplitude.setVolume(0); // 设置音量为 0
    isMuted.value = true;
  }
}

// 上一曲
function prevSong() {
  Amplitude.prev();
  musicStore.updateCurrentSong();
}

// 下一曲
function nextSong() {
  Amplitude.next();
  musicStore.updateCurrentSong();
}

// 切换随机播放状态
function toggleShuffle() {
  // 获取当前的随机播放状态
  const shuffleState = Amplitude.getShuffle();
  if (shuffleState) {
    Amplitude.setShuffle(false); // 关闭随机播放
    isShuffle.value = false;
  } else {
    Amplitude.setShuffle(true); // 开启随机播放
    isShuffle.value = true;
  }
}

// 对应的进度条容器、声音进度条对应的宽度和显示
const progressContainerWidth = ref('100%');
const volumeContainerWidth = ref('0%');
const volumeContainerDisplay = ref('none');

// 当前歌曲的播放进度
const currentSongProgess = ref(0);
// 更新歌曲的播放进度
function updateSongProgress() {
  // 首先第一步，我们需要计算播放进度的百分比
  const percentage =
    (currentSongProgess.value / 100) * Amplitude.getSongDuration();
  // 接下来再根据计算出来的百分比来设置播放进度
  Amplitude.setSongPlayedPercentage(
    (percentage / Amplitude.getSongDuration()) * 100
  );
}

// 当前的音量
const currentVolume = ref(Amplitude.getVolume());
// 更新当前的音量
function updateVolume() {
  Amplitude.setVolume(currentVolume.value);
}

// 显示音量控制
function showVolumeControl() {
  progressContainerWidth.value = '60%';
  volumeContainerWidth.value = '35%';
  volumeContainerDisplay.value = 'block';
}
// 隐藏音量控制，就是上方显示音量控制的逆操作
function hideVolumeControl() {
  progressContainerWidth.value = '100%';
  volumeContainerWidth.value = '0%';
  volumeContainerDisplay.value = 'none';
}

onMounted(() => {
  document.addEventListener('click', hideVolumeControl, false);
  // 我们这里需要阻止冒泡，防止用户在滑动音量控制的时候触发隐藏音量控制
  document.querySelector('.volume-container').addEventListener('click', e => {
    e.stopPropagation();
  });
});

onBeforeUnmount(() => {
  // 组件卸载时移除事件监听
  document.removeEventListener('click', hideVolumeControl, false);
});
</script>

<style scoped>
/* Controls */
.player_controls {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 7rem;
  margin-top: 0.3rem;
  overflow: hidden;
  background: var(--bg-2);
}
.player_controls:before {
  position: absolute;
  content: '';
  height: 3rem;
  width: 16.5rem;
  margin-top: 2rem;
  border-radius: 40%;
  border-color: transparent gray gray gray;
  border-width: 0.3rem;
  border-style: solid;
}
.player_controls:hover::before {
  transition: all 0.5s ease-in-out;
  border-color: transparent #fff #fff #fff;
}
.player_controls:hover::after {
  transition: all 0.5s ease-in-out;
  background: var(--white);
}

.addl-controls {
  position: relative;
  top: 20px;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.3rem 0.8rem;
  height: 2.5rem;
  width: 8rem;
  margin-top: -1rem;
  z-index: 1;
  border-radius: 0.5rem;
  background: var(--gray);
  transform: translate(2.5rem, 0.7rem) rotate(-3.5deg);
}
.addl-controls:hover {
  background: var(--white);
}
.addl-controls:hover .btn {
  color: var(--black);
  border-radius: 0.5rem;
}

.btn {
  font-size: 0.8rem;
  outline: none;
  border: none;
  padding: 0.4rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: var(--white);
  background: transparent;
  transform: scale(1);
}
.btn:hover {
  transition: all 0.3s ease-in-out;
  transform: scale(1.8);
}

.shuffle-active {
  color: var(--black);
  background: var(--white);
  border-radius: 0.5rem;
}

/* 重写控制面板 */
.play-container {
  width: 300px;
  height: 40px;
  /* outline: 1px solid; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: 15px;
}

.playBtnContainer {
  width: 15%;
  height: 100%;
  /* outline: 1px solid; */
  display: flex;
  align-items: center;
  /* justify-content: center; */
  margin-right: 5px;
}

/* 播放按钮 */
.playBtn {
  width: 35px;
  height: 35px;
  /* outline: 1px solid; */
}

.playBtn.amplitude-play-pause.amplitude-playing {
  background: url('/src/assets/images/baseline-pause_circle_filled-24px.svg')
    center no-repeat;
  background-size: 30px;
  background-color: var(--gray);
  border-radius: 5px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.playBtn.amplitude-play-pause.amplitude-paused {
  background: url('/src/assets/images/baseline-play_circle_filled-24px.svg')
    center no-repeat;
  background-size: 30px;
  background-color: var(--gray);
  border-radius: 5px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

/* 显示播放时间 */
.time-container {
  width: 25%;
  height: 100%;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  /* outline: 1px solid; */
}

.time-container > .separator {
  margin: 0 5px;
}

/* 进度条和音量控制面板 */
.progress-volume-container {
  width: 60%;
  height: 100%;
  /* outline: 1px solid var(--white); */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 进度条 */
.progress-container {
  width: 100%;
  height: 100%;
  /* outline: 1px solid; */
  display: flex;
  align-items: center;
  padding: 0 10px;
  transition: 0.5s;
}

.progress-container > input {
  width: 100%;
}

input[type='range'] {
  display: flex;
  appearance: none;
  width: 100%;
  background: transparent;
}

/* 设置已滑动部分（track）的样式 */
input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  background: #888888; /* 已滑动部分的颜色 */
  border-radius: 4px;
}

/* 设置滑块（thumb）的样式 */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 1px solid #d2cdcd; /* 滑块边框颜色 */
  height: 14px; /* 滑块高度 */
  width: 14px; /* 滑块宽度 */
  border-radius: 50%; /* 滑块为圆形 */
  background: #fff; /* 滑块背景颜色 */
  margin-top: -5px; /* 修正滑块位置 */
  cursor: pointer;
}

/* 静音按钮 */
.mute-button {
  width: 40px;
  height: 90%;
  /* outline: 1px solid; */
}

.mute-button.amplitude-mute.amplitude-not-muted {
  background: url('/src/assets/images/baseline-volume_up-24px.svg') center
    no-repeat;
  background-size: 25px;
  background-color: var(--gray);
  border-radius: 5px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.mute-button.amplitude-mute.amplitude-muted {
  background: url('/src/assets/images/baseline-volume_off-24px.svg') center
    no-repeat;
  background-size: 25px;
  background-color: var(--gray);
  border-radius: 5px;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.volume-container {
  width: 0%;
  display: none;
}
</style>
