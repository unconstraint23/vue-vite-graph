import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import glsl from 'vite-plugin-glsl';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    glsl()
  ],
  optimizeDeps: {
    include: ['vue-router']
},
  resolve: {
    alias: [
     { find: '@', replacement: path.resolve(__dirname, './src') }
    ]
  },
  server: {
    open: true,
    host: "0.0.0.0",
    port: 1881
  }
})
