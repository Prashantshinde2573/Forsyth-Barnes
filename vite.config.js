import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'home-2': resolve(__dirname, 'home-2/index.html'),
      },
    },
  },
})
