# IsaPass 2015-2025

## Sobre o Projeto

O IsaPass é um sistema de gerenciamento de ingressos e eventos, com suporte para pagamentos PIX via Pagar.me.

## Características Principais

- Integração com pagamentos PIX usando Pagar.me API
- Servidor backend Deno para processamento seguro de pagamentos
- Interface moderna em React com TypeScript
- Integração com Supabase para autenticação e armazenamento

## Tecnologias Utilizadas

- Vite
- TypeScript
- React
- Tailwind CSS
- Deno (backend)
- Pagar.me API (processamento de pagamentos)

## Como Executar o Projeto

```sh
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento Vite
npm run dev

# Iniciar o servidor Deno para processamento de pagamentos PIX
cd supabase/functions/generate-pix
export PAGARME_API_KEY=sua_chave_api
deno run --allow-net --allow-env minimal_server.ts
```

## Integração PIX

O projeto inclui uma integração completa com a API do Pagar.me para processamento de pagamentos PIX.
