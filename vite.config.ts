import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      util: 'util',
      buffer: 'buffer',
      process: 'process/browser',
    }
  },
  optimizeDeps: {
    include: [
      'crypto-browserify', 
      'stream-browserify', 
      'util',
      'buffer',
      'process/browser'
    ]
  }
})