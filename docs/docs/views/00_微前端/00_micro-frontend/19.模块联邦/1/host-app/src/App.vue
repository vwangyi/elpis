<script setup>
import { markRaw, onBeforeUnmount, ref, shallowRef, watch } from "vue";

const name = ref("运营同学");

const vueCard = shallowRef(null);
const vueLoading = ref(false);
const vueStatus = ref("尚未加载");

async function loadVueCard() {
  vueLoading.value = true;
  vueStatus.value = "正在加载 Vue 子应用组件…";

  try {
    const module = await import("vueRemote/UserCard");
    vueCard.value = markRaw(module.default);
    vueStatus.value = "加载成功：远程 Vue 组件已进入主应用";
  } catch (error) {
    vueStatus.value = `加载失败：${error.message}`;
  } finally {
    vueLoading.value = false;
  }
}

function handleVueConfirm(message) {
  vueStatus.value = message;
}

const reactSlot = ref(null);
const reactStatus = ref("尚未加载");
const reactLoading = ref(false);
const reactMounted = ref(false);
let reactControls = null;

async function loadReactCard() {
  reactLoading.value = true;
  reactStatus.value = "正在加载 React 子应用模块…";

  try {
    const { mountHelloCard } = await import("reactRemote/HelloCard");
    reactControls?.unmount();
    reactControls = mountHelloCard(reactSlot.value, {
      name: name.value,
      onConfirm(message) {
        reactStatus.value = message;
      },
    });
    reactMounted.value = true;
    reactStatus.value = "加载成功：React 已挂载到 Vue 提供的容器";
  } catch (error) {
    reactMounted.value = false;
    reactStatus.value = `加载失败：${error.message}`;
  } finally {
    reactLoading.value = false;
  }
}

watch(name, (nextName) => reactControls?.update({ name: nextName }));
onBeforeUnmount(() => reactControls?.unmount());
</script>

<template>
  <main class="page">
    <p class="eyebrow">Vue Host · localhost:5300</p>
    <h1>运营主应用</h1>
    <p>先加载 Vue 子应用组件，再对比 Vue 怎样加载 React 子应用组件。</p>

    <label>
      当前用户
      <input v-model="name" />
    </label>

    <section class="demo-block">
      <div class="demo-heading">
        <div>
          <h2>Vue 主应用 + Vue 子应用</h2>
        </div>
        <button type="button" :disabled="vueLoading" @click="loadVueCard">
          {{ vueLoading ? "加载中…" : vueCard ? "重新加载 Vue 组件" : "加载 Vue 组件" }}
        </button>
      </div>
      <p class="status">{{ vueStatus }}</p>
      <div class="remote-slot">
        <component
          :is="vueCard"
          v-if="vueCard"
          :name="name"
          @confirm="handleVueConfirm"
        />
      </div>
    </section>

    <section class="demo-block">
      <div class="demo-heading">
        <div>
          <h2>Vue 主应用 + React 子应用</h2>
        </div>
        <button type="button" :disabled="reactLoading" @click="loadReactCard">
          {{ reactLoading ? "加载中…" : reactMounted ? "重新挂载 React 组件" : "加载 React 组件" }}
        </button>
      </div>
      <p class="status">{{ reactStatus }}</p>
      <div ref="reactSlot" class="remote-slot"></div>
    </section>
  </main>
</template>
