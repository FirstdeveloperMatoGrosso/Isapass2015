const fs = require('fs');
const { createCanvas } = require('canvas');

// Criar um canvas de 32x32 pixels (tamanho padrão de favicon)
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Limpar o canvas
ctx.clearRect(0, 0, 32, 32);

// Desenhar o ícone de ticket estilizado (baseado na logo)
ctx.fillStyle = '#00a8e8'; // Cor azul similar à da logo

// Forma do ticket
ctx.beginPath();
// Desenhar um ticket estilizado
ctx.moveTo(8, 8);
ctx.lineTo(24, 8);
ctx.arc(24, 11, 3, 1.5 * Math.PI, 0.5 * Math.PI, false);
ctx.lineTo(8, 24);
ctx.arc(8, 21, 3, 0.5 * Math.PI, 1.5 * Math.PI, false);
ctx.closePath();
ctx.fill();

// Adicionar detalhes internos (linha perfurada)
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(12, 12);
ctx.lineTo(20, 20);
ctx.stroke();

// Salvar o favicon diretamente na pasta public
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/favicon.ico', buffer);

console.log('Favicon criado com sucesso na pasta public!');
