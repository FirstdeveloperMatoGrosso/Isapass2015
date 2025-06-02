import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import httpProxy from 'http-proxy';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import type { Request, Response } from 'express';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: path.resolve(__dirname, '../src'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src')
      }
    },
    build: {
      outDir: path.resolve(__dirname, '../dist/admin'),
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, '../src/admin.html')
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
  }
});
