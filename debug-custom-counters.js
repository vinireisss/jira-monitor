#!/usr/bin/env node

/**
 * 🔍 DEBUG: Testar Contadores Customizados
 * 
 * Este script testa as 3 queries customizadas que estão mostrando 0:
 * 1. Tickets Pending SimCard (Filtro 52128)
 * 2. Tickets L0 Jira Bot (Queue 7631)
 * 3. All L1 Open (Queue 3015)
 */

const fs = require('fs');
const path = require('path');

// Tentar carregar configuração de várias fontes
let config = null;

// 1. Tentar ler config.json local
const configPath = path.join(__dirname, 'config.json');
if (fs.existsSync(configPath)) {
  console.log('📂 Carregando config.json local...');
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// 2. Se não encontrou, tentar buscar do Electron Store (caminho manual)
if (!config) {
  const electronConfigPaths = [
    path.join(require('os').homedir(), 'Library', 'Application Support', 'jira-monitor', 'config.json'),
    path.join(require('os').homedir(), 'Library', 'Application Support', 'jira-monitor-nodejs', 'config.json'),
    path.join(require('os').homedir(), 'Library', 'Preferences', 'jira-monitor', 'config.json')
  ];
  
  for (const electronPath of electronConfigPaths) {
    if (fs.existsSync(electronPath)) {
      console.log(`📂 Carregando configuração do Electron: ${electronPath}`);
      const data = JSON.parse(fs.readFileSync(electronPath, 'utf8'));
      config = data.config || data;
      break;
    }
  }
}

// 3. Verificar se temos as informações necessárias
if (!config || !config.jiraUrl || !config.jiraEmail || !config.jiraApiToken) {
  console.error('\n❌ Configuração não encontrada ou incompleta!');
  console.error('\n💡 Opções:');
  console.error('   1. Crie um arquivo config.json baseado em config.example.json');
  console.error('   2. Execute o aplicativo primeiro para gerar a configuração');
  console.error('   3. Forneça as credenciais via variáveis de ambiente:');
  console.error('      JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN\n');
  
  // Tentar obter de variáveis de ambiente
  const envConfig = {
    jiraUrl: process.env.JIRA_URL,
    jiraEmail: process.env.JIRA_EMAIL,
    jiraApiToken: process.env.JIRA_API_TOKEN
  };
  
  if (envConfig.jiraUrl && envConfig.jiraEmail && envConfig.jiraApiToken) {
    console.log('✅ Usando configuração de variáveis de ambiente\n');
    config = envConfig;
  } else {
    process.exit(1);
  }
}

// Headers para autenticação
const authString = Buffer.from(`${config.jiraEmail}:${config.jiraApiToken}`).toString('base64');
const headers = {
  'Authorization': `Basic ${authString}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

console.log('\n════════════════════════════════════════════════════════');
console.log('🔍 DEBUG: CONTADORES CUSTOMIZADOS');
console.log('════════════════════════════════════════════════════════\n');
console.log(`🌐 Jira URL: ${config.jiraUrl}`);
console.log(`👤 Email: ${config.jiraEmail}`);
console.log('\n');

/**
 * Fazer requisição ao Jira
 */
async function makeRequest(endpoint) {
  const url = `${config.jiraUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Erro na requisição: ${error.message}`);
    return null;
  }
}

/**
 * Buscar tickets com JQL
 */
async function searchJql(jql, description) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${description}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n🔍 JQL: ${jql}\n`);
  
  const endpoint = `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=key,summary,status,assignee`;
  
  const data = await makeRequest(endpoint);
  
  if (!data) {
    console.log('❌ Falha ao buscar dados\n');
    return { count: 0, tickets: [] };
  }
  
  const tickets = data.issues || [];
  console.log(`✅ Total de tickets: ${tickets.length}\n`);
  
  if (tickets.length > 0) {
    console.log('📝 Tickets encontrados:\n');
    tickets.slice(0, 10).forEach((ticket, idx) => {
      console.log(`   ${idx + 1}. ${ticket.key} - ${ticket.fields.status.name}`);
      console.log(`      ${ticket.fields.summary.substring(0, 80)}...`);
      if (ticket.fields.assignee) {
        console.log(`      👤 Assignee: ${ticket.fields.assignee.displayName}`);
      } else {
        console.log(`      👤 Assignee: (sem assignee)`);
      }
      console.log('');
    });
    
    if (tickets.length > 10) {
      console.log(`   ... e mais ${tickets.length - 10} tickets\n`);
    }
  } else {
    console.log('⚠️  Nenhum ticket encontrado com essa query!\n');
  }
  
  return { count: tickets.length, tickets };
}

/**
 * Testar Query 1: SIM Cards (Filtro 52128)
 */
async function testSimCards() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  📱 TESTE 1: TICKETS PENDING SIMCARD (Filtro 52128)  ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  // Primeiro, buscar o JQL do filtro
  console.log('\n🔍 Buscando JQL do filtro 52128...\n');
  const filterData = await makeRequest('/rest/api/3/filter/52128');
  
  if (!filterData) {
    console.log('❌ Não foi possível buscar o filtro 52128');
    console.log('⚠️  Possíveis causas:');
    console.log('   - Você não tem permissão para acessar este filtro');
    console.log('   - O filtro não existe');
    console.log('   - O ID do filtro está incorreto\n');
    
    // Tentar query manual
    console.log('🔧 Tentando query manual...\n');
    const manualJql = 'project = "IT" AND labels = "telefonia" AND statusCategory != "Done" ORDER BY created DESC';
    return await searchJql(manualJql, 'SIM Cards (Query Manual)');
  }
  
  console.log(`✅ Filtro encontrado: ${filterData.name}`);
  console.log(`📝 Descrição: ${filterData.description || '(sem descrição)'}`);
  console.log(`👤 Owner: ${filterData.owner?.displayName || 'N/A'}`);
  console.log(`🔓 Compartilhado: ${filterData.sharePermissions?.length > 0 ? 'Sim' : 'Não'}\n`);
  
  let jql = filterData.jql;
  console.log(`📋 JQL Original: ${jql}\n`);
  
  // Verificar se precisa adicionar status
  if (!jql.includes('Waiting for Customer') && !jql.includes('Aguardando Cliente')) {
    jql = jql.replace(
      /status\s+in\s*\([^)]+\)/i,
      match => {
        const newStatuses = '"Waiting for Customer", "Aguardando Cliente"';
        return match.replace(')', `, ${newStatuses})`);
      }
    );
    console.log(`🔧 JQL Modificado: ${jql}\n`);
  }
  
  return await searchJql(jql, 'SIM Cards (Filtro 52128)');
}

/**
 * Testar Query 2: L0 Jira Bot (Queue 7631)
 */
async function testL0Bot() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║      🤖 TESTE 2: TICKETS L0 JIRA BOT (Queue 7631)     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  // Tentar buscar JQL da queue via API Service Desk
  console.log('\n🔍 Tentando buscar JQL da queue 7631 via API Service Desk...\n');
  const queueData = await makeRequest('/rest/servicedeskapi/servicedesk/IT/queue/7631');
  
  let jql;
  
  if (queueData && queueData.jql) {
    console.log(`✅ JQL obtido da queue: ${queueData.jql}\n`);
    jql = queueData.jql;
  } else {
    console.log('⚠️  Não foi possível obter JQL da queue via API');
    console.log('🔧 Usando JQL manual...\n');
    jql = 'project = "IT" AND statusCategory != "Done" AND (queue = 7631 OR "Service Desk Queue" = 7631) ORDER BY created DESC';
  }
  
  return await searchJql(jql, 'L0 Jira Bot (Queue 7631)');
}

/**
 * Testar Query 3: All L1 Open (Queue 3015)
 */
async function testL1Open() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║      🎯 TESTE 3: ALL L1 OPEN (Queue 3015)             ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  // Tentar buscar JQL da queue via API Service Desk
  console.log('\n🔍 Tentando buscar JQL da queue 3015 via API Service Desk...\n');
  const queueData = await makeRequest('/rest/servicedeskapi/servicedesk/IT/queue/3015');
  
  let jql;
  
  if (queueData && queueData.jql) {
    console.log(`✅ JQL obtido da queue: ${queueData.jql}\n`);
    jql = queueData.jql;
  } else {
    console.log('⚠️  Não foi possível obter JQL da queue via API');
    console.log('🔧 Usando JQL manual...\n');
    jql = 'project = "IT" AND statusCategory != "Done" AND (queue = 3015 OR "Service Desk Queue" = 3015) ORDER BY created DESC';
  }
  
  return await searchJql(jql, 'All L1 Open (Queue 3015)');
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  const results = {
    simCards: null,
    l0Bot: null,
    l1Open: null
  };
  
  try {
    results.simCards = await testSimCards();
  } catch (error) {
    console.error(`❌ Erro no teste SIM Cards: ${error.message}`);
  }
  
  try {
    results.l0Bot = await testL0Bot();
  } catch (error) {
    console.error(`❌ Erro no teste L0 Bot: ${error.message}`);
  }
  
  try {
    results.l1Open = await testL1Open();
  } catch (error) {
    console.error(`❌ Erro no teste L1 Open: ${error.message}`);
  }
  
  // Resumo final
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                  📊 RESUMO FINAL                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log(`📱 SIM Cards:    ${results.simCards?.count || 0} tickets`);
  console.log(`🤖 L0 Jira Bot:  ${results.l0Bot?.count || 0} tickets`);
  console.log(`🎯 All L1 Open:  ${results.l1Open?.count || 0} tickets`);
  console.log('\n');
  
  // Análise
  const allZero = (results.simCards?.count || 0) === 0 && 
                  (results.l0Bot?.count || 0) === 0 && 
                  (results.l1Open?.count || 0) === 0;
  
  if (allZero) {
    console.log('⚠️  ANÁLISE: Todos os contadores estão em 0');
    console.log('\n📋 Possíveis causas:');
    console.log('   1. As queries JQL estão corretas mas não há tickets que correspondam aos filtros');
    console.log('   2. Você não tem permissão para visualizar esses tickets');
    console.log('   3. Os IDs de filtro/queue estão incorretos');
    console.log('   4. As labels ou campos de queue não estão configurados corretamente no Jira\n');
    
    console.log('💡 Próximos passos:');
    console.log('   1. Verifique no Jira se você consegue ver tickets nessas filas');
    console.log('   2. Confirme os IDs corretos de filtro/queue com seu admin');
    console.log('   3. Teste as JQLs diretamente no Jira (Issues > Search > JQL)\n');
  } else {
    console.log('✅ Pelo menos uma query retornou tickets!');
    console.log('   O problema pode estar na renderização ou na atualização do contador.\n');
  }
  
  console.log('════════════════════════════════════════════════════════\n');
}

// Executar
runAllTests().catch(error => {
  console.error('\n❌ ERRO FATAL:', error);
  process.exit(1);
});
