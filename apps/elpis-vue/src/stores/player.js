import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/* player 播放器模块 */
export const usePlayerStore = defineStore('player', () => {
  /**
   * 开始播放
   * @param { 'amt' | 'aiqiyi' | 'youku' | 'tencent' | 'music' | 'native' } playerType 播放器类型 分别有 卓影 爱奇艺 优酷 腾讯 音乐 原生 （爱奇艺 优酷 腾讯 统称爱优腾）
   * @param { Boolean } isLive 是否是直播 默认false 不是直播 只有直播和点播
   * @param {*} playInfo
   * @param {*} playWidth
   * @param {*} playHeight
   * @param {*} playLeft
   * @param {*} playTop
   * @param {*} indxtime
   * @param {*} duration
   * @param {*} statusCallback
   */
  function playVideo(
    playerType,
    isLive = false,
    playInfo = {},
    playWidth = 0,
    playHeight = 0,
    playLeft = 0,
    playTop = 0,
    indxtime = 0,
    duration = 0,
    statusCallback
  ) {
    console.log('调用播放器启动播放方法playVideo');
    //播放参数
    startPlayerType = playerType;
    playerInfo = playInfo;
    playerWidth = playWidth;
    playerHeight = playHeight;
    playerLeft = playLeft;
    playerTop = playTop;
    _isLive = isLive;
    _indxtime = indxtime;
    _duration = duration;
    _statusCallback = statusCallback;

    //移除监听
    if (Listener) {
      console.log('移除监听');
      window.JsView?.removeEventListener('iqySDKInitResult', iqySDKInitListener);
      window.JsView?.removeEventListener('ykSDKInitResult', ykSDKInitListener);
      window.JsView?.removeEventListener('tencentSDKInitResult', tencentSDKInitListener);
      window.JsView?.removeEventListener('playerInitResult', initResultListener);
      window.JsView?.removeEventListener('playerState', stateListener);
    }

    //  播放器为空
    if (isPlayerInit == false) {
      console.log('播放器为空');
      //初始化爱优腾SDK,播放器类型playerType
      InitSDK(playerType);
      // setTimeout(() => {
      //     InitPlayers(playerType)
      // }, 1500);
      //卓影、音乐不需要初始化SDK,直接初始化卓影、音乐播放器，爱优腾的播放器初始化放在SDK初始化的监听回调中
      if (playerType == 0) {
        InitPlayers(playerType);
      } else if (playerType == 1 && isAiqiyiSDKInit) {
        InitPlayers(playerType);
      } else if (playerType == 2 && isYoukuSDKInit) {
        InitPlayers(playerType);
      } else if (playerType == 3 && isTencentSDKInit) {
        InitPlayers(playerType);
      } else if (playerType == 4) {
        InitPlayers(playerType);
      }
    }
    // 播放器不为空
    else {
      //如果正在播放则停止播放
      console.log('播放器不为空,先调用stop');
      window.playerService?.isPlaying() ? window.playerService?.stop() : '';
      //同类型播放器
      if (curentPlayer == playerType) {
        console.log('同类型播放器不需要切换内核');
        try {
          startPlay(startPlayerType, playerInfo, playerWidth, playerHeight, playerLeft, playerTop);
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      } else {
        //切换播放器内核
        switch (playerType) {
          case 0:
            console.log('切换amt内核');
            window.playerService?.changePlayerCore('amt');
            break;
          case 1:
            console.log('切换aiqiyi内核');
            window.playerService?.changePlayerCore('aiqiyi');
            break;
          case 2:
            console.log('切换youku内核');
            window.playerService?.changePlayerCore('youku');
            break;
          case 3:
            console.log('切换tencent内核');
            window.playerService?.changePlayerCore('tencent');
            break;
          case 4:
            console.log('切换music内核');
            window.playerService?.changePlayerCore('music');
            break;
          default:
            break;
        }
      }
    }

    // 爱奇艺SDK初始化监听
    window.JsView?.addEventListener('iqySDKInitResult', iqySDKInitListener);

    // 优酷SDK初始化监听
    window.JsView?.addEventListener('ykSDKInitResult', ykSDKInitListener);

    // 腾讯SDK初始化监听
    window.JsView?.addEventListener('tencentSDKInitResult', tencentSDKInitListener);

    // 播放器初始化监听
    initResultListener = playerInitResultListener(playerType, playInfo, playWidth, playHeight, playLeft, playTop);
    window.JsView?.addEventListener('playerInitResult', initResultListener);

    //播放状态监听
    stateListener = playerStateListener(statusCallback);
    window.JsView?.addEventListener('playerState', stateListener);

    //调用playVideo添加监听
    Listener = true;
  }
  /* 暂停播放 */
  function pause() {
    console.log('调用播放器暂停播放pause方法');
    if (Tools.inChildrenModel()) {
      console.log('pause儿童模式暂停计时');
      window.stopWatchRestTime?.();
    }
    return window?.playerService?.pause();
  }
  /* 恢复播放 */
  function resume() {
    if (Tools.inChildrenModel()) {
      console.log('resume儿童模式开始计时');
      window.watchRestTime?.();
    }
    return window?.playerService?.resume();
  }

  /* 停止播放 */
  function stop() {
    try {
      window?.playerService?.stop();
      restState();
      window?.playerService?.releasePlayer();
      if (Tools.inChildrenModel()) {
        console.log('stop儿童模式暂停计时');
        window.stopWatchRestTime?.();
      }

      window.JsView?.removeEventListener('playerState', stateListener);
      window.JsView?.removeEventListener('playerInitResult', initResultListener);
      window.JsView?.removeEventListener('iqySDKInitResult', iqySDKInitListener);
      window.JsView?.removeEventListener('ykSDKInitResult', ykSDKInitListener);
      window.JsView?.removeEventListener('tencentSDKInitResult', tencentSDKInitListener);
      return '播放器停止播放';
    } catch (error) {
      console.error('播放器停止播放时出错:', error);
      return '播放器停止播放失败';
    }
  }
  /* 设置播放器 快进快退 */
  function seekTo(position) {
    return window?.playerService?.seekTo(position);
  }
  /* 获取播放器播放状态 */
  function playerStatus() {
    //播放器为空
    let staueRes = 3; // 表示没有播放器
    if (window?.playerService?.isPlaying()) {
      //播放器正在播放状态
      staueRes = 0; // 表示 正在播放
    } else if (window?.playerService?.isPause()) {
      //播放器暂停状态
      staueRes = 1; // 表示 暂停
    } else if (window?.playerService?.isStop()) {
      //播放器停止状态
      staueRes = 2; // 表示 停止播放
    }
    return staueRes;
  }
  /* 设置播放器窗口大小 */
  function setPlayerLocationAndSize(w, h, l, t) {
    console.log('调用设置播放器窗口方法');
    let screen = window.androidInterfaceService?.getScreenInfo();
    let screenWidth = parseInt(screen.split('x')[0]);
    let screenHeight = parseInt(screen.split('x')[1]);
    console.log('屏幕分辨率2 ' + screenWidth + 'X' + screenHeight);
    console.log('--width--:' + w, '--height--:' + h, '--left--:' + l, '--top--:' + t);
    let ScalingRatio; //缩放比例
    ScalingRatio = 1080 / screenHeight; // 1080/720=1.5    1080/2160=0.5
    // 判断是否设置全屏
    isFullScreen = w === 1920 && h === 1080 ? 1 : 0;
    console.log('设置mode::' + isFullScreen);
    console.log('缩放比例::' + ScalingRatio);
    //设置播放器位置大小(判断屏幕分辨率对应缩放)
    window.playerService?.setPlayerSizeAndMode(
      isFullScreen,
      parseInt(w) / ScalingRatio,
      parseInt(h) / ScalingRatio,
      parseInt(l) / ScalingRatio,
      parseInt(t) / ScalingRatio
    );
  }

  /* 设置当前视频的倍速 */
  function setPlaySpeed(speed) {
    return window?.playerService?.setPlaySpeed(speed);
  }

  /* 获取当前视频总时长 */
  function getDuration() {
    return window?.playerService?.getDuration();
  }
  /* 获取当前播放时间 */
  function getCurrentPosition() {
    return window?.playerService?.getCurrentPosition();
  }
  /* 获取当前播放倍速 */
  function getPlaySpeed() {
    return window?.playerService?.getPlaySpeed();
  }
  /* 隐藏播放器界面 */
  function hidePlayer() {
    return window?.playerService?.hidePlayer();
  }
  /* 显示播放器界面 */
  function showPlayer() {
    return window?.playerService?.showPlayer();
  }
  /* 刷新播放器 */
  function refresh() {
    return window?.playerService?.invalidatePlayer();
  }
  return { refresh, showPlayer, hidePlayer, getPlaySpeed };
});
