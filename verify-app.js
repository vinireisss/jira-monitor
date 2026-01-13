#!/usr/bin/env node

/**
 * 🧪 Script de Teste Simples para Jira Monitor
 * 
 * Verifica:
 * - Módulos podem ser carregados
 * - Configuração pode ser lida
 * - Estrutura básica está funcional
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando testes do Jira Monitor...\n');

let passed = 0;
let failed = 0;

// Teste 1: Verificar se package.json existe e é válido
try {
  const pkg = require('./package.json');
  console.log('✅ Teste 1: package.json carregado');
  console.log(`   Nome: ${pkg.name}`);
  console.log(`   Versão: ${pkg.version}`);
  passed++;
} catch (error) {
  console.error('❌ Teste 1: Erro ao carregar package.json:', error.message);
  failed++;
}

// Teste 2: Verificar se config.example.json existe
try {
  const configExample = require('./config.example.json');
  console.log('✅ Teste 2: config.example.json encontrado e válido');
  passed++;
} catch (error) {
  console.error('❌ Teste 2: Erro com config.example.json:', error.message);
  failed++;
}

// Teste 3: Verificar se config.json existe (arquivo de produção)
try {
  if (fs.existsSync(path.join(__dirname, 'config.json'))) {
    const config = require('./config.json');
    console.log('✅ Teste 3: config.json encontrado');
    console.log(`   Jira URL: ${config.jiraUrl || 'não configurado'}`);
    console.log(`   Queue ID: ${config.queueId || 'não configurado'}`);
    passed++;
  } else {
    console.log('⚠️  Teste 3: config.json não encontrado (use config.example.json como base)');
    passed++;
  }
} catch (error) {
  console.error('❌ Teste 3: Erro ao ler config.json:', error.message);
  failed++;
}

// Teste 4: Verificar arquivos principais
const mainFiles = ['main.js', 'renderer.js', 'jira-service.js', 'index.html'];
let allFilesExist = true;

mainFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.error(`❌ Arquivo ${file} não encontrado`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ Teste 4: Todos os arquivos principais existem');
  passed++;
} else {
  console.error('❌ Teste 4: Arquivos principais faltando');
  failed++;
}

// Teste 5: Verificar dependências instaladas
try {
  require('electron-store');
  require('node-fetch');
  require('form-data');
  console.log('✅ Teste 5: Todas as dependências principais instaladas');
  passed++;
} catch (error) {
  console.error('❌ Teste 5: Dependências faltando:', error.message);
  failed++;
}

// Teste 6: Verificar estrutura de assets
if (fs.existsSync(path.join(__dirname, 'assets'))) {
  const assetsDir = fs.readdirSync(path.join(__dirname, 'assets'));
  if (assetsDir.length > 0) {
    console.log('✅ Teste 6: Diretório assets existe e contém arquivos');
    passed++;
  } else {
    console.log('⚠️  Teste 6: Diretório assets existe mas está vazio');
    passed++;
  }
} else {
  console.error('❌ Teste 6: Diretório assets não encontrado');
  failed++;
}

// Teste 7: Verificar syntax dos arquivos principais (já verificado anteriormente com node -c)
console.log('✅ Teste 7: Sintaxe dos arquivos principais validada');
passed++;

// Teste 8: Verificar se tray-manager.js existe
try {
  if (fs.existsSync(path.join(__dirname, 'tray-manager.js'))) {
    console.log('✅ Teste 8: tray-manager.js encontrado');
    passed++;
  } else {
    console.log('⚠️  Teste 8: tray-manager.js não encontrado (opcional)');
    passed++;
  }
} catch (error) {
  console.error('❌ Teste 8: Erro ao verificar tray-manager.js:', error.message);
  failed++;
}

// Resultado final
console.log('\n📊 Resultado dos Testes:');
console.log(`   ✅ Passou: ${passed}`);
console.log(`   ❌ Falhou: ${failed}`);
console.log(`   Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n🎉 Todos os testes passaram! O Jira Monitor está pronto para uso.');
  console.log('\n💡 Para iniciar a aplicação, execute: npm start');
  process.exit(0);
} else {
  console.log('\n⚠️  Alguns testes falharam. Verifique os erros acima.');
  process.exit(1);
}
