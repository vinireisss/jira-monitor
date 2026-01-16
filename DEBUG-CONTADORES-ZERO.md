# 🔍 DEBUG: Contadores Mostrando Zero

## Problema

Os seguintes contadores estão mostrando 0, mas há tickets no Jira:
- 📱 **Tickets Pending SimCard**
- 🤖 **Tickets L0 Jira Bot**
- 🎯 **All L1 Open**

## 🛠️ Como Diagnosticar

### 1. Usar a Função de Debug no Console

1. **Abra o DevTools** do Electron:
   - Pressione `Cmd+Option+I` (macOS) ou `Ctrl+Shift+I` (Windows/Linux)
   - Ou clique com botão direito na janela e escolha "Inspecionar"

2. **Execute no Console**:
   ```javascript
   debugCustomCounters()
   ```

3. **O que verificar**:
   - ✅ Se `count` está 0 mas há tickets listados → problema na atualização da UI
   - ✅ Se `count` está 0 e não há tickets → problema na query JQL
   - ✅ Copie as JQLs mostradas e teste no Jira

### 2. Testar JQLs Diretamente no Jira

Copie cada JQL do console e teste diretamente no Jira:

1. Abra o Jira: https://nubank.atlassian.net
2. Vá em **Issues** → **Search**
3. Clique em **Advanced** (ou JQL)
4. Cole a JQL copiada
5. Verifique quantos tickets aparecem

#### JQLs Usadas:

**SIM Cards (Filtro 52128)**:
```jql
-- A JQL é obtida dinamicamente do filtro 52128
-- Teste: https://nubank.atlassian.net/issues/?filter=52128
```

**L0 Jira Bot (Queue 7631)**:
```jql
project = "IT" AND statusCategory != "Done" AND (queue = 7631 OR "Service Desk Queue" = 7631) ORDER BY created DESC
```

**All L1 Open (Queue 3015)**:
```jql
project = "IT" AND statusCategory != "Done" AND (queue = 3015 OR "Service Desk Queue" = 3015) ORDER BY created DESC
```

### 3. Verificar Permissões

**Filtro 52128 (SIM Cards)**:
- Você tem permissão para acessar este filtro?
- Teste: https://nubank.atlassian.net/issues/?filter=52128

**Queues 7631 e 3015**:
- Você faz parte das equipes que têm acesso a essas filas?
- Pergunte ao admin do Jira

### 4. Verificar Logs do Aplicativo

Nos logs do terminal/console onde o app está rodando, procure por:

```
🔍 [DEBUG] Buscando SIM cards tickets...
✅ [DEBUG] SIM cards OK
🔍 [DEBUG] Buscando L0 Jira Bot tickets...
✅ [DEBUG] L0 Jira Bot OK
🔍 [DEBUG] Buscando All L1 Open tickets...
✅ [DEBUG] All L1 Open OK
```

Se houver erros, eles aparecerão aqui.

### 5. Forçar Atualização

No console do DevTools:
```javascript
refreshData()
```

Aguarde alguns segundos e execute novamente:
```javascript
debugCustomCounters()
```

## 🔧 Possíveis Soluções

### Solução 1: Verificar IDs de Filtro/Queue

Os IDs podem estar incorretos. Verifique com o admin do Jira:

**Arquivo**: `jira-service.js`

**Linhas a verificar**:
- Linha 987: `const filterData = await this._makeRequest('/rest/api/3/filter/52128');` ← Filtro SIM Cards
- Linha 1049: `queue = 7631` ← Queue L0 Jira Bot
- Linha 1090: `queue = 3015` ← Queue All L1 Open

### Solução 2: Ajustar JQLs Manualmente

Se as JQLs automáticas não funcionarem, você pode editá-las manualmente:

**Arquivo**: `jira-service.js`

**Para SIM Cards** (linha ~1002):
```javascript
// Substituir pela JQL correta
const customJql = 'SEU_JQL_AQUI';
const data = await this._searchJql(customJql, [...]);
```

**Para L0 Bot** (linha ~1049):
```javascript
let jql = 'SEU_JQL_AQUI';
```

**Para L1 Open** (linha ~1090):
```javascript
let jql = 'SEU_JQL_AQUI';
```

### Solução 3: Verificar Status Válidos

Para SIM Cards, os status válidos são (linha 1006-1013):
- Waiting for Support / Aguardando Suporte
- Waiting for Customer / Aguardando Cliente
- Pending / Pendente
- In Progress / Em Progresso
- Open / Aberto
- Waiting for approval / Aguardando Aprovação

Se seus tickets têm outros status, adicione-os à lista `validStatuses`.

### Solução 4: Desabilitar Filtros

Se os filtros estiverem removendo tickets incorretamente, comente o filtro:

**Arquivo**: `jira-service.js`, linha ~1015

```javascript
// Comentar temporariamente para testar
// const filteredIssues = (data.issues || []).filter(issue => { ... });
// return { count: filteredIssues.length, ... };

// Retornar sem filtro
return {
  count: data.issues?.length || 0,
  tickets: data.issues || [],
  jql: jql
};
```

## 📊 Comandos Úteis no Console

```javascript
// Ver todos os dados atuais
currentStats

// Ver configuração
currentConfig

// Ver tickets específicos
currentStats.simcardPendingTickets
currentStats.l0BotTickets
currentStats.l1OpenTickets

// Forçar atualização
refreshData()

// Debug completo
debugCustomCounters()
```

## 🎯 Checklist de Diagnóstico

- [ ] Executei `debugCustomCounters()` no console
- [ ] Testei as JQLs diretamente no Jira
- [ ] Verifiquei se tenho permissão para acessar filtro/queues
- [ ] Confirmei os IDs corretos com admin do Jira
- [ ] Verifiquei os logs do aplicativo
- [ ] Forcei atualização com `refreshData()`
- [ ] Comparei contadores no app vs no Jira

## 💡 Próximos Passos

Se após todas as verificações os contadores ainda estiverem em 0:

1. **Capture as JQLs** usadas pelo app (via `debugCustomCounters()`)
2. **Teste no Jira** e anote quantos tickets aparecem
3. **Compare** com o que o app está mostrando
4. **Relate** com essas informações:
   - JQLs usadas
   - Número de tickets no Jira
   - Número de tickets no app
   - Logs de erro (se houver)
   - Screenshots

## 🆘 Contato

Se precisar de ajuda, forneça:
- Output completo de `debugCustomCounters()`
- Screenshots dos contadores
- Logs do terminal/console
- Resultado dos testes de JQL no Jira
