import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import DefineOptions from 'unplugin-vue-define-options/vite'

export default defineConfig({
  plugins: [vue(), DefineOptions()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'),
      // umd 形式的命名空间
      name: 'MultiSelect',
      fileName: (format) => {
        return `multi-select.${format}.js`
      },
      formats: ['cjs', 'es', 'umd'],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'element-plus'],
      output: {
        // 在 umd 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
