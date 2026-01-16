# 🚀 Instruções Rápidas - Corrigir Contadores

## ⚡ TL;DR (Resumo Super Rápido)

```bash
# 1. Reinicie o app pelo terminal
cd /Users/gabriel.silva.digisystem/dev/nu/jira-monitor
pkill -9 Electron
npm start

# 2. Aguarde 60 segundos

# 3. Observe os logs no terminal (procure por linhas com 🔍)

# 4. Abra DevTools (Cmd+Option+I) e execute:
debugCustomCounters()
```

## 📊 O que Vai Acontecer Agora

### No Terminal (quando reiniciar o app):

Você verá blocos de log assim:

```
🔍 ════════════════════════════════════════════════════════
🔍 INICIANDO: Busca de Tickets SIM Cards (Filtro 52128)
🔍 ════════════════════════════════════════════════════════
📋 JQL Original do filtro: project = IT AND ...
✅ API retornou 15 tickets (antes do filtro)
✅ Após filtro: 15 tickets válidos
📝 Primeiros 5 tickets:
   1. IT-123456 - Waiting for Support
   2. IT-123457 - Pending
   ...
🔍 RESULTADO FINAL: 15 tickets SIM Cards
```

### No Console do DevTools:

Execute `debugCustomCounters()` e verá:

```
📱 TICKETS PENDING SIMCARD:
   ✅ Count: 15
   ✅ Tickets: 15
   📋 JQL: ...
   🎫 Primeiros tickets: ...

🤖 TICKETS L0 JIRA BOT:
   ✅ Count: 8
   ...

🎯 ALL L1 OPEN:
   ✅ Count: 23
   ...
```

## 🎯 Interpretação Rápida

### ✅ Cenário 1: Count > 0

```
✅ API retornou 15 tickets
✅ Count: 15
```

**Status**: ✅ FUNCIONANDO!  
**Ação**: Nenhuma, está correto

---

### ⚠️ Cenário 2: API retorna mas Count = 0

```
✅ API retornou 15 tickets (antes do filtro)
✅ Após filtro: 0 tickets válidos
⚠️ [SIM Cards] Ticket IT-123456 tem status "Aprovado" - REMOVIDO
```

**Status**: ⚠️ Filtro muito restritivo  
**Ação**: Adicionar status "Aprovado" à lista de válidos

**Como corrigir**:
1. Abra `jira-service.js`
2. Linha ~1026
3. Adicione o status faltante:

```javascript
const validStatuses = [
  'Waiting for Support', 'Aguardando Suporte',
  'Waiting for Customer', 'Aguardando Cliente',
  'Pending', 'Pendente',
  'In Progress', 'Em Progresso',
  'Open', 'Aberto',
  'Waiting for approval', 'Aguardando Aprovação',
  'Aprovado'  // ← Adicione o status que apareceu no log
];
```

4. Salve e reinicie o app

---

### ❌ Cenário 3: API retorna 0

```
✅ API retornou 0 tickets
⚠️ ATENÇÃO: Nenhum ticket encontrado para esta query!
💡 Verifique:
   1. Se a queue 7631 está correta
   2. Se você tem permissão...
```

**Status**: ❌ Query não encontra tickets  
**Ação**: Verificar IDs ou permissões

**Como corrigir**:
1. Copie a JQL do log
2. Teste no Jira: https://nubank.atlassian.net
3. Issues → Search → JQL
4. Cole a JQL
5. **Se não aparecer nenhum ticket no Jira**:
   - O ID da queue/filtro está errado
   - Você não tem permissão
   - Não há tickets nessa fila

6. **Se aparecerem tickets no Jira mas não no app**:
   - Problema de autenticação
   - Verifique suas credenciais no app

---

### ❌ Cenário 4: Erro

```
❌ ERRO ao buscar L0 Bot: 403 Forbidden
```

**Status**: ❌ Sem permissão  
**Ação**: Solicitar acesso ao admin do Jira

---

## 🔧 Correções Rápidas

### Problema: Filtro remove todos os tickets

**Arquivo**: `jira-service.js`, linha 1026

**Solução**: Adicionar status válidos:
```javascript
const validStatuses = [
  'Waiting for Support', 'Aguardando Suporte',
  'Waiting for Customer', 'Aguardando Cliente',
  'Pending', 'Pendente',
  'In Progress', 'Em Progresso',
  'Open', 'Aberto',
  'Waiting for approval', 'Aguardando Aprovação',
  // Adicione mais status aqui conforme necessário
];
```

### Problema: ID de queue/filtro incorreto

**SIM Cards** - `jira-service.js`, linha 987:
```javascript
const filterData = await this._makeRequest('/rest/api/3/filter/52128');  // ← Altere o número
```

**L0 Bot** - `jira-service.js`, linha 1068:
```javascript
let jql = '... AND (queue = 7631 OR ...';  // ← Altere o número
```

**L1 Open** - `jira-service.js`, linha 1109:
```javascript
let jql = '... AND (queue = 3015 OR ...';  // ← Altere o número
```

### Problema: Desabilitar filtro completamente (teste)

**Arquivo**: `jira-service.js`, linha 1045

**Comente o filtro**:
```javascript
// TESTE: Desabilitar filtro temporariamente
// const filteredIssues = (data.issues || []).filter(...);

// Retornar todos os tickets sem filtro
return {
  count: data.issues?.length || 0,
  tickets: data.issues || [],
  jql: jql
};
```

## 📚 Documentação Completa

Para mais detalhes, consulte:
- 📖 **SOLUCAO-CONTADORES-ZERO.md** - Guia completo com todas as soluções
- 🔍 **DEBUG-CONTADORES-ZERO.md** - Guia de diagnóstico detalhado

## 💡 Comandos Úteis

```javascript
// Console do DevTools (Cmd+Option+I)

debugCustomCounters()          // Debug completo
currentStats                   // Ver todos os dados
refreshData()                  // Forçar atualização
currentStats.simcardPendingTickets   // SIM Cards
currentStats.l0BotTickets            // L0 Bot
currentStats.l1OpenTickets           // L1 Open
```

## 🎯 Checklist Rápido

- [ ] Reiniciei o app pelo terminal (`npm start`)
- [ ] Aguardei 60 segundos
- [ ] Vi os logs no terminal
- [ ] Executei `debugCustomCounters()` no DevTools
- [ ] Copiei as JQLs e testei no Jira
- [ ] Identifiquei qual cenário acima se aplica
- [ ] Apliquei a correção correspondente

---

**🚀 Comece agora**: `pkill -9 Electron && npm start`
