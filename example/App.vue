<template>
  <div class="m-4">
    <MultiSelect
      v-model="selectValues"
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="Select"
      :persistent="false"
      filterable
      clearable
      @change="
        (v) => {
          console.log(1111111, v);
        }
      "
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
import { ElOption, ElSelect } from "element-plus";
import "element-plus/theme-chalk/index.css";
import { ref } from "vue";
const selectValues = ref([]);
const options = [];
for (let i = 0, j = 0; i < 200; i++) {
  options.push({
    value: `Option${ + " " + i}`,
    label: `Option${ + " " + i}`,
  });
  if (j < 6) {
    selectValues.value.push(`Option${ + " " + j}`);
    j++;
  }
}
</script>

