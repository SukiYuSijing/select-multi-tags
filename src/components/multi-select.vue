<template>
  <el-select
    ref="elSelectRef"
    :max-collapse-tags="maxCollapseTags"
    v-bind="$attrs"
    filterable
    @change="onChange"
  >
    <slot />
  </el-select>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import { ElSelect } from "element-plus";
defineOptions({
  name: "MultiSelect",
});
const elSelectRef = ref();
const maxCollapseTags = ref(20);
let observer: ResizeObserver | undefined;
onMounted(() => {
  observeFn();
});
function observeFn() {
  let el = elSelectRef.value.$el;
  if (!el) {
    requestAnimationFrame(observeFn);
  } else {
    observer = useObserver(el);
  }
}

function callback(el:HTMLElement) {
  maxCollapseTags.value = 20;
  nextTick(() => {
    if (!el) {
      observer?.disconnect();
      observer = undefined;
    } else {
      const selectWrapper = el.querySelector(".el-select__wrapper");
      const selectedItemAll = selectWrapper?.querySelectorAll(
        ".el-select__selected-item"
      );
      if(!selectedItemAll?.length) return
      const lastSelectedItem = selectedItemAll[selectedItemAll.length - 1];
      for (let i = selectedItemAll.length - 1; i > 0; i--) {
        const item = selectedItemAll[i];
        if ((lastSelectedItem as HTMLElement).offsetTop !== 0 && (item as HTMLElement).offsetTop === 0) {
          maxCollapseTags.value = i;
          break;
        } else {
          maxCollapseTags.value = maxCollapseTags.value + 10;
        }
      }
    }
  });
}
function useObserver(el: HTMLElement) {
  observer = new ResizeObserver(() => callback(el));
  observer.observe(el);
  return observer;
}
const attrs = useAttrs();
const onChange = (v:string[]) => {
  typeof attrs.onChange ==='function'&& attrs.onChange(v);
  nextTick(() => {
    callback(elSelectRef.value.$el);
  });
};
onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>
