<template>
  <el-select
    ref="elSelectRef"
    :class="{ 'hidden-content': calculating ? true : false }"
    :max-collapse-tags="maxCollapseTags"
    v-bind="$attrs"
    filterable
  >
    <slot />
  </el-select>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { debounce } from 'lodash-es'
import { ElSelect } from 'element-plus'
import 'element-plus/theme-chalk/src/select.scss'
defineOptions({
  name: 'MultiSelect',
})
const props = defineProps({
  inputEleWidth: {
    type: Number,
    default: 100,
  },
})
const elSelectRef = ref()
const maxCollapseTags = ref(10)
const calculating = ref(true)
let observer: MutationObserver | undefined
let tagsWrapObserver: MutationObserver | undefined
onMounted(() => {
  observeFn()
})
function observeFn() {
  let el = elSelectRef.value.$el
  el = el?.querySelector('.select-trigger>.el-select__tags')
  if (!el) {
    requestAnimationFrame(observeFn)
  } else {
    calculating.value = false
    observer = useObserver(el)
  }
}
function useObserver(el: Element) {
  const config = { childList: true }
  function callback() {
    const wrapperEle = el?.querySelector('.el-select-tags-wrapper')
    if (!wrapperEle) {
      tagsWrapObserver?.disconnect()
      tagsWrapObserver = undefined
    } else {
      tagsWrapObserver = useTagsChangesObserver(wrapperEle, true)
      return tagsWrapObserver
    }
  }
  const observer = new MutationObserver(debounce(callback, 100))
  observer.observe(el, config)
  return observer
}
function useTagsChangesObserver(wrapperEle: Element, immediate = false) {
  const config = { childList: true, subtree: true }
  let previousLen: number
  function callback() {
    if (calculating.value) return
    calculating.value = true
    const children = [...(wrapperEle?.children || [])] as HTMLElement[]
    const currentLen = children.length
    if (!currentLen) {
      calculating.value = false
      return
    }
    const preChildren: HTMLElement = children[0]
    const lastChildren: HTMLElement = children[children.length - 1]
    if (
      currentLen > previousLen &&
      lastChildren.offsetTop > preChildren.offsetTop
    ) {
      for (let i = children.length - 1; i > 0; i--) {
        const currentChild: HTMLElement = children[i]
        if (currentChild.offsetTop == preChildren.offsetTop) {
          nextTick(() => {
            maxCollapseTags.value = i
          })
          break
        }
      }
    } else if (!previousLen || previousLen <= currentLen) {
      const inputElement = wrapperEle.querySelector('.el-select__input')
      const inputElementWidth = inputElement?.clientWidth || 0
      nextTick(() => {
        if (!inputElement || inputElementWidth > props.inputEleWidth)
          maxCollapseTags.value = maxCollapseTags.value + 10
        else maxCollapseTags.value = children.length - 1
      })
    }
    setTimeout(() => {
      previousLen = currentLen
      calculating.value = false
    }, 0)
  }
  if (immediate) {
    callback()
  }
  const observer = new MutationObserver(debounce(callback, 100))
  observer.observe(wrapperEle, config)
  return observer
}

onBeforeUnmount(() => {
  observer?.disconnect()
  tagsWrapObserver?.disconnect()
})
</script>
<style>
.el-select {
  contain: paint;
  height: var(--height);
}
.hidden-content .el-select__tags {
  visibility: hidden;
}

.el-input__inner {
  height: calc(var(--height) - 2) !important;
}
</style>
