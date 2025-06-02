import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, '../'),
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  build: {
    outDir: 'dist/admin',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, '../src/admin.tsx')
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
