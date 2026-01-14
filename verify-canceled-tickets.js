#!/usr/bin/env node

const JiraService = require('./jira-service');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function verifyCanceledTickets() {
  console.log('🔍 === Verificando tickets Canceled ===\n');
  
  try {
    const configPath = path.join(os.homedir(), 'Library', 'Application Support', 'jira-monitor', 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    const jiraService = new JiraService(config);
    
    // Query que deveria EXCLUIR Canceled
    const jql = `assignee = currentUser() AND resolution = Unresolved AND status NOT IN ("Cancelled", "Canceled", "Cancelado", "Closed") AND project = IT ORDER BY updated DESC`;
    console.log('📋 Query testada:');
    console.log(`   ${jql}\n`);
    
    const result = await jiraService._searchJql(jql, ['status', 'key', 'project']);
    const tickets = result.issues || [];
    
    console.log(`✅ Tickets retornados: ${tickets.length}\n`);
    
    // Contar por status
    const statusCount = {};
    tickets.forEach(t => {
      const status = t.fields.status?.name || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    console.log('📊 Contagem por status:');
    Object.entries(statusCount).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    // Verificar se há Canceled
    const canceledTickets = tickets.filter(t => {
      const status = t.fields.status?.name || '';
      return status.toLowerCase().includes('cancel');
    });
    
    if (canceledTickets.length > 0) {
      console.log(`\n❌ PROBLEMA: ${canceledTickets.length} tickets Canceled foram incluídos!`);
      console.log('   Primeiros 5 exemplos:');
      canceledTickets.slice(0, 5).forEach(t => {
        console.log(`   - ${t.key}: ${t.fields.status?.name} (${t.fields.project?.key})`);
      });
    } else {
      console.log('\n✅ Nenhum ticket Canceled incluído (correto)');
    }
    
    console.log('\n🔍 === Testando query corrigida ===\n');
    
    // Query CORRIGIDA usando o nome exato "Canceled"
    const fixedJql = `assignee = currentUser() AND resolution = Unresolved AND status != "Canceled" AND project = IT ORDER BY updated DESC`;
    console.log('📋 Query corrigida:');
    console.log(`   ${fixedJql}\n`);
    
    const fixedResult = await jiraService._searchJql(fixedJql, ['status', 'key', 'project']);
    const fixedTickets = fixedResult.issues || [];
    
    console.log(`✅ Tickets retornados (query corrigida): ${fixedTickets.length}\n`);
    
    // Contar por status
    const fixedStatusCount = {};
    fixedTickets.forEach(t => {
      const status = t.fields.status?.name || 'Unknown';
      fixedStatusCount[status] = (fixedStatusCount[status] || 0) + 1;
    });
    
    console.log('📊 Contagem por status (query corrigida):');
    Object.entries(fixedStatusCount).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    // Verificar se há Canceled
    const fixedCanceledTickets = fixedTickets.filter(t => {
      const status = t.fields.status?.name || '';
      return status.toLowerCase().includes('cancel');
    });
    
    if (fixedCanceledTickets.length > 0) {
      console.log(`\n❌ Ainda há ${fixedCanceledTickets.length} tickets Canceled!`);
    } else {
      console.log('\n✅ Nenhum ticket Canceled incluído! Query corrigida funciona.');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verifyCanceledTickets();
