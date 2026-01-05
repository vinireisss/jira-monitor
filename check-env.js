console.log('=================================');
console.log('process.versions:', process.versions);
console.log('=================================');
console.log('process.type:', process.type);
console.log('process.versions.electron:', process.versions.electron);
console.log('process.versions.chrome:', process.versions.chrome);
console.log('=================================');

if (process.versions.electron) {
  console.log('✅ Estamos DENTRO do Electron!');
  console.log('✅ Electron version:', process.versions.electron);
} else {
  console.log('❌ NÃO estamos dentro do Electron');
  console.log('❌ Estamos rodando como Node.js normal');
}






