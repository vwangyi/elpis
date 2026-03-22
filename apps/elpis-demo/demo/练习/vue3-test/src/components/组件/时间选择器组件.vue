<script setup>
import { ref, computed, watchEffect, nextTick } from 'vue'
import moment from 'moment'

const props = defineProps({
  value: Number,
})
const emits = defineEmits(['select', 'ok'])

const popupVisible = ref(false)

// 用于记录已经确认的值
let record = props.value

// 计算属性
const hh = computed(() => moment(props.value).format('HH'))
const mm = computed(() => moment(props.value).format('mm'))
const ss = computed(() => moment(props.value).format('ss'))

watchEffect(async () => {
  if (!popupVisible.value) {
    return
  }
  await nextTick()
  document.querySelector(`#h${hh.value}`).scrollIntoView(true)
})

watchEffect(async () => {
  if (!popupVisible.value) {
    return
  }
  await nextTick()
  document.querySelector(`#m${mm.value}`).scrollIntoView(true)
})

watchEffect(async () => {
  if (!popupVisible.value) {
    return
  }
  await nextTick()
  document.querySelector(`#s${ss.value}`).scrollIntoView(true)
})

function withZero(num) {
  return num < 10 ? `0${num}` : num
}

function onSelect(h, m, s) {
  const currentDay = moment().format('YYYY-MM-DD')
  const currentTime = `${currentDay} ${h}:${m}:${s}`
  emits('select', moment(currentTime).valueOf())
}

function open(e) {
  popupVisible.value = true
  console.dir(e.target)
  e.target.focus()
}

function close() {
  popupVisible.value = false
  const currentDay = moment().format('YYYY-MM-DD')
  const currentTime = `${currentDay} ${hh.value}:${mm.value}:${ss.value}`
  const currentValue = moment(currentTime).valueOf()
  emits('ok', currentValue)
  record = currentValue
}

function onCurrent() {
  const currentValue = Date.now()
  emits('select', currentValue)
  record = currentValue
  popupVisible.value = false
}

function onBlur() {
  console.log('失去焦点')
  popupVisible.value = false
  emits('select', record)
}
</script>

<template>
  <div class="time-picker-shower" @click.stop="open" tabindex="0" @blur="onBlur">
    <span v-if="!props.value">请选择时间</span>
    <span v-else>{{ moment(props.value).format('HH:mm:ss') }}</span>
    <div v-if="popupVisible" class="popup">
      <div class="selector-wrapper">
        <div class="selector">
          <div
            v-for="h in 24"
            :key="h"
            :class="{
              option: true,
              active: hh == withZero(h - 1),
            }"
            :id="`h${withZero(h - 1)}`"
            @click="onSelect(withZero(h - 1), mm, ss)"
          >
            {{ withZero(h - 1) }}
          </div>
        </div>
        <div class="selector">
          <div
            v-for="m in 60"
            :key="m"
            :class="{
              option: true,
              active: mm == withZero(m - 1),
            }"
            :id="`m${withZero(m - 1)}`"
            @click="onSelect(hh, withZero(m - 1), ss)"
          >
            {{ withZero(m - 1) }}
          </div>
        </div>
        <div class="selector">
          <div
            v-for="s in 60"
            :key="s"
            :class="{
              option: true,
              active: ss == withZero(s - 1),
            }"
            :id="`s${withZero(s - 1)}`"
            @click="onSelect(hh, mm, withZero(s - 1))"
          >
            {{ withZero(s - 1) }}
          </div>
        </div>
      </div>
      <footer>
        <button @mousedown.prevent @click.stop="onCurrent">此刻</button>
        <button @mousedown.prevent @click.stop="close">确定</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.time-picker-shower {
  width: 200px;
  padding: 8px 16px;
  color: #aaa;
  border: 1px solid #aaa;
  position: relative;
}

.time-picker-shower:focus {
  outline: 1px solid blue;
}

.time-picker-shower .popup {
  border: 1px solid #aaa;
  position: absolute;
  width: 120px;
  top: 40px;
  left: 0;
  outline: none;
}

.time-picker-shower .selector-wrapper {
  height: 140px;
  display: flex;
}

.time-picker-shower .selector-wrapper .selector {
  flex: 1;
  border-right: 1px solid #aaa;
  overflow-y: auto;
}

.time-picker-shower .selector-wrapper .selector .option {
  height: 20px;
  text-align: center;
  font-size: 14px;
  color: #000;
  line-height: 20px;
}

.time-picker-shower .selector-wrapper .selector .option:hover {
  background: #e9e9ff;
  cursor: pointer;
}

.time-picker-shower .selector-wrapper .selector .option.active {
  background: #e9e9ff;
}

.time-picker-shower .selector-wrapper .selector:last-child {
  border: none;
}

.time-picker-shower footer {
  height: 30px;
  border-top: 1px solid #aaa;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.time-picker-shower footer button {
  height: 20px;
  line-height: 14px;
}

/* 滚动条 */
.time-picker-shower .selector-wrapper .selector::-webkit-scrollbar {
  width: 2px;
  background-color: transparent;
}

.time-picker-shower .selector-wrapper .selector:hover::-webkit-scrollbar-thumb {
  visibility: visible;
}

/* 滚动条滑块 */
.time-picker-shower .selector-wrapper .selector::-webkit-scrollbar-thumb {
  background-color: #aaa;
  visibility: hidden;
}
</style>
