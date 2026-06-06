import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('node_modules/react-router-dom')) {
            return 'vendor-router';
          }

          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react')) {
            return 'vendor-react';
          }

          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }

          return 'vendor';
        },
      },
    },
  },
});
