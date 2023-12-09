<template>
  <div class="m-4">
    <MultiSelect
      v-model="selectValues1"
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="Select"
      style="width: 240px; --height: 32px"
      :input-ele-width="10"
      :persistent="false"
      filterable
      clearable
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </MultiSelect>
  </div>
</template>
<script lang="ts" setup>
import { ElOption } from '@element-plus/components'
import 'element-plus/theme-chalk/index.css'
import { ref } from 'vue'
const selectValues1 = ref([])
const options = []
for (let i = 0, j = 0; i < 1000; i++) {
  options.push({
    value: `Option${i}`,
    label: `Option${i}`,
  })
  if (j < 2) {
    selectValues1.value.push(`Option${j}`)
    j++
  }
}
</script>

<style>
/* .el-select {
  height: 32px;
  overflow: hidden;
} */

/* .el-select__tags {
  top: 0% !important;
  transform: translateY(-0%) !important;
} */
/* .hidden-content {
  .el-select__tags {
    visibility: hidden;
  }
} */

.el-input__inner {
  height: 30px !important;
}
</style>
