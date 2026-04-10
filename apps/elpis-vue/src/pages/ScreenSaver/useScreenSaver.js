// import { onMounted, ref, onUnmounted, reactive, computed, watch } from 'vue';
// import { getConfigDataApi } from '@/api/playDataApi.js';
// import { isPlayer } from '@/utils/remotePlayerService.js';
// import { useRoute, useRouter } from 'vue-router';
// import goPage from '@/views/MultiMode/js/goPage.js';
// import { getLiveApi } from '@/api/index.js';
// const router = useRouter();

// export const screenSaverSwitch = ref(false); // 屏保开关
// export const isShowScreenSaver = ref(false); // 是否显示屏保
// export const activeTime = ref(600); // 进入屏保时间，单位秒
// export const timeRemaining = ref(600); // 屏保倒计时剩余时间，单位秒
// export const intervalTime = ref(6); // 屏保间隔时间，单位秒
// export const intervalTimeCountdown = ref(0); // 屏保间隔时间倒计时，单位秒
// export const screenSaverData = ref([]); // 屏保内容数组，包含图片链接和跳转链接等信息
// const imageServer = getImageServer();
// // ============ 轮播相关状态 ============
// const currentIndex = ref(0); // 当前显示的图片索引
// const previousIndex = ref(-1); // 上一张图片索引（用于最后隐藏）
// export const imageVisible = ref([]); // 控制每张图片的显隐
// export const imageAnimation = reactive([]); // 存储每张图片的动画名称
// let hideCounter = 0; // 隐藏计数器（用于多图场景）

// export let activityCountdownTimer = ref(null);
// export let activityTimer = ref(null);
// export let countdownTimer = ref(null);
// export let carouselTimer = ref(null);

// const currentScreenSaver = computed(
//   () => screenSaverData.value[currentIndex.value]
// );

// /* ====================================================================== */

// /* 显示屏保 */
// function showScreenSaver() {
//   // '搜索逻辑要一样'
//   if (isPlayer.value === true) {
//     clearScreenSaverCountdown();
//     startScreenSaverCountdown();
//     return; // 当前有播放器 也不需要显示屏保
//   }
//   isShowScreenSaver.value = true;
// }

// /* 隐藏屏保 */
// export function hideScreenSaver() {
//   isShowScreenSaver.value = false;
// }

// /* 重置轮播状态 */
// function resetCarouselState() {
//   currentIndex.value = 0;
//   previousIndex.value = -1;
//   hideCounter = 0;

//   if (screenSaverData.value.length) {
//     // 重置显隐状态
//     for (let i = 0; i < screenSaverData.value.length; i++) {
//       imageVisible.value[i] = i === 0 ? 1 : 0;
//       imageAnimation[i] = i === 0 ? 'fullFadeIn 1s ease-in' : null;
//     }
//   }
// }

// /* 1. 进入屏保倒计时 */
// export function startScreenSaverCountdown() {
//   console.log(
//     '进入屏保倒计时',
//     isShowScreenSaver.value,
//     isPlayer.GlobalComponentsvalue
//   );
//   if (screenSaverSwitch.value === false) {
//     return;
//   }
//   if (isShowScreenSaver.value) {
//     return; // 屏保已经显示
//   }
//   if (isPlayer.value) {
//     return; // 当前有播放器 也不需要倒计时
//   }

//   // 清除旧定时器
//   clearScreenSaverCountdown();

//   // 重置倒计时显示
//   timeRemaining.value = activeTime.value;

//   // 启动新的倒计时
//   activityCountdownTimer.value = setInterval(() => {
//     if (timeRemaining.value > 0) {
//       timeRemaining.value--;
//     }
//   }, 1000);

//   // 启动新的定时器
//   activityTimer.value = setTimeout(() => {
//     showScreenSaver(); // 显示屏保
//     clearScreenSaverCountdown(); // 显示屏保后 一定要清除屏保倒计时
//     startCarouselCountdown(); // 启动轮播倒计时
//   }, activeTime.value * 1000);
// }

// /* 2. 清除屏保倒计时 */
// export function clearScreenSaverCountdown() {
//   timeRemaining.value = activeTime.value;
//   if (activityTimer.value) {
//     clearInterval(activityTimer.value);
//     activityTimer.value = null;
//   }
//   if (activityCountdownTimer.value) {
//     clearInterval(activityCountdownTimer.value);
//     activityCountdownTimer.value = null;
//   }
// }

// /* 启动轮播倒计时 */
// function startCarouselCountdown() {
//   if (screenSaverSwitch.value === false) {
//     return;
//   }
//   if (screenSaverData.value.length <= 1) {
//     return;
//   }
//   clearCarouselCountdown();
//   resetCountdown();
//   countdownTimer.value = setInterval(() => {
//     if (intervalTimeCountdown.value > 0) {
//       intervalTimeCountdown.value -= 1;
//     }
//   }, 1000);
//   carouselTimer.value = setInterval(() => {
//     switchToNextImage();
//   }, intervalTime.value * 1000);
// }
// /* 清除轮播倒计时 */
// export function clearCarouselCountdown() {
//   resetCountdown();
//   if (countdownTimer.value) {
//     clearInterval(countdownTimer.value);
//     countdownTimer.value = null;
//   }

//   if (carouselTimer.value) {
//     clearInterval(carouselTimer.value);
//     carouselTimer.value = null;
//   }
// }
// /* 重置倒计时 */
// function resetCountdown() {
//   intervalTimeCountdown.value = intervalTime.value;
// }

// /* 获取userGroup */
// function getUserGroup() {
//   let loginData = window.mainSharedInfoService?.getLoginData();
//   if (typeof loginData === 'string') loginData = JSON.parse(loginData);

//   if (loginData?.userGroup) {
//     return loginData?.userGroup?.split(/\|/)?.[0]; // 不存在返回undefined
//   }
// }

// function getImageServer() {
//   let loginRes =
//     window.mainSharedInfoService?.getLoginData() ??
//     window.bootupDataService?.getLoginData();
//   loginRes ? (loginRes = JSON.parse(loginRes)) : '';
//   let imageServer = loginRes?.imageServer;
//   console.log('imageServer', imageServer);
//   return imageServer;
// }

// /* 获取screensaveConfig60 */
// function getScreensaveConfig60() {
//   const infoService = JSON.parse(
//     window?.mainSharedInfoService?.getConfigData()
//   );
//   const dataService = JSON.parse(window?.bootupDataService?.getConfigData());

//   return (
//     infoService?.screensaveConfig60 || dataService?.screensaveConfig60 || {}
//   );
// }

// /* 获取屏保配置 */
// export async function getScreenSaverConfig() {
//   const userGroup = getUserGroup();
//   const userGroupList = ['6', 'epg5test12', '2', 'epg5test13'];
//   console.log('getScreenSaverConfiguserGroup', userGroupList, userGroup);
//   if (userGroupList.includes(userGroup)) {
//     screenSaverSwitch.value = false;
//     return false;
//   }
//   const {
//     switch: switchFlag,
//     positionCode,
//     activeTime: active,
//     intervalTime: interval
//   } = getScreensaveConfig60();
//   if (switchFlag !== 'on' || !positionCode) {
//     screenSaverSwitch.value = false;
//     hideScreenSaver(); // 隐藏屏保
//     return false;
//   }
//   console.log('getScreenSaverConfiguserGroup1不会执行');
//   const { status, items } = await getConfigDataApi(positionCode);
//   if (Number(status) === 200 && Array.isArray(items) && items.length) {
//     function replaceUrl(url, imageServer) {
//       if (!url || !imageServer) return '';
//       const isAbsolute = /^(https?:)?\/\//i.test(url);
//       if (!isAbsolute) {
//         return imageServer + '' + url;
//       } else {
//         return url;
//       }
//     }
//     screenSaverData.value = items
//       .filter(item => item?.linkType !== 'NullLink')
//       // .filter(((_, index) => index === 0))
//       .map(item => ({
//         ...item,
//         itemIcon: replaceUrl(item?.itemIcon, imageServer)
//       }));
//     activeTime.value = Number(active) >= 600 ? Number(active) : 600;
//     // activeTime.value = 20;
//     intervalTime.value = Number(interval) >= 6 ? Number(interval) : 6;
//     timeRemaining.value = activeTime.value;
//     intervalTimeCountdown.value = intervalTime.value;
//     screenSaverSwitch.value = true;
//     // 初始化显隐和动画数组
//     initCarouselArrays();
//     return true;
//   }
//   screenSaverSwitch.value = false;
//   return false;
// }

// /* 初始化轮播数组 */
// function initCarouselArrays() {
//   const len = screenSaverData.value.length;
//   for (let i = 0; i < len; i++) {
//     imageVisible.value[i] = i === 0 ? 1 : 0;
//     imageAnimation[i] = i === 0 ? 'fullFadeIn 1s ease-in' : null;
//   }
// }

// /* 处理多图场景的隐藏逻辑 */
// function handleMultiImageHide() {
//   const len = screenSaverData.value.length;
//   hideCounter++;

//   if (hideCounter >= 2) {
//     // 隐藏前一张已经淡出的图片
//     const prevIndex = currentIndex.value - 1;
//     const indexToHide = prevIndex < 0 ? len - 1 : prevIndex;
//     if (indexToHide !== currentIndex.value) {
//       imageVisible.value[indexToHide] = 0;
//     }
//     hideCounter = 0;
//   }
// }

// /* 切换到下一张图片 */
// function switchToNextImage() {
//   const len = screenSaverData.value.length;
//   if (len === 0) return;

//   const current = currentIndex.value;
//   const next = (current + 1) % len;

//   // 1. 当前图片开始淡出
//   if (current === len - 1) {
//     // 最后一张使用 fullFadeOutHide（最终会隐藏）
//     imageAnimation[current] = 'fullFadeOutHide 1s ease-out';
//     previousIndex.value = current;
//   } else {
//     imageAnimation[current] = 'fullFadeOut 1s ease-out';
//   }

//   // 2. 处理多图场景的隐藏逻辑
//   if (len > 2) {
//     handleMultiImageHide();
//   }

//   // 3. 切换到下一张
//   currentIndex.value = next;

//   // 4. 新图片显示并淡入
//   imageVisible.value[next] = 1;
//   imageAnimation[next] = 'fullFadeIn 1s ease-in';

//   // 重置倒计时
//   resetCountdown();
// }
// /* 动画结束处理 */
// export const handleAnimationEnd = (event, index) => {
//   const animationName = event.animationName;

//   if (animationName === 'fullFadeOut') {
//     // 普通淡出完成，隐藏元素
//     imageVisible.value[index] = 0;
//     imageAnimation[index] = null;
//   } else if (animationName === 'fullFadeOutHide') {
//     // 最后一张淡出完成，彻底隐藏
//     imageVisible.value[index] = 0;
//     imageAnimation[index] = null;
//     if (previousIndex.value !== -1) {
//       imageVisible.value[previousIndex.value] = 0;
//     }
//   } else if (animationName === 'fullFadeIn') {
//     // 淡入完成（可选：做额外处理）
//     console.log(`图片 ${index} 淡入完成`);
//   }
// };

// async function openCurrentScreenSaver() {
//   console.log('itemonclick23e ', currentScreenSaver.value);
//   //跳转逻辑：
//   let linkType = currentScreenSaver.value?.linkType;
//   let itemCode = currentScreenSaver.value?.itemCode;
//   let itemType = currentScreenSaver.value?.itemType;
//   let dataLink = currentScreenSaver.value?.dataLink;
//   // 跳点播全屏的信息
//   let childInfo = {
//     elapsedTime: '',
//     episodeIndex: '',
//     programId: ''
//   };
//   //参数处理：
//   if (
//     linkType === 'deepseek' ||
//     linkType === 'ai' ||
//     linkType === 'MatchDetail'
//   ) {
//     itemCode = currentScreenSaver.value?.itemSubTitle;
//   }
//   if (itemType === 'link') {
//     // 8.19 修改
//     try {
//       const responseUrl = dataLink;
//       const response = await getLiveApi(responseUrl);
//       console.log('response:' + JSON.stringify(response));
//       const link = response.link;
//       console.log('link:' + JSON.stringify(link));
//       linkType = link.type;
//       itemCode = link.url;
//     } catch (error) {}
//   }
//   console.log('onClickwy', linkType, itemCode, itemType, dataLink, childInfo);

//   await goPage(router, linkType, itemCode, itemType, dataLink, childInfo);
//   console.log('onClickwy gopage回来了');
//   return;
// }

// export function handleLifecycle(e) {
//   const { event } = e;
//   console.log('触发了 handleLifecycle', e);

//   // 非屏保状态下操作 都要重新计时
//   if (!isShowScreenSaver.value) {
//     clearScreenSaverCountdown();
//     clearCarouselCountdown();
//     hideScreenSaver(); // 隐藏屏保
//     startScreenSaverCountdown(); // 最后开始计时
//     return;
//   }

//   // 按 设置键触发10次  前五次为ON_PAUSE 后五次为ON_STOP 进入第三方页面（设置页）
//   if (
//     isShowScreenSaver.value &&
//     (event === 'ON_PAUSE' || event === 'ON_STOP')
//   ) {
//     clearScreenSaverCountdown();
//     clearCarouselCountdown();
//     hideScreenSaver(); // 隐藏屏保
//   }

//   // 按 返回键触发14次 前7次为ON_START 后7次为ON_RESUME 比如从第三方页面（设置页）回来
//   if (
//     isShowScreenSaver.value &&
//     (event === 'ON_START' || event === 'ON_RESUME')
//   ) {
//     clearScreenSaverCountdown();
//     clearCarouselCountdown();
//     hideScreenSaver(); // 隐藏屏保
//   }

//   // 按 首页键触发2次 一次是ON_PAUSE 第二次是ON_RESUME  上面两个if刚好解决首页键的问题
// }

// export async function handleDispatcher(event) {
//   const { KeyCode } = event;
//   // OK键
//   console.log('触发了dispatcher', event);
//   //  82: 'MENU',
//   //  176: '设置键',
//   //  4: '返回键',
//   //  21: '左键',
//   //  22: '右键',
//   //   19: '上键',
//   //   20: '下键',
//   //   23: '确认键', // 中间的ok键

//   // 非屏保状态下操作 都要重新计时
//   if (!isShowScreenSaver.value) {
//     clearScreenSaverCountdown();
//     clearCarouselCountdown();
//     hideScreenSaver(); // 隐藏屏保
//     startScreenSaverCountdown(); // 最后开始计时
//     return;
//   }

//   /* 当前存在屏保 且 按键不是 ok键 */
//   if (isShowScreenSaver.value && KeyCode !== 23) {
//     console.log('应该退出屏保');
//     clearScreenSaverCountdown();
//     clearCarouselCountdown();
//     hideScreenSaver(); // 隐藏屏保
//   }

//   /* 当前存在屏保 且 按键为 ok键 */
//   if (isShowScreenSaver.value && KeyCode === 23) {
//     console.log(
//       '进入屏保后。点击屏保链接， 存在bug， 会进入焦点 而不会进入屏保链接'
//     );
//     // 停止倒计时
//     // 停止轮播
//     await openCurrentScreenSaver();
//     clearScreenSaverCountdown();
//     clearCarouselCountdown();
//     hideScreenSaver(); // 隐藏屏保
//   }
// }
