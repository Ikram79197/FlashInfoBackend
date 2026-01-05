import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: "build",
    // Increase warning limit to reduce noisy warnings (kB)
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Split vendor packages into separate chunks by package name.
        // This helps avoid one very large bundle and enables better caching.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            // handle scoped packages like @scope/pkg
            if (parts[0].startsWith('@') && parts.length > 1) {
              return `${parts[0]}/${parts[1]}`;
            }
            return parts[0];
          }
        }
      }
    }
  }
});
