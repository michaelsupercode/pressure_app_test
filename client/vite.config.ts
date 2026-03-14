import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  ...(command === 'serve' && {
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "https://pressure-backend.onrender.com",
          changeOrigin: true
        }
      }
    }
  })
}))
