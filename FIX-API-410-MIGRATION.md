# 🔧 Fix: Migração para Nova API do Jira (Erro 410)

## 📋 Problema

A aplicação estava recebendo um **Erro 410 (Gone)** ao tentar buscar dados do Jira:

```
Jira API Error (410): {"errorMessages":["The requested API has been removed. 
Please migrate to the /rest/api/3/search/jql API. A full migration guideline 
is available at https://developer.atlassian.com/changelog/#CHANGE-2046"],"errors":{}}
```

## 🎯 Causa

A Atlassian **removeu** o endpoint antigo de busca:
- ❌ **Antigo**: `/rest/api/3/search` (GET/POST)
- ❌ **Antigo**: `/rest/api/2/search` (GET)

Agora é **obrigatório** usar o novo endpoint:
- ✅ **Novo**: `/rest/api/3/search/jql` (POST apenas)

## 🔧 Solução Implementada

### Alterações no Código

#### 1. `jira-service.js`

**Função `_searchJql()` (linha ~555)**
```javascript
// ANTES
const endpoint = `/rest/api/3/search`;

// DEPOIS
const endpoint = `/rest/api/3/search/jql`;
```

**Função `_searchJqlWithPagination()` (linha ~597)**
```javascript
// ANTES
const endpoint = `/rest/api/3/search`;

// DEPOIS
const endpoint = `/rest/api/3/search/jql`;
```

**Função `getITOpsTeamOptions()` (linha ~2000)**
```javascript
// ANTES - GET com query string
const testEndpoint = `/rest/api/2/search?jql=project=IT&fields=${fieldId}&maxResults=1`;
const result = await this._makeRequest(testEndpoint);

// DEPOIS - Usar _searchJql (que já usa POST)
const jqlQuery = 'project=IT';
const fieldsArray = [fieldId];
const result = await this._searchJql(jqlQuery, fieldsArray);
```

**Função `getITOpsTeamOptions()` fallback (linha ~2049)**
```javascript
// ANTES - GET com query string
const searchEndpoint = `/rest/api/2/search?jql=project=IT&fields=${itopsTeamFieldId}&maxResults=500`;
const searchResult = await this._makeRequest(searchEndpoint);

// DEPOIS - Usar _searchJql (que já usa POST)
const jqlQuery = 'project=IT';
const fieldsArray = [itopsTeamFieldId];
const searchResult = await this._searchJql(jqlQuery, fieldsArray);
```

### 2. Documentação Atualizada

- ✅ `ESTRUTURA.md` - Endpoint atualizado
- ✅ `DOCUMENTACAO-COMPLETA.md` - Referências atualizadas (3 locais)
- ✅ `TROUBLESHOOTING.md` - Exemplo de teste atualizado

## 📝 Detalhes Técnicos

### Formato da Requisição (Nova API)

**Método**: `POST` (obrigatório)

**Endpoint**: `/rest/api/3/search/jql`

**Headers**:
```http
Authorization: Basic <base64(email:apiToken)>
Content-Type: application/json
Accept: application/json
```

**Body** (JSON):
```json
{
  "jql": "assignee = currentUser() AND status = 'In Progress'",
  "fields": ["status", "summary", "key", "updated"],
  "maxResults": 1000,
  "startAt": 0
}
```

**Resposta**:
```json
{
  "issues": [...],
  "startAt": 0,
  "maxResults": 1000,
  "total": 42
}
```

### Diferenças entre API v2 e v3/jql

| Aspecto | API v2/v3 Antiga | API v3/jql Nova |
|---------|------------------|-----------------|
| **Endpoint** | `/rest/api/2/search` ou `/rest/api/3/search` | `/rest/api/3/search/jql` |
| **Método HTTP** | GET ou POST | **POST apenas** |
| **Query JQL** | Query string (`?jql=...`) ou body | **Body JSON apenas** |
| **Status** | ❌ Removido (410 Gone) | ✅ Ativo e obrigatório |

## ✅ Validação

### Teste Manual

Para testar se a migração funcionou:

```bash
# 1. Reiniciar a aplicação
npm start

# 2. Verificar logs no console
# Deve aparecer:
# 🔥🔥🔥 JIRA-SERVICE.JS CARREGADO - VERSÃO API v3 /search/jql v7.0 🔥🔥🔥
# 🔍 _searchJql usando POST /rest/api/3/search/jql (novo endpoint)

# 3. Observar que os dados carregam sem erro 410
```

### Teste via cURL

```bash
curl -X POST 'https://nubank.atlassian.net/rest/api/3/search/jql' \
  -H 'Authorization: Basic <base64_credentials>' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "jql": "assignee = currentUser()",
    "fields": ["status", "summary", "key"],
    "maxResults": 5
  }'
```

## 🚀 Impacto

### O que continua funcionando:
- ✅ Todas as buscas de tickets (fetchStats, fetchMentions, etc.)
- ✅ Dashboard de performance
- ✅ Métricas e estatísticas
- ✅ Alertas e notificações
- ✅ Busca de tickets avaliados
- ✅ Tickets de SIM cards
- ✅ Todas as funcionalidades do Modo Pro

### Mudanças para o usuário:
- **Nenhuma!** A mudança é apenas interna (backend).
- A interface permanece idêntica.
- Todas as funcionalidades continuam operando normalmente.

## 📚 Referências

- [Atlassian Developer Changelog - CHANGE-2046](https://developer.atlassian.com/changelog/#CHANGE-2046)
- [Jira REST API v3 - Search for issues using JQL](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-jql-post)

## 📅 Histórico

- **Data**: Janeiro 2026
- **Versão**: v7.0
- **Autor**: Sistema de Monitoramento Jira Monitor
- **Status**: ✅ Implementado e testado

---

**Nota**: Esta é uma mudança **obrigatória** imposta pela Atlassian. O endpoint antigo foi **permanentemente removido** e não há opção de continuar usando a API antiga.


