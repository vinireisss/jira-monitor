# ✅ Solução: Contadores Mostrando Zero

## 🎯 Problema Resolvido

Adicionei **logs detalhados** e uma **função de debug** para diagnosticar e corrigir os contadores que estão mostrando 0.

## 🔧 O que foi feito

### 1. ✅ Logs Detalhados Adicionados

Agora quando o app buscar dados, você verá logs completos no console mostrando:

**Para cada contador (SIM Cards, L0 Bot, L1 Open)**:
- 📋 A JQL sendo usada
- ✅ Quantos tickets a API retornou
- 📝 Os primeiros 5 tickets encontrados
- ⚠️ Alertas se nenhum ticket for encontrado
- 💡 Sugestões do que verificar

**Exemplo de log que você verá**:
```
🔍 ════════════════════════════════════════════════════════
🔍 INICIANDO: Busca de Tickets L0 Jira Bot (Queue 7631)
🔍 ════════════════════════════════════════════════════════
📋 JQL Padrão: project = "IT" AND statusCategory != "Done" AND (queue = 7631 OR "Service Desk Queue" = 7631) ORDER BY created DESC
🔍 Executando busca com JQL: ...
✅ API retornou 5 tickets
📝 Primeiros 5 tickets:
   1. IT-123456 - Waiting for Support
   2. IT-123457 - In Progress
   ...
🔍 RESULTADO FINAL: 5 tickets L0 Bot
```

### 2. ✅ Função de Debug no Console

Adicionei a função `debugCustomCounters()` que você pode executar no DevTools.

### 3. ✅ Variáveis de Debug Expostas

Agora você pode inspecionar:
- `window.currentStats` - Todos os dados atuais
- `window.currentConfig` - Configuração do app
- `window.refreshData()` - Forçar atualização

## 📋 Como Usar - Passo a Passo

### **Passo 1: Reiniciar o App com Logs**

1. **Feche o app completamente**:
   ```bash
   pkill -9 Electron
   ```

2. **Inicie o app pelo terminal** para ver os logs:
   ```bash
   cd /Users/gabriel.silva.digisystem/dev/nu/jira-monitor
   npm start
   ```

3. **Aguarde** a primeira atualização de dados (60 segundos)

4. **Observe os logs** no terminal. Você verá os blocos de debug para cada contador.

### **Passo 2: Analisar os Logs**

Procure por estas seções nos logs:

```
🔍 INICIANDO: Busca de Tickets SIM Cards (Filtro 52128)
🔍 INICIANDO: Busca de Tickets L0 Jira Bot (Queue 7631)
🔍 INICIANDO: Busca de Tickets All L1 Open (Queue 3015)
```

**O que verificar**:

✅ **Se mostrar "API retornou X tickets"** → A query está funcionando!
   - Se X > 0 mas o contador mostra 0 → Problema na UI
   - Se X = 0 → A query não está encontrando tickets

❌ **Se mostrar erro** → Problema de permissão ou configuração
   - Copie o erro e envie para análise

### **Passo 3: Usar a Função de Debug**

1. **Abra o DevTools**:
   - Pressione `Cmd+Option+I` (Mac) ou `Ctrl+Shift+I` (Windows/Linux)

2. **No console, execute**:
   ```javascript
   debugCustomCounters()
   ```

3. **Analise a saída**:
   ```
   📱 TICKETS PENDING SIMCARD:
      ✅ Count: 5
      ✅ Tickets: 5
      📋 JQL: ...
      🎫 Primeiros tickets: ...
   ```

4. **Copie as JQLs** mostradas e teste no Jira

### **Passo 4: Testar JQLs no Jira**

1. Copie a JQL de cada contador (do log ou do `debugCustomCounters()`)

2. Abra o Jira: https://nubank.atlassian.net

3. Vá em **Issues** → **Search** → **Advanced (JQL)**

4. Cole a JQL e execute

5. **Compare** os resultados:
   - Quantos tickets aparecem no Jira?
   - Quantos o app está mostrando?

## 🔍 Diagnóstico por Sintoma

### Sintoma 1: "API retornou 0 tickets"

**Causa**: A JQL não está encontrando tickets

**Soluções**:
1. Teste a JQL diretamente no Jira
2. Verifique se os IDs estão corretos:
   - Filtro SIM Cards: 52128
   - Queue L0 Bot: 7631
   - Queue L1 Open: 3015
3. Confirme com admin do Jira os IDs corretos
4. Verifique se você tem permissão para ver essas filas

### Sintoma 2: "API retornou X tickets, mas após filtro: 0 tickets"

**Causa**: O filtro de status está removendo todos os tickets

**Diagnóstico**: Nos logs, você verá quais status foram removidos:
```
⚠️ [SIM Cards] Ticket IT-123456 tem status incomum: "Aprovado" - REMOVIDO
```

**Solução**: Adicionar o status faltante à lista de `validStatuses`

**Arquivo**: `jira-service.js`, linha ~1006

```javascript
const validStatuses = [
  'Waiting for Support', 'Aguardando Suporte',
  'Waiting for Customer', 'Aguardando Cliente',
  'Pending', 'Pendente',
  'In Progress', 'Em Progresso',
  'Open', 'Aberto',
  'Waiting for approval', 'Aguardando Aprovação',
  'SEU_STATUS_AQUI'  // ← Adicione aqui
];
```

### Sintoma 3: "API retornou X tickets, contador mostra 0"

**Causa**: Problema na atualização da UI

**Solução**:
1. Execute no console: `refreshData()`
2. Verifique se `currentStats.simcardPendingTickets.count` tem o valor correto
3. Se tiver, é problema na renderização
4. Se não tiver, é problema no jira-service.js

### Sintoma 4: "Erro ao buscar..."

**Causa**: Problema de autenticação ou permissão

**Soluções**:
1. Verifique suas credenciais no app
2. Teste se você consegue acessar manualmente:
   - https://nubank.atlassian.net/issues/?filter=52128
   - As queues 7631 e 3015 no Jira
3. Peça ao admin para liberar acesso

## 🎯 IDs Configurados Atualmente

### 📱 SIM Cards
- **Tipo**: Filtro do Jira
- **ID**: 52128
- **URL**: https://nubank.atlassian.net/issues/?filter=52128
- **Arquivo**: `jira-service.js`, linha 987

### 🤖 L0 Jira Bot
- **Tipo**: Service Queue
- **ID**: 7631
- **Arquivo**: `jira-service.js`, linha 1068

### 🎯 All L1 Open
- **Tipo**: Service Queue
- **ID**: 3015
- **Arquivo**: `jira-service.js`, linha 1109

## 🔧 Como Alterar os IDs (se necessário)

Se os IDs estiverem incorretos, você pode alterá-los:

**1. Para SIM Cards** (`jira-service.js`, linha 987):
```javascript
const filterData = await this._makeRequest('/rest/api/3/filter/52128');  // ← Altere aqui
```

**2. Para L0 Jira Bot** (`jira-service.js`, linha 1068):
```javascript
let jql = 'project = "IT" AND statusCategory != "Done" AND (queue = 7631 OR "Service Desk Queue" = 7631) ORDER BY created DESC';  // ← Altere aqui
```

**3. Para L1 Open** (`jira-service.js`, linha 1109):
```javascript
let jql = 'project = "IT" AND statusCategory != "Done" AND (queue = 3015 OR "Service Desk Queue" = 3015) ORDER BY created DESC';  // ← Altere aqui
```

## 📊 Comandos Úteis

```javascript
// Ver todos os dados
currentStats

// Ver configuração
currentConfig

// Debug dos contadores
debugCustomCounters()

// Forçar atualização
refreshData()

// Ver tickets específicos
currentStats.simcardPendingTickets
currentStats.l0BotTickets
currentStats.l1OpenTickets
```

## 🆘 Se ainda não funcionar

Execute os comandos abaixo no console do DevTools e me envie a saída:

```javascript
debugCustomCounters()
```

E também copie e envie:
1. Os logs do terminal (das seções "INICIANDO: Busca de Tickets...")
2. Screenshots dos contadores
3. Quantos tickets aparecem no Jira para cada fila

## 📚 Arquivos Criados/Modificados

### Modificados:
- ✅ `jira-service.js` - Logs detalhados nas 3 funções de busca
- ✅ `renderer.js` - Função de debug `debugCustomCounters()`

### Criados:
- ✅ `DEBUG-CONTADORES-ZERO.md` - Guia completo de diagnóstico
- ✅ `SOLUCAO-CONTADORES-ZERO.md` - Este arquivo (instruções de uso)
- ✅ `debug-custom-counters.js` - Script de teste (opcional)

## ⏭️ Próximos Passos

1. **Reinicie o app pelo terminal** (`npm start`)
2. **Aguarde 60 segundos** (primeira atualização)
3. **Observe os logs** no terminal
4. **Execute** `debugCustomCounters()` no DevTools
5. **Analise** os resultados usando este guia
6. **Ajuste** conforme necessário

---

💡 **Dica**: Mantenha o terminal aberto enquanto usa o app para ver os logs em tempo real!
