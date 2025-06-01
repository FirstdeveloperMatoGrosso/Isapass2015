import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { createProxyMiddleware } from 'http-proxy-middleware';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Configuração do proxy para a API
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('Erro no proxy:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Requisição sendo enviada para o backend:', req.method, req.url);
              // Adiciona headers CORS manualmente
              proxyReq.setHeader('Access-Control-Allow-Origin', '*');
              proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
              proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
      middleware: (req, res, next) => {
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
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
