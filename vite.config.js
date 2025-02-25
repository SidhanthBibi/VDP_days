import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss(), splitVendorChunkPlugin()],
  envPrefix: 'VITE_',
  server: {
    host: true,  // Allows access from network
    port: 5173,  // Specify port (change if needed)
    strictPort: true,  // Ensures the exact port is used
  },
  build: {
    sourcemap: true
  }
});