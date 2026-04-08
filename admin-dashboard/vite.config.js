import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ensures assets are relative for production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})