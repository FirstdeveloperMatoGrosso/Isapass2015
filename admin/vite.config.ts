import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, '../src'),
  publicDir: path.resolve(__dirname, '../public'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, '../src/admin.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  },
  server: {
    host: "::",
    port: 8081, // Porta diferente do frontend principal
    proxy: {
      '/api': {
        target: 'https://api.isapass.shop',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  plugins: [
    react(),
    componentTagger(),
    nodePolyfills({
      globals: {
        Buffer: true,
      }
    })
  ]
});
