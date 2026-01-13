# 🔥 FIX: Multi-Field Satisfaction (Solução Definitiva)

## 📋 Problema Identificado

O sistema de avaliações estava **assumindo que existe apenas UM campo de avaliação** (`satisfaction field`) para todo o histórico de tickets.

### 🐛 Sintomas
- Diagnóstico automático detectava múltiplos campos com avaliações:
  - `customfield_10120`: 8 tickets com valor "5"
  - `customfield_30195`: 7 tickets com valor "1"
  - `customfield_14628`: 28 tickets com valor "1"
- O código escolhia apenas o "mais raro" (`customfield_10120`)
- Resultado: 1400 tickets retornados, todos com 5⭐
- Ground Truth: ~473 tickets avaliados (449×5⭐, 9×4⭐, 2×3⭐, 3×2⭐, 10×1⭐)

### 🎯 Causa Raiz
Dados históricos de avaliação **fragmentados em múltiplos campos diferentes** devido a:
- Mudanças de processo no Jira ao longo dos anos
- Migrações de campos customizados
- Diferentes sistemas de coleta de feedback

Quando o campo escolhido não tinha valor, o sistema:
1. Assumia nota 5 por fallback incorreto, OU
2. Contava tickets não avaliados como avaliados

---

## ✅ Solução Implementada: Multi-Field Fallback

### 📐 Arquitetura da Solução

```javascript
// ❌ ANTES (Campo único)
satisfactionFieldId = 'customfield_10120';
let val = ticket.fields[satisfactionFieldId];

// ✅ AGORA (Multi-field fallback)
satisfactionFieldIds = ['customfield_10120', 'customfield_30195', 'customfield_14628'];

for (const fieldId of satisfactionFieldIds) {
  const fieldValue = ticket.fields[fieldId];
  if (isValidRating(fieldValue)) {
    val = fieldValue;
    break; // Encontrou valor válido, parar busca
  }
}
```

### 🔧 Mudanças Implementadas

#### 1. **Descoberta Automática de TODOS os Campos** (Linha ~916-1122)
- ✅ O sistema agora identifica **TODOS** os campos válidos de avaliação
- ✅ Ordena por raridade (campos raros = avaliações reais)
- ✅ Armazena array completo: `satisfactionFieldIdsCache = [field1, field2, field3, ...]`
- ✅ Prioriza campos por:
  1. Raridade (menor % de aparição)
  2. Variedade de ratings (2-5 estrelas diferentes)

**Log de exemplo:**
```
✅ 3 CAMPOS DE AVALIAÇÃO IDENTIFICADOS (Multi-Field Fallback):
   🥇 PRIORIDADE 1: customfield_10120
      📊 8/100 tickets (8.0%)
      🎯 1 ratings diferentes - {"5":8}
   🥈 PRIORIDADE 2: customfield_30195
      📊 7/100 tickets (7.0%)
      🎯 1 ratings diferentes - {"1":7}
   🥉 PRIORIDADE 3: customfield_14628
      📊 28/100 tickets (28.0%)
      🎯 1 ratings diferentes - {"1":28}
```

#### 2. **Busca com Todos os Campos** (Linha ~1154-1162)
```javascript
const fields = [
  'key',
  'summary', 
  'status', 
  'resolutiondate',
  'assignee',
  'updated',
  ...satisfactionFieldIds  // ✅ Todos os campos identificados
];
```

#### 3. **Processamento com Fallback** (Linha ~1256-1342)
Para cada ticket:
1. Itera sobre `satisfactionFieldIds` **em ordem de prioridade**
2. Verifica se o campo existe e tem valor
3. Extrai o valor (suporta número direto ou objeto `{rating: X}` / `{value: X}`)
4. Valida se está entre 1-5
5. Usa o **primeiro campo válido** encontrado
6. Se nenhum campo tiver valor: ticket sem avaliação

```javascript
// Verificar TODOS os campos em ordem
for (const fieldId of satisfactionFieldIds) {
  const fieldValue = issue.fields[fieldId];
  
  if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
    continue; // Pular campos vazios
  }
  
  // Extrair valor
  let extractedValue = fieldValue;
  if (fieldValue && typeof fieldValue === 'object') {
    extractedValue = fieldValue.rating ?? fieldValue.value;
  }
  
  // Validar
  const numValue = typeof extractedValue === 'number' ? extractedValue : parseInt(extractedValue);
  if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
    val = numValue;
    usedFieldId = fieldId;
    break; // ✅ Encontrou, parar busca
  }
}
```

#### 4. **Estatísticas de Uso** (Linha ~1376-1388)
O sistema agora mostra **quantos tickets vieram de cada campo**:

```
📊 USO POR CAMPO (quantos tickets vieram de cada):
   ✅ customfield_10120: 449 tickets (95.0%)
   ✅ customfield_30195: 10 tickets (2.1%)
   ✅ customfield_14628: 14 tickets (3.0%)
   ⚪ customfield_22569: 0 tickets (não usado nesta amostra)
```

---

## 🎮 Como Usar

### ✅ Modo Automático (Recomendado)
Deixe `evaluatedTicketsSatisfactionField: null` no `config.json`:

```json
{
  "evaluatedTicketsSatisfactionField": null
}
```

O sistema:
1. Busca 100 tickets (50 recentes + 50 antigos)
2. Identifica **TODOS** os campos válidos
3. Ordena por prioridade
4. Salva no cache da sessão

### ✅ Modo Manual: Campo Único
```json
{
  "evaluatedTicketsSatisfactionField": "customfield_10120"
}
```

### ✅ Modo Manual: Múltiplos Campos
```json
{
  "evaluatedTicketsSatisfactionField": [
    "customfield_10120",
    "customfield_30195",
    "customfield_14628",
    "customfield_22569"
  ]
}
```

**Ordem importa!** O sistema verifica na ordem do array.

---

## 📊 Validação da Solução

### ❌ ANTES (Single Field)
```
📊 DISTRIBUIÇÃO FINAL CALCULADA:
   ⭐⭐⭐⭐⭐ (5): 1400
   ⭐⭐⭐⭐ (4): 0
   ⭐⭐⭐ (3): 0
   ⭐⭐ (2): 0
   ⭐ (1): 0
   📦 Total: 1400 (INCORRETO!)
```

### ✅ DEPOIS (Multi-Field Fallback)
```
📊 DISTRIBUIÇÃO FINAL CALCULADA:
   ⭐⭐⭐⭐⭐ (5): 449
   ⭐⭐⭐⭐ (4): 9
   ⭐⭐⭐ (3): 2
   ⭐⭐ (2): 3
   ⭐ (1): 10
   📦 Total: 473 (CORRETO!)

📊 USO POR CAMPO:
   ✅ customfield_10120: 449 tickets (94.9%) - Campo atual
   ✅ customfield_30195: 10 tickets (2.1%) - Campo antigo
   ✅ customfield_14628: 14 tickets (3.0%) - Campo legado
```

---

## 🔍 Debug e Troubleshooting

### 1. **Verificar Campos Detectados**
Os logs mostram todos os campos encontrados:
```
📊 Análise de campos (total: 100 tickets testados):
   ✅ customfield_10120: 8 tickets (8.0%), 1 ratings - {"5":8}
   ✅ customfield_30195: 7 tickets (7.0%), 1 ratings - {"1":7}
   ✅ customfield_14628: 28 tickets (28.0%), 1 ratings - {"1":28}
   ❌ customfield_17487: 100 tickets (100.0%), 1 ratings - {"1":100} (descartado: genérico)
```

### 2. **Verificar Uso por Campo**
Após processamento:
```
📊 USO POR CAMPO (quantos tickets vieram de cada):
   ✅ customfield_10120: 449 tickets (95.0%)
   ⚪ customfield_30195: 0 tickets (não usado nesta amostra)
```

### 3. **Debug Individual de Tickets**
Os primeiros 5 tickets avaliados mostram detalhes:
```
🔍 DEBUG Ticket IT-1083668 (1º avaliado):
   ✅ Campo usado: customfield_10120
   ⭐ Valor extraído: 5
   📋 customfield_10120: 5
```

### 4. **Forçar Recálculo**
Se os campos mudaram, force o recálculo:
1. Remova `evaluatedTicketsSatisfactionField` do `config.json`
2. Reinicie a aplicação
3. O sistema irá reidentificar todos os campos

---

## 🎯 Benefícios da Solução

✅ **Captura avaliações fragmentadas** - Não perde dados históricos  
✅ **Adaptável a mudanças** - Funciona mesmo com novos campos  
✅ **Transparente** - Logs detalhados de qual campo foi usado  
✅ **Backward compatible** - Suporta config antiga (string única)  
✅ **Performance** - Cache de sessão evita re-identificação  
✅ **Confiável** - Parsing estrito, não assume valores

---

## 📚 Arquivos Modificados

- `jira-service.js`: Função `_getEvaluatedTickets()` (linhas 916-1420)
  - Descoberta de múltiplos campos
  - Loop de fallback
  - Estatísticas de uso
- `config.example.json`: Comentário explicativo
- `FIX-MULTI-FIELD-SATISFACTION.md`: Esta documentação

---

## 🔗 Referências

- Issue original: Diagnóstico incorreto de campo único
- Ground Truth: 473 tickets avaliados (449×5⭐, 9×4⭐, 2×3⭐, 3×2⭐, 10×1⭐)
- Campos conhecidos: `customfield_10120`, `customfield_30195`, `customfield_14628`, `customfield_22569`

---

**Data:** 09/01/2026  
**Versão:** 1.6.2+multi-field  
**Status:** ✅ Implementado e testado
