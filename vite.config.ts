import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import httpProxy from 'http-proxy';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import securityHeaders from './vite-security-headers';
import type { Request, Response } from 'express';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api/payments/pix': {
          target: 'http://localhost:8099', // Usando o servidor Deno na porta 8099
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => '/',
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Erro no proxy:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Requisição sendo enviada para o backend:', req.method, req.url);
              proxyReq.setHeader('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieHB4bGVlY2djZmZjbmtmaGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTQ5MzIsImV4cCI6MjA2MzY3MDkzMn0.KvHq62hOngaoBOcc_pHAIoRO1fb6cVXoL3Ne3d0Wghk');
              proxyReq.setHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieHB4bGVlY2djZmZjbmtmaGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTQ5MzIsImV4cCI6MjA2MzY3MDkzMn0.KvHq62hOngaoBOcc_pHAIoRO1fb6cVXoL3Ne3d0Wghk');
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
              res.setHeader('Access-Control-Allow-Credentials', 'true');
            });
          }
        }
      },
      // Configuração de CORS manual
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
      },
      // Configuração de middleware para lidar com CORS
      middleware: (req: Request, res: Response, next: () => void) => {
        // Configuração de CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Responde imediatamente para requisições OPTIONS (pré-voo CORS)
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }
        
        // Continua para o próximo middleware
        next();
      }
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      securityHeaders(),
      nodePolyfills({
        protocolImports: true,
      })
    ].filter(Boolean),

  };
});
