import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

// Obter o diretório atual (equivalente a __dirname no CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para os arquivos
const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const icoPath = path.join(__dirname, 'public', 'favicon.ico');

// Ler o arquivo SVG
fs.promises.readFile(svgPath)
  .then(data => {
    // Converter SVG para PNG primeiro (intermediário)
    return sharp(data)
      .resize(32, 32) // Tamanho padrão para favicon
      .png()
      .toBuffer();
  })
  .then(pngBuffer => {
    // Converter PNG para ICO (na verdade será um PNG, mas renomeado para .ico)
    return sharp(pngBuffer)
      .toFile(icoPath);
  })
  .then(() => {
    console.log('Favicon.ico criado com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao processar o favicon:', err);
  });
