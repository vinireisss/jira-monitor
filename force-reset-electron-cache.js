#!/usr/bin/env node

/**
 * 🔥 FORCE RESET ELECTRON CACHE
 * Remove completamente o cache corrompido do Electron Store
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Caminho do cache do Electron
const appName = 'jira-monitor';
const electronConfigPath = path.join(
  os.homedir(),
  'Library',
  'Application Support',
  appName,
  'config.json'
);

console.log('🔥 FORCE RESET - LIMPEZA COMPLETA DO ELECTRON STORE\n');
console.log('📍 Caminho do cache:', electronConfigPath);

// 1. Verificar se o arquivo existe
if (fs.existsSync(electronConfigPath)) {
  console.log('⚠️  Arquivo de cache ENCONTRADO!');
  
  // Mostrar conteúdo corrompido
  try {
    const corrupted = JSON.parse(fs.readFileSync(electronConfigPath, 'utf8'));
    console.log('\n📦 Conteúdo CORROMPIDO atual:');
    console.log('   evaluatedTicketsSatisfactionField:', corrupted.evaluatedTicketsSatisfactionField);
    console.log('   Tipo:', typeof corrupted.evaluatedTicketsSatisfactionField);
    console.log('   baseUrl:', corrupted.jiraBaseUrl);
  } catch (err) {
    console.log('   ❌ Arquivo corrompido não pode ser lido');
  }
  
  // Deletar o arquivo
  console.log('\n🗑️  Deletando cache corrompido...');
  fs.unlinkSync(electronConfigPath);
  console.log('✅ Cache deletado com sucesso!\n');
} else {
  console.log('✅ Nenhum cache encontrado (perfeito!)\n');
}

// 2. Verificar o config.json do projeto
const projectConfigPath = path.join(__dirname, 'config.json');
console.log('📋 Verificando config.json do projeto...');
console.log('📍 Caminho:', projectConfigPath);

if (fs.existsSync(projectConfigPath)) {
  const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
  console.log('\n✅ Config do projeto está correto:');
  console.log('   evaluatedTicketsSatisfactionField:', projectConfig.evaluatedTicketsSatisfactionField);
  console.log('   Tipo:', typeof projectConfig.evaluatedTicketsSatisfactionField);
  console.log('   É array?', Array.isArray(projectConfig.evaluatedTicketsSatisfactionField));
  console.log('   Primeiro elemento:', projectConfig.evaluatedTicketsSatisfactionField?.[0]);
  console.log('   baseUrl:', projectConfig.jiraBaseUrl);
} else {
  console.log('❌ config.json não encontrado!\n');
  process.exit(1);
}

console.log('\n════════════════════════════════════════════════════════');
console.log('✅ LIMPEZA CONCLUÍDA!');
console.log('════════════════════════════════════════════════════════\n');
console.log('🚀 PRÓXIMO PASSO:');
console.log('   1. Execute: npm start');
console.log('   2. Verifique se aparece: "🔍 Campo de avaliação: customfield_10120"');
console.log('   3. Se ainda mostrar "c", o problema está no código do jira-service.js\n');
