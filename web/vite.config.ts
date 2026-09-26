import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // the offline dictionary (~3,000 words) and all lessons ship in the main bundle so translation works instantly
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
