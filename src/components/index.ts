import MultiSelect from './multi-select.vue'

const install = (Vue: { component: (arg0: any, arg1: any) => void }) => {
  Vue.component(MultiSelect.name, MultiSelect)
}

export default {
  install,
}
