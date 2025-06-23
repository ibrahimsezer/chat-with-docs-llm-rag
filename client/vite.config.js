import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, 
    proxy: {
      '/upload': 'http://localhost:8000',
      '/ask-doc': 'http://localhost:8000',
      '/ask-test': 'http://localhost:8000',
      '/ask': 'http://localhost:8000'
    }
  }
})
