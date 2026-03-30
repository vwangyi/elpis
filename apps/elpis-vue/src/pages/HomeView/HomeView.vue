<script setup>
import { useRouter } from 'vue-router';
import { isArray } from 'elpis-utils';
import logo from '@/assets/logo.png';
import light from '@/assets/light.png';
import dark from '@/assets/dark.png';
import { ref, useTemplateRef, computed, provide } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useCategoryStore } from '@/stores/category.js';
import { useUserStore } from '@/stores/user.js';
import RichEditor from '@/components/RichEditor/RichEditor.vue';
import CardList from '@/components/CardList/CardList.vue';
import ElpisEditor from '@/components/ElpisEditor/ElpisEditor.vue';

const test = ref(123);

setInterval(() => {
  test.value++;
}, 2000);

provide('haha', {
  test
});

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const categoryStore = useCategoryStore();
const categoryList = computed(() => categoryStore.categoryList);
const logined = computed(() => !!authStore?.userInfo?.userId);
const userInfo = computed(() => authStore.userInfo);
const theme = computed(() => (false ? dark : light));
// 当前选中的tab  home | publish | messages | profile （主页 发布 消息 我的）
const activeTabbar = ref('home');

const componentMapTabbar = {
  home: CardList,
  publish: ElpisEditor,
  publish: RichEditor,
  messages: CardList,
  profile: CardList
};
const dialogRef = ref(null);
const email = ref('codewy@qq.com');
const code = ref('');
const showCode = computed(() => email.value.includes('@'));

// 打开弹窗 模态方式打开
const showModal = () => {
  dialogRef.value.showModal(); // 模态方式打开
};

// 打开弹窗 非模态方式打开
const show = () => {
  dialogRef.value.show(); // 非模态方式
};

// 关闭弹窗
const closeModal = () => {
  dialogRef.value.close();
};

// 确认操作
const confirm = () => {
  console.log('确认操作');
  closeModal();
};

// 监听关闭事件
const handleClose = event => {
  console.log('Dialog 关闭了', event);
};

// 监听取消事件（按 ESC 键）
const handleCancel = event => {
  console.log('Dialog 被取消了', event);
};

function toHome() {
  router.push('/');
}

function openUserAgreements() {
  const resolved = router.resolve({
    path: '/',
    query: { path: '/user-agreement' }
  });
  window.open(window.location.origin + resolved.href, '_blank');
}

async function sendCode() {
  if (!email.value.includes('@')) {
    console.log('邮箱格式不对');
    return;
  }
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    console.log('请输入有效的邮箱地址');
    return;
  }
  const a = await authStore.sendEmailCode(email.value);
  console.log('页面上', a);
}

async function handleLogin() {
  await authStore.loginByEmailAndCode({
    email: email.value,
    code: code.value
  });
  // 登录成功 关闭弹窗
  closeModal();
}

function handleClickPublish(key) {
  activeTabbar.value = key;
  console.log('点击了发布按钮', key);
}
function handleClickHome(key) {
  activeTabbar.value = key;
  console.log('点击了首页按钮', key);
}

function handleClickMessages(key) {
  activeTabbar.value = key;
  console.log('点击了消息按钮', key);
}

function handleClickProfile(key) {
  activeTabbar.value = key;
  console.log('点击了我的按钮', key);
}

function openLogin() {
  showModal();
}
</script>

<template>
  <div class="home">
    <div class="header-container">
      <div class="left">
        <div class="logo" @click="toHome">
          <img :src="logo" alt="代码空间" />
        </div>
      </div>
      <div class="search">
        <div class="iconfont icon-a-huaban1fuben19 search-icon" />
      </div>
      <div class="right"></div>
    </div>
    <div class="main-container">
      <!-- 侧边栏 -->
      <div class="sidebar-container">
        <div class="sidebar">
          <div class="sidebar-item" :class="{ active: activeTabbar === 'home' }" @click="handleClickHome('home')">
            <div class="iconfont icon-shouye sidebar-icon" />
            <div class="sidebar-title">首页</div>
          </div>
          <div
            class="sidebar-item"
            :class="{ active: activeTabbar === 'publish' }"
            @click="handleClickPublish('publish')"
          >
            <div class="iconfont icon-fabu sidebar-icon" />
            <div class="sidebar-title">发布</div>
          </div>
          <div
            class="sidebar-item"
            :class="{ active: activeTabbar === 'messages' }"
            @click="handleClickMessages('messages')"
          >
            <div class="iconfont icon-tongzhi sidebar-icon" />
            <div class="sidebar-title">消息</div>
          </div>
          <div
            v-if="logined"
            class="sidebar-item"
            :class="{ active: activeTabbar === 'profile' }"
            @click="handleClickProfile('profile')"
          >
            <div class="iconfont icon-taiyang sidebar-icon" />
            <div class="sidebar-title">我的</div>
          </div>
          <div v-if="!logined" class="sidebar-item login-btn" @click="openLogin">登录</div>
        </div>
      </div>
      <div class="card-container hide-scrollbar">
        <component :is="componentMapTabbar[activeTabbar]" type="create" />
      </div>
      <!-- <div class="theme">
        <img :src="theme" />
      </div> -->
    </div>
    <div class="tabbar"></div>

    <!-- 登录弹窗 -->
    <dialog ref="dialogRef" class="native-dialog" @click.stop="closeModal">
      <div class="dialog-context" @click.stop>
        <div class="login-title">邮箱号登录</div>
        <div class="login-input">
          <!-- 原生input虽然不支持 v-model 但有value属性和input事件  -->
          <input :value="email" @input="e => (email = e.target.value)" type="text" placeholder="输入邮箱号" />
        </div>
        <div v-show="showCode" class="login-input">
          <input :value="code" @input="e => (code = e.target.value)" type="text" placeholder="输入验证码" />
          <div class="code-button" @click="sendCode">发送验证码</div>
        </div>
        <div v-show="showCode && code.length" class="login-button" @click="handleLogin">登录</div>

        <div class="user-agreements">
          <input id="agree" type="checkbox" />
          <span label="agree">我已阅读并同意</span>
          <span class="agreements" @click="openUserAgreements"> 《用户协议》 </span>
        </div>

        <div class="user-tips">新用户可直接登录</div>
      </div>
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
$width-1200: 1200px;
$width-1920: 1920px;
$width-1728: 1728px; // 由于我的电脑是 1728 所以设计稿采用1728

$bgc: #0a0a0afa;

.home {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // background-color: #f4f2ec;
  background: $bgc;
}

.header-container {
  position: fixed;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  height: 72px;
  background-color: #0a0a0afa;
  padding: 0 32px;
  > div {
    flex: 1;
  }
}
.header-container .left .logo {
  width: 120px;
  height: 50px;
  cursor: pointer;
  text-align: center;
  user-select: none;
  scale: 0.7;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.header-container .search {
  flex: 1;
  height: 40px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: calc(40px / 2);
  line-height: 40px;
}

.search-icon {
  font-size: 30px;
  color: #fff;
  margin-right: 8px;
  text-align: right;
}

.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  background-color: $bgc;
}

.sidebar-container {
  /* 侧边栏宽度 */
  // width: var(--interaction-width)px;
  width: calc(var(--columnWidth) + var(--horizontalGapPx));
  height: 100%;
  padding: 72px 0 0 0; // 上面margin72px 是因为 搜索框高度是72px
}
.card-container {
  // 因为是 怪异盒模型 所以padding算在width里面所以加上左右的padding
  width: calc(var(--feeds-width) + var(--horizontalGapPx) + var(--horizontalGapPx));
  height: 100%;
  padding: 72px var(--horizontalGapPx) 0px;
}
.theme {
  position: absolute;
  left: calc(100vw - 444px);
  left: 0;
  left: -180px;
  top: 340px;
  width: 656px; // 656px;
  height: calc(100vh - 72px - 20px);
  transform: scaleX(-1) scale(0.4);
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 版心 */
// .container {
//   max-width: $width-1200;
//   width: 100%;
//   margin: 32px auto;
//   padding: 0 15px;
// }
// .home header {
//   width: 100vw;
//   height: 500px;
//   background-image: url("~@/assets/home-bg.webp");
//   background-size: cover;
//   background-position: center;
//   background-repeat: no-repeat;
// }

.tabbar {
  width: 100vw;
  height: 72px;
}

.sidebar {
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #fff;
  padding: 0 16px;

  .sidebar-item {
    display: flex;
    width: 100%;
    height: 48px;
    border-radius: 24px;
    text-align: left;
    line-height: 48px;
    margin: 8px 0px;
    padding: 0 0 0 16px;
    cursor: pointer;
    user-select: none;
  }
  .sidebar-icon {
    font-size: 16px;
  }
  .sidebar-title {
    margin-left: 16px;
  }
}
.sidebar .sidebar-item.active {
  // background-color: $bgc;
  background: rgba(255, 255, 255, 0.04);
}

.sidebar .sidebar-item.login-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff2e4d;
  margin: 0;
  padding: 0;
  font-size: 16px;
  color: #fff;
}

/* 原生弹窗 */
.native-dialog {
  /* 全屏设置 */
  position: fixed;
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  margin: 0;
  border: none;
  padding: 0;
  background: transparent;

  /* 隐藏对话框的默认背景 */
  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
}

.dialog-context {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dialog-context {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 520px; // 因为 antd的弹窗是520px 所以这里是520px才可以撑满
  // height: 480px;
  background-color: #181818;
}

.dialog-context .login-title {
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: #fff;
  padding: 48px 0;
}

.login-input {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 304px;
  height: 48px;
  border-radius: 24px;
  background-color: #212121;
  overflow: hidden;
  font-size: 16px;
  color: #fff;
  margin: 8px;
  > input {
    flex: 1;
    height: 100%;
    padding: 0 18px;
  }
}

.login-button {
  width: 304px;
  height: 48px;
  border-radius: 24px;
  background-color: #ff2e4d;
  margin: 32px 0 0;
  text-align: center;
  line-height: 48px;
  color: #fff;
  cursor: pointer;
  user-select: none;
}
.user-agreements {
  display: flex;
  margin: 16px 0;
  font-size: 12px;
  color: #c7daef;
  > input {
    margin-right: 8px;
  }
}
.agreements {
  cursor: pointer;
}
.user-tips {
  width: 304px;
  height: 28px;
  font-size: 14px;
  color: #ffffff99;
  text-align: center;
  line-height: 28px;
  margin: 32px 0;
}
.code-button {
  width: 80px;
  font-size: 16px;
  color: #ff2e4d;
  height: 48px;
  line-height: 48px;
  cursor: pointer;
  margin-right: 16px;
  user-select: none;
}
</style>
