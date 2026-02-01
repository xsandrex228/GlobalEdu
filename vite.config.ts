import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'  // правильный импорт path
import tailwindcss from '@tailwindcss/vite'  // правильное имя

export default defineConfig({
  plugins: [
    // React и Tailwind — оба нужны, не удаляй
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      // Алиас @ → src папка (очень полезно для импортов типа @/components)
      '@': resolve(__dirname, './src'),
    },
  },

  server: {
    host: '127.0.0.1',      // строго IPv4 localhost — это решает REFUSED
    port: 5173,
    strictPort: true,       // если порт занят — сразу ошибка
    hmr: {
      host: '127.0.0.1'     // фиксит hot reload
    }
  }
})