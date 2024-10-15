import { defineConfig } from 'vite'
import pkg from './package.json'; // 导入 package.json

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: pkg.main,
      name: pkg.name
    }
  }
})
