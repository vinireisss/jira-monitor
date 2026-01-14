#!/usr/bin/env node

/**
 * Script de Debug: Verificar nomes reais dos status no Jira
 * 
 * Este script busca todos os tickets atribuídos ao usuário e lista
 * todos os status únicos encontrados, para ajudar a identificar
 * os nomes corretos dos status no Jira.
 */

const JiraService = require('./jira-service');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function debugStatusNames() {
  console.log('🔍 === DEBUG: Verificando nomes de status no Jira ===\n');
  
  try {
    // Carregar configuração manualmente (não podemos usar electron-store fora do Electron)
    const configPath = path.join(os.homedir(), 'Library', 'Application Support', 'jira-monitor', 'config.json');
    console.log(`📁 Lendo config de: ${configPath}\n`);
    
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    console.log('📋 Configuração carregada:');
    console.log(`   - Jira URL: ${config.jiraUrl}`);
    console.log(`   - Email: ${config.jiraEmail}`);
    console.log(`   - Projeto: IT`);
    console.log('');
    
    // Criar instância do JiraService
    const jiraService = new JiraService(config);
    
    // Buscar TODOS os tickets não resolvidos do usuário
    console.log('📡 Buscando todos os tickets não resolvidos...');
    const assignee = config.monitorOtherUser && config.otherUserEmail 
      ? `"${config.otherUserEmail}"` 
      : 'currentUser()';
    
    const jql = `assignee = ${assignee} AND resolution = Unresolved AND project = IT ORDER BY updated DESC`;
    console.log(`   JQL: ${jql}\n`);
    
    const result = await jiraService._searchJql(jql, ['status', 'key', 'summary', 'updated']);
    
    const tickets = result.issues || [];
    console.log(`✅ ${tickets.length} tickets encontrados\n`);
    
    if (tickets.length === 0) {
      console.log('⚠️ Nenhum ticket encontrado. Verifique se há tickets atribuídos a você no projeto IT.');
      return;
    }
    
    // Agrupar tickets por status
    const statusGroups = {};
    
    tickets.forEach(ticket => {
      const status = ticket.fields.status?.name || 'Status Desconhecido';
      
      if (!statusGroups[status]) {
        statusGroups[status] = [];
      }
      
      statusGroups[status].push({
        key: ticket.key,
        summary: ticket.fields.summary,
        updated: ticket.fields.updated
      });
    });
    
    // Listar todos os status encontrados
    console.log('📊 === STATUS ENCONTRADOS ===\n');
    
    const statusList = Object.keys(statusGroups).sort();
    
    statusList.forEach(status => {
      const count = statusGroups[status].length;
      console.log(`📌 "${status}": ${count} ticket(s)`);
      
      // Mostrar primeiros 3 tickets deste status como exemplo
      const examples = statusGroups[status].slice(0, 3);
      examples.forEach(ticket => {
        console.log(`   - ${ticket.key}: ${ticket.summary.substring(0, 60)}${ticket.summary.length > 60 ? '...' : ''}`);
      });
      
      if (statusGroups[status].length > 3) {
        console.log(`   ... e mais ${statusGroups[status].length - 3} ticket(s)`);
      }
      
      console.log('');
    });
    
    // Análise dos status
    console.log('🔍 === ANÁLISE DOS STATUS ===\n');
    
    // Verificar status relacionados a "Support"
    const supportStatuses = statusList.filter(s => 
      s.toLowerCase().includes('support') || 
      s.toLowerCase().includes('suporte')
    );
    
    if (supportStatuses.length > 0) {
      console.log('🟠 Status relacionados a SUPPORT:');
      supportStatuses.forEach(s => {
        console.log(`   - "${s}" (${statusGroups[s].length} tickets)`);
      });
    } else {
      console.log('⚠️ Nenhum status contendo "support" ou "suporte" encontrado');
    }
    console.log('');
    
    // Verificar status relacionados a "Customer"
    const customerStatuses = statusList.filter(s => 
      s.toLowerCase().includes('customer') || 
      s.toLowerCase().includes('cliente')
    );
    
    if (customerStatuses.length > 0) {
      console.log('🟢 Status relacionados a CUSTOMER:');
      customerStatuses.forEach(s => {
        console.log(`   - "${s}" (${statusGroups[s].length} tickets)`);
      });
    } else {
      console.log('⚠️ Nenhum status contendo "customer" ou "cliente" encontrado');
    }
    console.log('');
    
    // Verificar status relacionados a "Pending"
    const pendingStatuses = statusList.filter(s => 
      s.toLowerCase().includes('pending') || 
      s.toLowerCase().includes('pendente')
    );
    
    if (pendingStatuses.length > 0) {
      console.log('🟣 Status relacionados a PENDING:');
      pendingStatuses.forEach(s => {
        console.log(`   - "${s}" (${statusGroups[s].length} tickets)`);
      });
    } else {
      console.log('⚠️ Nenhum status contendo "pending" ou "pendente" encontrado');
    }
    console.log('');
    
    // Recomendações
    console.log('💡 === RECOMENDAÇÕES ===\n');
    console.log('Baseado nos status encontrados, as queries JQL devem usar:');
    console.log('');
    
    if (supportStatuses.length > 0) {
      const statusList = supportStatuses.map(s => `"${s}"`).join(', ');
      console.log(`🟠 Waiting for Support: status in (${statusList})`);
    }
    
    if (customerStatuses.length > 0) {
      const statusList = customerStatuses.map(s => `"${s}"`).join(', ');
      console.log(`🟢 Waiting for Customer: status in (${statusList})`);
    }
    
    if (pendingStatuses.length > 0) {
      const statusList = pendingStatuses.map(s => `"${s}"`).join(', ');
      console.log(`🟣 Pending: status in (${statusList})`);
    }
    
    console.log('');
    console.log('✅ Debug concluído!');
    
  } catch (error) {
    console.error('❌ Erro ao executar debug:', error.message);
    console.error(error.stack);
  }
}

// Executar debug
debugStatusNames();
