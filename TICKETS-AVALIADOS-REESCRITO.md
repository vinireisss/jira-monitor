# 🌟 Tickets Avaliados - Função Reescrita

## 📋 Resumo das Mudanças

A função `_getEvaluatedTickets()` foi **completamente reescrita** para ser mais simples, eficiente e fácil de entender.

### ✅ O que foi melhorado:

1. **Código mais limpo e legível** - Removido código complexo e desnecessário
2. **Paginação completa garantida** - Busca TODOS os tickets sem limites hardcoded
3. **JQL configurável** - Use a JQL que você quiser
4. **Comentários detalhados** - Explicações claras em cada etapa
5. **Logs simplificados** - Informações essenciais sem sobrecarga
6. **Multi-field fallback mantido** - Suporta múltiplos campos de avaliação

---

## 🔧 Como Configurar

### 1️⃣ Configurar o Campo de Avaliação

No arquivo `config.json`, adicione:

```json
{
  "evaluatedTicketsSatisfactionField": ["customfield_10120"]
}
```

**Ou múltiplos campos (fallback automático):**

```json
{
  "evaluatedTicketsSatisfactionField": ["customfield_10120", "customfield_10043"]
}
```

### 2️⃣ Como Descobrir Qual Campo Usar

Se você não sabe qual é o campo de avaliação no seu Jira:

1. Abra um ticket que tem avaliação no Jira
2. Pressione `F12` para abrir o DevTools
3. No Console, cole e execute:

```javascript
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
5. Adicione esse campo no `config.json`

### 3️⃣ Configurar JQL Customizada (Opcional)

Se você quiser usar uma JQL diferente da padrão:

```json
{
  "evaluatedTicketsJql": "status IN (Resolved, Cancelado) AND assignee WAS currentUser() ORDER BY created DESC"
}
```

**Diferença entre `currentUser()` e `WAS currentUser()`:**

- `assignee = currentUser()` - Apenas tickets **atualmente** atribuídos a você
- `assignee WAS currentUser()` - Tickets que **já foram** seus (mesmo que reatribuídos)

---

## 📊 JQL Padrão Utilizada

Se você não configurar uma JQL customizada, será usada:

```jql
status IN (Resolved, Cancelado) AND assignee = currentUser() ORDER BY created DESC
```

Esta JQL busca:
- ✅ Tickets resolvidos ou cancelados
- ✅ Que estão atribuídos a você
- ✅ Ordenados por data de criação (mais recentes primeiro)

---

## 🚀 Paginação Automática

A função agora garante que **TODOS os tickets** sejam buscados, não importa quantos sejam:

- ✅ Usa `_searchJqlWithPagination()` que busca recursivamente
- ✅ Não há limite hardcoded de tickets
- ✅ Usa `nextPageToken` do Jira para navegação correta
- ✅ Limite de segurança de 100.000 tickets (para evitar loops infinitos)

**Exemplo de volumes suportados:**
- 450 tickets com 5 estrelas
- 10 tickets com 1 estrela
- 9 tickets com 4 estrelas
- 3 tickets com 2 estrelas
- 2 tickets com 3 estrelas
- **Total: ~474 tickets** (sem problema!)

---

## 📋 Formatos de Campo Suportados

A função detecta automaticamente os seguintes formatos:

| Formato | Exemplo | Suportado |
|---------|---------|-----------|
| Número direto | `5` | ✅ |
| String numérica | `"5"` | ✅ |
| Objeto com rating | `{"rating": 5}` | ✅ |
| Objeto com value | `{"value": 5}` ou `{"value": "5"}` | ✅ |
| Booleano | `true` ou `false` | ❌ (ignorado) |
| Valor "0" | `{"value": "0"}` | ❌ (dropdown Jira) |
| Strings não-numéricas | `{"value": "Satisfied"}` | ❌ (ignorado) |

---

## 🔍 Etapas da Função

### Etapa 1: Identificar Campo(s) de Avaliação
- Usa campos configurados em `config.json`
- OU identifica automaticamente (mantido da versão anterior)
- Suporta múltiplos campos (fallback)

### Etapa 2: Construir JQL de Busca
- Usa JQL configurada ou a padrão
- Busca apenas tickets resolvidos/cancelados
- Ordena por data de criação

### Etapa 3: Buscar TODOS os Tickets (Paginação)
- Usa paginação recursiva
- Busca até 100.000 tickets (limite de segurança)
- Sem limites hardcoded

### Etapa 4: Processar e Filtrar
- Para cada ticket, verifica campos de avaliação
- Extrai valor numérico (1-5)
- Filtra apenas tickets com avaliação válida
- Agrupa por número de estrelas

### Etapa 5: Estatísticas Finais
- Contagem total de tickets avaliados
- Distribuição por estrelas (1-5)
- Uso de cada campo
- Retorno formatado para a UI

---

## 📈 Dados de Teste Esperados

Com seus dados de teste, você deve ver algo como:

```
✅ BUSCA CONCLUÍDA - ESTATÍSTICAS FINAIS
════════════════════════════════════════════════════════

📥 Total de tickets baixados: 1500+
✅ Tickets COM avaliação: 474
❌ Tickets SEM avaliação: 1026+

📊 Distribuição por estrelas:
   ⭐⭐⭐⭐⭐ (5 estrelas): 450
   ⭐⭐⭐⭐ (4 estrelas): 9
   ⭐⭐⭐ (3 estrelas): 2
   ⭐⭐ (2 estrelas): 3
   ⭐ (1 estrela): 10

✅ Total de tickets avaliados: 474
```

---

## 🐛 Troubleshooting

### Problema: "Nenhum campo válido de avaliação encontrado"

**Solução:** Configure manualmente o campo em `config.json`:

```json
{
  "evaluatedTicketsSatisfactionField": ["customfield_XXXXX"]
}
```

### Problema: Números não batem com o esperado

**Possíveis causas:**
1. Campo de avaliação incorreto
2. JQL filtrando tickets incorretamente
3. Tickets reatribuídos (use `WAS currentUser()` na JQL)

**Solução:** 
- Verifique os logs no console para ver quais campos estão sendo usados
- Ajuste a JQL se necessário
- Confirme o campo correto com o método do DevTools

### Problema: Muito lento para buscar tickets

**Explicação:** É normal! Se você tem 1500+ tickets, pode levar alguns segundos.

**Otimização:** A paginação usa lotes de 50 tickets, o que é o padrão recomendado pelo Jira.

---

## 🔄 Como Testar

1. **Limpe o cache:**
   ```bash
   rm -rf node_modules/.cache
   ```

2. **Reinicie o aplicativo:**
   ```bash
   npm start
   ```

3. **Verifique os logs no console:**
   - Procure por "BUSCA DE TICKETS AVALIADOS"
   - Verifique se o total bate com o esperado
   - Confirme a distribuição por estrelas

4. **Abra o Modo Pro:**
   - Clique no menu > "Modo Pro"
   - Vá até "Tickets Avaliados"
   - Expanda a lista
   - Verifique se todos os tickets aparecem

---

## 💡 Dicas

1. **Performance:** A busca é feita apenas uma vez e depois fica em cache
2. **Atualização:** Use Cmd+R (Mac) ou Ctrl+R (Windows) para forçar refresh
3. **Debug:** Olhe os logs no console para diagnóstico detalhado
4. **Múltiplos Campos:** Se houver dúvida sobre qual campo usar, configure múltiplos

---

## 📝 Exemplo de Configuração Completa

```json
{
  "jiraUrl": "https://suaempresa.atlassian.net",
  "jiraEmail": "seu.email@empresa.com",
  "jiraApiToken": "seu_api_token_aqui",
  "queueId": "1104",
  "refreshInterval": 60,
  "evaluatedTicketsSatisfactionField": ["customfield_10120"],
  "evaluatedTicketsJql": "status IN (Resolved, Cancelado) AND assignee = currentUser() ORDER BY created DESC"
}
```

---

## ✅ Checklist de Validação

Após a reescrita, verifique:

- [ ] Todos os tickets avaliados aparecem na lista
- [ ] A distribuição por estrelas está correta (5★: ~450, 4★: ~9, etc.)
- [ ] Não há limites artificiais (truncamento de resultados)
- [ ] A busca funciona para volumes grandes (1500+ tickets)
- [ ] Os logs estão claros e informativos
- [ ] A UI exibe corretamente os dados

---

## 🎯 Resultado Final

Com esta reescrita, você tem:

✅ **Código limpo e manutenível**  
✅ **Paginação completa sem limites**  
✅ **Configuração flexível**  
✅ **Performance otimizada**  
✅ **Suporte a múltiplos campos**  
✅ **Logs claros para debug**  

---

**Autor:** Assistente de IA especializado em Integração com API do Jira  
**Data:** 12 de janeiro de 2026  
**Versão:** 2.0 (Reescrita Simplificada)
