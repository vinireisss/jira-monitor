const electron = require('electron');

console.log('================================');
console.log('TIPO:', typeof electron);
console.log('É String?:', typeof electron === 'string');
console.log('VALOR:', electron);
console.log('================================');

if (typeof electron === 'string') {
  console.log('❌ PROBLEMA: electron é uma string (caminho do binário)');
  console.log('❌ Isso significa que a instalação está corrompida');
} else {
  console.log('✅ electron é um objeto');
  console.log('✅ Keys:', Object.keys(electron).slice(0, 20));
}






