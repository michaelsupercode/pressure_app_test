import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const devApiProxyTarget = process.env.VITE_DEV_API_PROXY_TARGET || "http://localhost:4000";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  ...(command === 'serve' && {
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: devApiProxyTarget,
          changeOrigin: true
        }
      }
    }
  })
}))
