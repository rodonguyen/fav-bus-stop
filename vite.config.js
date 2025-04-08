import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://jp.translink.com.au',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
