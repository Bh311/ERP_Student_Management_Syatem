import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // CRITICAL FIX: Add the server block for proxy configuration
  server: {
    // Keep port default or set explicitly
    port: 5173, 
    
    proxy: {
      // Intercept all requests starting with /api and route them to the backend
      '/api': {
        target: 'http://localhost:3000', // The address of your Express/Node.js server
        changeOrigin: true,             // Ensures the backend sees the request as coming from its own domain
        secure: false,                  // Set to false for local HTTP development
      },
    },
  },
})