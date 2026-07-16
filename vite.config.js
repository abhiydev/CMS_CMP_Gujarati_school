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

          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor';
          }

          if (id.includes('node_modules/swiper')) {
            return 'swiper-vendor';
          }

          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) {
            return 'router-vendor';
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'motion-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
});
