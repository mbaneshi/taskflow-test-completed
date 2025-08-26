import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import router from "react-router-html"
import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    react(),
    router(),
    checker({ 
      typescript: true
      // ESLint temporarily disabled - will be configured separately
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@types': '/types'
    }
  },
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:5001'),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})