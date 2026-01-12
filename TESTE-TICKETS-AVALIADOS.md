# 🧪 Guia de Teste - Tickets Avaliados (Função Reescrita)

## 🎯 Objetivo

Validar que a nova implementação de `_getEvaluatedTickets()` está funcionando corretamente e buscando **TODOS** os tickets avaliados sem limites.

---

## 📋 Pré-requisitos

Antes de começar os testes:

1. ✅ A função foi reescrita no `jira-service.js`
2. ✅ Você tem um volume significativo de tickets avaliados (~474 no seu caso)
3. ✅ Você conhece a distribuição esperada:
   - 5 Estrelas: ~450
   - 4 Estrelas: ~9
   - 3 Estrelas: ~2
   - 2 Estrelas: ~3
   - 1 Estrela: ~10

---

## 🔧 Passo 1: Configurar o Campo de Avaliação

### Opção A: Descobrir o campo automaticamente

A função tentará descobrir automaticamente, mas pode ser lento. Se quiser configurar manualmente:

### Opção B: Configurar manualmente (Recomendado)

1. Abra o arquivo `config.json`

2. Adicione a configuração do campo:

```json
{
  "jiraUrl": "https://sua-empresa.atlassian.net",
  "jiraEmail": "seu.email@empresa.com",
  "jiraApiToken": "seu_token_aqui",
  "evaluatedTicketsSatisfactionField": ["customfield_10120"]
}
```

**💡 Dica:** Se você não sabe qual é o campo, veja a seção "Como Descobrir" abaixo.

### Como Descobrir o Campo de Avaliação

1. Abra um ticket avaliado no Jira
2. Pressione `F12` (DevTools)
3. Na aba Console, cole e execute:

```javascript
// Listar todos os customfields com seus valores
Object.keys(AP._data.issue.fields)
  .filter(k => k.includes('customfield'))
  .forEach(field => {
    const value = AP._data.issue.fields[field];
    if (value !== null && value !== undefined) {
      console.log(field, ':', value);
    }
  });
```

4. Procure por campos com valores numéricos de 1-5
5. Anote o campo (ex: `customfield_10120`)

---

## 🚀 Passo 2: Executar o Teste

### 2.1 Limpar Cache e Reiniciar

```bash
# Parar o aplicativo se estiver rodando
# Ctrl+C ou Cmd+C

# Opcional: Limpar cache do Node
rm -rf node_modules/.cache

# Reiniciar
npm start
```

### 2.2 Abrir Console do DevTools

1. Com o aplicativo aberto, pressione:
   - **Mac:** `Cmd + Option + I`
   - **Windows/Linux:** `Ctrl + Shift + I`

2. Vá para a aba **Console**

---

## 🔍 Passo 3: Monitorar os Logs

### O que procurar no console:

#### ✅ Log de Início (Etapa 1)
```
════════════════════════════════════════════════════════
🚀 BUSCA DE TICKETS AVALIADOS - VERSÃO SIMPLIFICADA
════════════════════════════════════════════════════════

🔍 ETAPA 1: Identificando campos de Satisfaction...
✅ Usando campos CONFIGURADOS MANUALMENTE: customfield_10120
```

#### ✅ Log de JQL (Etapa 2)
```
🔍 ETAPA 2: Construindo JQL de busca...
✅ JQL de busca definida:
   status IN (Resolved, Cancelado) AND assignee = currentUser() ORDER BY created DESC
   💡 Esta JQL buscará TODOS os tickets (sem limite)
```

#### ✅ Log de Busca (Etapa 3)
```
🔄 ETAPA 3: Buscando TODOS os tickets com paginação...
   📋 Campos solicitados: 8 campos
   🔍 Campos de avaliação: customfield_10120
   ⏳ Aguarde... (pode levar alguns segundos para volumes grandes)

✅ Busca concluída: 1523 tickets baixados no total
```

**💡 Importante:** O número total de tickets baixados deve incluir TODOS os seus tickets resolvidos/cancelados, não apenas os avaliados.

#### ✅ Log de Processamento (Etapa 4)
```
📊 ETAPA 4: Processando avaliações...
   📦 Total de tickets para processar: 1523
   🔍 Campos de avaliação: customfield_10120

🔍 DEBUG: Primeiros 3 tickets (para diagnóstico):

   Ticket #1: IT-12345
      customfield_10120: {"value": 5}

   Ticket #2: IT-12346
      customfield_10120: {"value": 4}

   Ticket #3: IT-12347
      customfield_10120: {"value": 5}
```

#### ✅ Log Final (Etapa 5) - **ESTE É O MAIS IMPORTANTE!**
```
════════════════════════════════════════════════════════
✅ BUSCA CONCLUÍDA - ESTATÍSTICAS FINAIS
════════════════════════════════════════════════════════

📥 Total de tickets baixados: 1523
✅ Tickets COM avaliação: 474
❌ Tickets SEM avaliação: 1049

📊 Distribuição por estrelas:
   ⭐⭐⭐⭐⭐ (5 estrelas): 450
   ⭐⭐⭐⭐ (4 estrelas): 9
   ⭐⭐⭐ (3 estrelas): 2
   ⭐⭐ (2 estrelas): 3
   ⭐ (1 estrela): 10

📋 Uso de campos:
   customfield_10120: 474 tickets

✅ Total de tickets avaliados: 474
════════════════════════════════════════════════════════
```

---

## ✅ Passo 4: Validar os Resultados

### 4.1 Comparar com Dados Esperados

Preencha a tabela comparativa:

| Métrica | Esperado | Obtido | Status |
|---------|----------|--------|--------|
| **Total baixado** | ~1500+ | _____ | ☐ |
| **5 Estrelas** | ~450 | _____ | ☐ |
| **4 Estrelas** | ~9 | _____ | ☐ |
| **3 Estrelas** | ~2 | _____ | ☐ |
| **2 Estrelas** | ~3 | _____ | ☐ |
| **1 Estrela** | ~10 | _____ | ☐ |
| **Total Avaliados** | ~474 | _____ | ☐ |

### 4.2 Verificar na Interface

1. Abra o Menu (canto superior direito)
2. Ative o **Modo Pro**
3. Navegue até **Tickets Avaliados**
4. Clique para **Expandir** a lista
5. Verifique:
   - ☐ Todos os tickets aparecem
   - ☐ As estrelas estão corretas
   - ☐ O número de cada categoria bate com os logs
   - ☐ Não há mensagens de erro

### 4.3 Testar Filtros por Estrela

Na interface de Tickets Avaliados:

1. Clique em cada barra do gráfico (5★, 4★, 3★, 2★, 1★)
2. Verifique se a lista filtra corretamente
3. Confirme que os números batem

---

## 🐛 Troubleshooting

### Problema 1: "Nenhum campo válido encontrado"

**Sintoma:**
```
❌ ERRO: Nenhum campo válido de avaliação encontrado
```

**Solução:**
Configure manualmente em `config.json`:
```json
{
  "evaluatedTicketsSatisfactionField": ["customfield_10120"]
}
```

### Problema 2: Números não batem

**Sintomas:**
- Menos tickets do que esperado
- Distribuição diferente

**Diagnóstico:**

1. Verifique a JQL nos logs (Etapa 2)
2. Confirme se está usando `currentUser()` ou `WAS currentUser()`
3. Verifique se o campo está correto

**Solução A - Tickets Históricos:**
Se você quer incluir tickets que foram reatribuídos, configure:
```json
{
  "evaluatedTicketsJql": "status IN (Resolved, Cancelado) AND assignee WAS currentUser() ORDER BY created DESC"
}
```

**Solução B - Campo Incorreto:**
Use o método do DevTools para descobrir o campo correto.

### Problema 3: Busca muito lenta

**Sintoma:**
- Demora mais de 1 minuto

**Diagnóstico:**
Verifique o número total de tickets baixados nos logs.

**Explicação:**
É normal para volumes grandes (1500+ tickets). A API do Jira tem rate limits.

**Otimização:**
A paginação já está otimizada com lotes de 50 tickets. Não há como acelerar mais sem violar os limites da API.

### Problema 4: Erro de EPIPE

**Sintoma:**
```
Error: write EPIPE
```

**Solução:**
A versão reescrita já reduz drasticamente os logs. Se ainda ocorrer:

1. Reinicie o aplicativo
2. Não abra múltiplas instâncias
3. Verifique se não há conflito de porta

---

## 📊 Testes Avançados

### Teste 1: Volume Extremo

**Objetivo:** Verificar se funciona com volume muito alto

**Passos:**
1. Não configure limite de tickets
2. Execute a busca normalmente
3. Verifique se todos os tickets são baixados

**Validação:**
- ☐ Busca completa sem erros
- ☐ Número total bate com o esperado
- ☐ Sem timeouts

### Teste 2: Múltiplos Campos (Fallback)

**Objetivo:** Testar suporte a múltiplos campos

**Configuração:**
```json
{
  "evaluatedTicketsSatisfactionField": ["customfield_10120", "customfield_10043"]
}
```

**Validação:**
- ☐ Função tenta primeiro campo
- ☐ Se não encontrar, tenta segundo campo
- ☐ Logs mostram uso de cada campo

### Teste 3: JQL Customizada

**Objetivo:** Validar configuração de JQL customizada

**Configuração:**
```json
{
  "evaluatedTicketsJql": "status = Resolved AND project = IT AND assignee = currentUser() ORDER BY updated DESC"
}
```

**Validação:**
- ☐ JQL aparece nos logs
- ☐ Resultados filtrados corretamente
- ☐ Sem erros de sintaxe JQL

---

## 📝 Relatório de Teste

Após completar todos os testes, preencha:

### Ambiente
- **Data do Teste:** _______________
- **Sistema Operacional:** _______________
- **Node Version:** _______________
- **Jira Instance:** _______________

### Resultados

| Teste | Status | Observações |
|-------|--------|-------------|
| Configuração do campo | ☐ Pass ☐ Fail | |
| Busca completa (Etapa 3) | ☐ Pass ☐ Fail | |
| Processamento (Etapa 4) | ☐ Pass ☐ Fail | |
| Distribuição correta | ☐ Pass ☐ Fail | |
| Interface (Modo Pro) | ☐ Pass ☐ Fail | |
| Filtros por estrela | ☐ Pass ☐ Fail | |

### Métricas Coletadas

- **Tempo total da busca:** _____ segundos
- **Total de tickets baixados:** _____
- **Total de tickets avaliados:** _____
- **Distribuição por estrelas:**
  - 5★: _____
  - 4★: _____
  - 3★: _____
  - 2★: _____
  - 1★: _____

### Problemas Encontrados

_Descreva aqui qualquer problema ou comportamento inesperado:_

```
[ESPAÇO PARA NOTAS]
```

### Status Final

- ☐ **✅ APROVADO** - Tudo funcionando conforme esperado
- ☐ **⚠️ APROVADO COM RESSALVAS** - Funciona, mas há pontos de atenção
- ☐ **❌ REPROVADO** - Problemas críticos encontrados

---

## 🎯 Próximos Passos

Após o teste:

### Se Aprovado ✅
1. Comitar as mudanças no Git
2. Atualizar documentação se necessário
3. Monitorar em produção

### Se Reprovado ❌
1. Anotar problemas detalhadamente
2. Reportar ao desenvolvedor
3. Aguardar correções

---

## 📞 Suporte

Se encontrar problemas:

1. **Logs:** Copie os logs completos do console
2. **Screenshots:** Tire prints da interface com erro
3. **Config:** Compartilhe o `config.json` (sem senha/token)
4. **Descrição:** Explique o que esperava vs o que aconteceu

---

**Boa sorte nos testes! 🚀**

---

**Guia elaborado por:** Assistente de IA - Especialista em Integração com API do Jira  
**Data:** 12 de janeiro de 2026  
**Versão:** 1.0
