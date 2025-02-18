import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts:["ff3b-2409-40c1-5004-8229-2437-8ebd-afa7-2098.ngrok-free.app"]
  }
})
