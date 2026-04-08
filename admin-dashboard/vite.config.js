import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    esbuildOptions: {
      // Allows JSX in .js files during development
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    // Allows JSX in .js files during the build process
    loader: 'jsx',
    include: /src\/.*\.js$/, // Target only your source files
    exclude: [],
  },
})