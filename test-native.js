// Tentar requerir do processo nativo
let electron;

try {
  // Método 1: require padrão
  electron = require('electron');
  console.log('Método 1 (require):', typeof electron);
} catch (e) {
  console.log('Método 1 falhou:', e.message);
}

try {
  // Método 2: process.binding (interno)
  if (process.binding) {
    const binding = process.binding('electron');
    console.log('Método 2 (binding):', typeof binding);
  }
} catch (e) {
  console.log('Método 2 falhou:', e.message);
}

try {
  // Método 3: remote require (antigo)
  if (typeof __dirname !== 'undefined') {
    delete require.cache[require.resolve('electron')];
    electron = require('electron');
    console.log('Método 3 (cache clear):', typeof electron);
  }
} catch (e) {
  console.log('Método 3 falhou:', e.message);
}

// Verificar variáveis globais do Electron
console.log('=================================');
console.log('Variáveis globais disponíveis:');
console.log('global.electron:', typeof global.electron);
console.log('global.__electron_require:', typeof global.__electron_require);
console.log('=================================');






