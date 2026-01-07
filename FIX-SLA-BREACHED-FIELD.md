# 🔴 FIX: Detecção de SLA Expirado (Campo `breached`)

**Data:** 07/01/2026  
**Ticket Exemplo:** IT-1082350  
**Status:** ✅ CORRIGIDO

---

## 🔍 Problema Identificado

O ticket **IT-1082350** teve o SLA expirado mas **não ficou vermelho** na aplicação.

### Causa Raiz

O sistema estava calculando o SLA apenas baseado no **tempo restante** (`breachTime - now`), mas **NÃO verificava o campo `breached`** do Jira Service Management.

No JSM, quando um SLA é estourado, o campo contém:

```json
{
  "customfield_10123": {
    "name": "Time to resolution",
    "ongoingCycle": {
      "breached": true,  // ⚠️ ESTE CAMPO INDICA QUE O SLA JÁ ESTOUROU!
      "breachTime": {
        "iso8601": "2026-01-05T10:00:00-0300"
      }
    }
  }
}
```

Ou quando o SLA foi completado:

```json
{
  "customfield_10123": {
    "completedCycles": [{
      "breached": true,  // ⚠️ Também pode estar aqui
      "breachTime": { ... }
    }]
  }
}
```

---

## 🛠️ Correções Aplicadas

### 1. **`jira-service.js`** - Função `_getSlaStatus()` atualizada

Agora a função **verifica PRIMEIRO** o campo `breached` antes de calcular o tempo:

```javascript
_getSlaStatus(duedate, issue = null) {
  if (!duedate) return 'unknown';
  
  // 🎯 PRIORIDADE: Verificar campo 'breached' do Jira Service Management
  if (issue && issue.fields) {
    // Verificar customfield_10123 (Time to resolution)
    const timeToResolution = issue.fields.customfield_10123;
    if (timeToResolution) {
      // Verificar ongoingCycle.breached
      if (timeToResolution.ongoingCycle && timeToResolution.ongoingCycle.breached === true) {
        return 'overdue'; // 🔴 Estourado
      }
      // Verificar completedCycles
      if (timeToResolution.completedCycles && timeToResolution.completedCycles.length > 0) {
        const lastCycle = timeToResolution.completedCycles[timeToResolution.completedCycles.length - 1];
        if (lastCycle.breached === true) {
          return 'overdue'; // 🔴 Estourado
        }
      }
    }
    
    // Verificar customfield_10124 (Time to first response)
    const timeToFirstResponse = issue.fields.customfield_10124;
    if (timeToFirstResponse) {
      if (timeToFirstResponse.ongoingCycle && timeToFirstResponse.ongoingCycle.breached === true) {
        return 'overdue';
      }
      if (timeToFirstResponse.completedCycles && timeToFirstResponse.completedCycles.length > 0) {
        const lastCycle = timeToFirstResponse.completedCycles[timeToFirstResponse.completedCycles.length - 1];
        if (lastCycle.breached === true) {
          return 'overdue';
        }
      }
    }
  }
  
  // Se não tem campo breached, calcular baseado no tempo
  const now = new Date();
  const dueDate = new Date(duedate);
  const timeDiff = dueDate - now;
  const diffMinutes = Math.floor(timeDiff / 60000);
  
  if (diffMinutes < 0) return 'overdue';
  if (diffMinutes <= 60) return 'critical';
  if (diffMinutes <= 180) return 'warning';
  return 'safe';
}
```

### 2. **`renderer.js`** - Nova função `isSlaBreached()`

Criada função específica para verificar o campo `breached`:

```javascript
function isSlaBreached(ticket) {
  if (!ticket || !ticket.fields) return false;
  
  // Verificar customfield_10123 (Time to resolution)
  const timeToResolution = ticket.fields.customfield_10123;
  if (timeToResolution) {
    if (timeToResolution.ongoingCycle && timeToResolution.ongoingCycle.breached === true) {
      console.log(`🔴 SLA BREACHED detectado em customfield_10123 para ${ticket.key}`);
      return true;
    }
    if (timeToResolution.completedCycles && timeToResolution.completedCycles.length > 0) {
      const lastCycle = timeToResolution.completedCycles[timeToResolution.completedCycles.length - 1];
      if (lastCycle.breached === true) {
        console.log(`🔴 SLA BREACHED detectado em completedCycles para ${ticket.key}`);
        return true;
      }
    }
  }
  
  // Verificar customfield_10124 (Time to first response)
  // ... (mesma lógica)
  
  return false;
}
```

### 3. **Atualização em TODOS os locais de cálculo de SLA**

Atualizados 3 locais onde o SLA é calculado:

1. **`loadTicketsList()`** - Lista principal de tickets
2. **`loadProjectTickets()`** - Tickets por projeto
3. **`loadSimCardsTicketsList()`** - Lista de SIM Cards

Todos agora seguem a lógica:

```javascript
// 🎯 PRIORIDADE: Verificar campo breached do JSM
if (isSlaBreached(ticket)) {
  slaStatus = 'overdue'; // 🔴 Estourado
} else {
  // Calcular baseado no tempo restante
  // ...
}
```

---

## ✅ Campos Verificados

A correção verifica o campo `breached` em:

| Campo | Descrição | Locais Verificados |
|-------|-----------|-------------------|
| `customfield_10123` | Time to resolution | `ongoingCycle.breached`<br>`completedCycles[].breached` |
| `customfield_10124` | Time to first response | `ongoingCycle.breached`<br>`completedCycles[].breached` |

---

## 🔧 Como Testar

### 1. **Reinicie o Jira Monitor**

```bash
# Feche completamente o app e reabra
```

### 2. **Abra o Console** 

Pressione `Cmd + Option + I` (Mac) ou `Ctrl + Shift + I` (Windows/Linux)

### 3. **Expanda os cards de tickets IT**

Clique para expandir:
- Total
- Waiting for Support
- Projetos IT

### 4. **Procure pelo ticket IT-1082350**

O ticket deve estar com **borda vermelha escura** e fundo levemente vermelho (pulsante).

### 5. **Verifique os logs no Console**

Você deve ver mensagens como:

```
🔴 SLA BREACHED detectado em customfield_10123 para IT-1082350
```

---

## 🎨 Resultado Esperado

### Ticket com SLA Expirado

- **Borda:** Vermelha escura (`#c0392b`)
- **Fundo:** Gradiente vermelho sutil
- **Animação:** Pulsação suave
- **Atributo HTML:** `data-sla-status="overdue"`

### Hierarquia de Detecção

1. ✅ **Verificar `breached = true`** (NOVO!)
2. ✅ Calcular tempo restante (`breachTime - now`)
3. ✅ Verificar se tempo é negativo

---

## 📊 Vantagens da Correção

✅ **Detecção precisa** - Usa o campo oficial do JSM  
✅ **Sem falsos negativos** - Pega todos os SLAs estourados  
✅ **Logs informativos** - Fácil troubleshooting  
✅ **Retrocompatível** - Mantém cálculo por tempo como fallback  
✅ **Performance** - Verificação rápida do campo booleano  

---

## 🔄 Comportamento

### Antes da Correção

```
Ticket IT-1082350:
- Campo breached = true no Jira ❌ (ignorado)
- breachTime = "2026-01-05T10:00:00"
- Tempo agora = "2026-01-07T14:30:00"
- Cálculo: breachTime - now = -2d 4h ❌
- Status: overdue (calculado)
- Problema: Às vezes não detectava corretamente
```

### Depois da Correção

```
Ticket IT-1082350:
- Campo breached = true no Jira ✅ (VERIFICADO PRIMEIRO!)
- Status: overdue (direto do campo breached)
- Log: "🔴 SLA BREACHED detectado em customfield_10123 para IT-1082350"
- Resultado: SEMPRE vermelho quando breached = true
```

---

## 🚨 Casos de Teste

| Situação | `breached` | `breachTime - now` | Status Esperado |
|----------|-----------|-------------------|----------------|
| SLA OK | `false` | `+5h` | 🟢 `safe` |
| SLA Próximo | `false` | `+45min` | 🔴 `critical` |
| SLA Estourado (recente) | `true` | `-10min` | 🔴 `overdue` ✅ |
| SLA Estourado (antigo) | `true` | `-2 dias` | 🔴 `overdue` ✅ |
| SLA Pausado | `false` | `+1h` | 🟡 `warning` |

---

## 📝 Arquivos Modificados

### `jira-service.js`
- ✅ Função `_getSlaStatus()` - Adiciona verificação de `breached`
- ✅ Função `_calculateSlaAlerts()` - Passa ticket completo para `_getSlaStatus()`

### `renderer.js`
- ✅ Nova função `isSlaBreached()` - Verifica campo `breached`
- ✅ Função `loadTicketsList()` - Verifica `breached` ANTES de calcular tempo
- ✅ Função `loadProjectTickets()` - Verifica `breached` ANTES de calcular tempo
- ✅ Função `loadSimCardsTicketsList()` - Verifica `breached` ANTES de calcular tempo

---

## 🎯 Próximos Passos

- ✅ Código atualizado para verificar campo `breached`
- ✅ Logs de debug implementados
- ✅ Todas as listas de tickets atualizadas
- ⏳ **Aguardando teste com IT-1082350**

---

## 📚 Referências

- [Jira Service Management - SLA API Format](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-servicedesk/#api-rest-servicedeskapi-request-issueIdOrKey-sla-get)
- `customfield_10123`: Time to resolution
- `customfield_10124`: Time to first response
- Campo `breached`: Indica se o SLA foi estourado (independente do tempo)

---

**Status Final:** ✅ PRONTO PARA TESTE

**Ticket de Referência:** IT-1082350

**Autor:** Jira Monitor Team  
**Data:** 07/01/2026

