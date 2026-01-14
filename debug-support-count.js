#!/usr/bin/env node

const JiraService = require('./jira-service');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function debugSupportCount() {
  console.log('🔍 === DEBUG: Contagem de Waiting for Support ===\n');
  
  try {
    const configPath = path.join(os.homedir(), 'Library', 'Application Support', 'jira-monitor', 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    const jiraService = new JiraService(config);
    
    // Query EXATA usada no código
    const supportJql = `assignee = currentUser() AND resolution = Unresolved AND status in ("Waiting for Support", "Aguardando Suporte") AND project = IT`;
    
    console.log('📋 Query JQL usada:');
    console.log(`   ${supportJql}\n`);
    
    const result = await jiraService._searchJql(supportJql, ['status', 'key', 'summary', 'updated', 'project']);
    const tickets = result.issues || [];
    
    console.log(`📊 Total de tickets retornados: ${tickets.length}\n`);
    
    if (tickets.length === 0) {
      console.log('⚠️ Nenhum ticket encontrado');
      return;
    }
    
    console.log('🎫 Lista de tickets:');
    tickets.forEach((ticket, index) => {
      console.log(`${index + 1}. ${ticket.key}`);
      console.log(`   Status: "${ticket.fields.status?.name}"`);
      console.log(`   Projeto: ${ticket.fields.project?.key}`);
      console.log(`   Summary: ${ticket.fields.summary}`);
      console.log(`   Updated: ${new Date(ticket.fields.updated).toLocaleString('pt-BR')}`);
      console.log('');
    });
    
    // Verificar se todos têm o status correto
    const wrongStatus = tickets.filter(t => {
      const status = t.fields.status?.name || '';
      return !['Waiting for Support', 'Aguardando Suporte'].includes(status);
    });
    
    if (wrongStatus.length > 0) {
      console.log('❌ TICKETS COM STATUS INCORRETO:');
      wrongStatus.forEach(t => {
        console.log(`   - ${t.key}: "${t.fields.status?.name}"`);
      });
    } else {
      console.log('✅ Todos os tickets têm status correto');
    }
    
    // Verificar fetchStats() completo
    console.log('\n🧪 === Testando fetchStats() ===\n');
    const stats = await jiraService.fetchStats();
    
    console.log('📊 Resultado de fetchStats():');
    console.log(`   waitingForSupport: ${stats.waitingForSupport}`);
    console.log(`   supportTickets.length: ${stats.supportTickets?.length || 0}\n`);
    
    if (stats.supportTickets && stats.supportTickets.length > 0) {
      console.log('🎫 Tickets retornados em supportTickets:');
      stats.supportTickets.forEach((ticket, index) => {
        console.log(`${index + 1}. ${ticket.key}: ${ticket.status}`);
      });
    }
    
    // Verificar se há duplicatas
    const keys = tickets.map(t => t.key);
    const uniqueKeys = new Set(keys);
    
    if (keys.length !== uniqueKeys.size) {
      console.log('\n❌ DUPLICATAS ENCONTRADAS!');
      const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
      duplicates.forEach(key => {
        console.log(`   - ${key} aparece mais de uma vez`);
      });
    } else {
      console.log('\n✅ Nenhuma duplicata encontrada');
    }
    
    // Verificar "Waiting for approval"
    console.log('\n🔍 === Verificando "Waiting for approval" ===\n');
    const approvalJql = `assignee = currentUser() AND resolution = Unresolved AND status = "Waiting for approval" AND project = IT`;
    const approvalResult = await jiraService._searchJql(approvalJql, ['status', 'key', 'summary']);
    const approvalTickets = approvalResult.issues || [];
    
    console.log(`📊 Tickets "Waiting for approval": ${approvalTickets.length}`);
    if (approvalTickets.length > 0) {
      approvalTickets.forEach(t => {
        console.log(`   - ${t.key}: ${t.fields.summary}`);
      });
    }
    
    console.log('\n💡 === ANÁLISE ===\n');
    console.log(`Query retorna: ${tickets.length} tickets`);
    console.log(`fetchStats() retorna: ${stats.waitingForSupport}`);
    console.log(`Você diz que tem: 4 tickets`);
    
    if (tickets.length !== stats.waitingForSupport) {
      console.log('\n❌ INCONSISTÊNCIA: Query retorna diferente de fetchStats()');
    }
    
    if (tickets.length > 4) {
      console.log(`\n❌ PROBLEMA: Query retorna ${tickets.length} mas deveria ser 4`);
      console.log('   Um dos tickets acima NÃO deveria estar aqui.');
      console.log('   Verifique qual ticket está incorreto.');
    } else if (tickets.length === 4) {
      console.log('\n✅ Query está correta (4 tickets)');
      console.log('   O problema pode estar no frontend');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error(error.stack);
  }
}

debugSupportCount();
