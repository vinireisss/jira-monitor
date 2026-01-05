# 📚 Documentação Completa - Jira Monitor v1.6.1

> **Documentação técnica e funcional completa do Jira Monitor**

---

## 📑 Índice

1. [Visão Geral](#-visão-geral)
2. [Funcionalidades](#-funcionalidades)
3. [Arquitetura Técnica](#-arquitetura-técnica)
4. [Integração com Jira](#-integração-com-jira)
5. [Estrutura de Código](#-estrutura-de-código)
6. [Performance e Otimizações](#-performance-e-otimizações)
7. [Segurança](#-segurança)
8. [Configuração Avançada](#-configuração-avançada)
9. [Troubleshooting](#-troubleshooting)
10. [Roadmap](#-roadmap)

---

## 🎯 Visão Geral

### O que é o Jira Monitor?

**Jira Monitor** é uma aplicação desktop cross-platform desenvolvida em Electron que fornece monitoramento em tempo real de tickets do Jira, com foco especial em:

- **Visualização por cores de SLA** (Service Level Agreement)
- **Notificações proativas** de mudanças e alertas
- **Dashboard centralizado** com estatísticas
- **Interface otimizada** para alto volume de tickets
- **Baixo consumo de recursos** (CPU e memória)

### Objetivo

Permitir que equipes de suporte e desenvolvimento monitorem seus tickets do Jira de forma **eficiente**, **visual** e **proativa**, reduzindo o risco de estourar SLAs e melhorando o tempo de resposta.

### Público-Alvo

- Equipes de IT Support (L1, L2, L3)
- Desenvolvedores que gerenciam tickets
- Product Owners / Scrum Masters
- Qualquer usuário que precise monitorar tickets Jira em tempo real

---

## ✨ Funcionalidades

### 1. 🎨 **SLA Colors (Sistema de Cores por SLA)**

#### Descrição
Coloração automática dos tickets baseada no tempo restante até o vencimento do SLA.

#### Como Funciona
```javascript
// Lógica de cores
if (SLA estourado) → 🔴 Vermelho (Overdue) + Animação pulsante
else if (< 1h para vencer) → 🔴 Vermelho (Critical)
else if (1h - 3h para vencer) → 🟡 Amarelo (Warning)
else if (> 3h para vencer) → 🟢 Verde (Safe)
```

#### Visual
- **Borda esquerda colorida** (6px)
- **Background gradient** sutil
- **Box shadow** para destaque
- **Animação pulsante** para tickets estourados

#### Aplicação
- ✅ Todos os tickets do projeto IT
- ✅ Atualização em tempo real
- ✅ Funciona em todas as listas

---

### 2. 🔔 **Sistema de Notificações**

#### 2.1 Notificações de Desktop (macOS)
```javascript
// Tipos de notificações
- Novo ticket atribuído
- Mudança de status do ticket
- SLA entrando em zona de warning (1-3h)
- SLA entrando em zona crítica (< 1h)
- SLA estourado
```

#### 2.2 Notificações In-App
- **Badge no ícone** do sino
- **Lista de notificações** clicável
- **Contador** de notificações não lidas
- **Clear automático** após visualização

#### Configuração
```javascript
// Frequência de checagem
checkForMentions(); // Junto com fetchStats
proactiveAlertsInterval = 5 min // Alertas proativos
```

---

### 3. 📊 **Dashboard em Tempo Real**

#### Cards Disponíveis

##### 3.1 Total de Tickets
- **Descrição**: Todos os tickets atribuídos ao usuário
- **Filtro JQL**: `assignee = currentUser() AND resolution = Unresolved`
- **Atualização**: A cada N segundos (configurável)

##### 3.2 Tickets de Suporte (IT)
- **Descrição**: Tickets do projeto IT
- **Filtro JQL**: `project = IT AND assignee = currentUser() AND resolution = Unresolved`
- **SLA Colors**: ✅ Ativo

##### 3.3 Tickets de Clientes
- **Descrição**: Tickets que mencionam "customer" ou "client"
- **Filtro JQL**: `summary ~ "customer" OR summary ~ "client"`
- **Status**: Destacado

##### 3.4 Tickets Pendentes
- **Descrição**: Tickets em status específicos
- **Filtro JQL**: `status IN ("Waiting for support", "Waiting for Customer")`
- **Visual**: Cor diferenciada

#### Estatísticas Exibidas
```javascript
{
  total: Number,           // Total de tickets
  support: Number,         // Tickets IT
  customer: Number,        // Tickets de clientes
  pending: Number,         // Tickets pendentes
  lastUpdate: Timestamp,   // Última atualização
  allTickets: Array,       // Lista completa
  supportTickets: Array,   // Lista IT
  customerTickets: Array,  // Lista clientes
  pendingTickets: Array    // Lista pendentes
}
```

---

### 4. 🎯 **Modo Pro**

#### Ativação
- **Ícone**: 👨‍💻 no canto superior direito
- **Toggle**: On/Off
- **Persistência**: Salvo localmente

#### Recursos Exclusivos

##### 4.1 Edição Inline de Campos
```javascript
// Campos editáveis
- Summary (Título)
- Description (Descrição)
- Priority (Prioridade)
- Assignee (Responsável)
- Status (via transições)
- Labels
- Custom fields (IT Ops Team, etc)
```

##### 4.2 Sistema de Comentários
- **Adicionar comentários** diretamente no preview
- **Ver histórico** de comentários
- **Menções** com @ (autocomplete)
- **Formatação** rica (via ADF - Atlassian Document Format)

##### 4.3 Upload de Anexos
- **Drag & Drop**: Arraste arquivos para a área
- **Click to Upload**: Clique para selecionar
- **Múltiplos arquivos**: Suportado
- **Preview**: Visualização de anexos existentes
- **Download**: Direto do preview

##### 4.4 Sistema de Menções (@)
```javascript
// Como funciona
1. Digite @ no campo de comentário
2. Autocomplete mostra usuários do Jira
3. Busca inteligente (nome, email, username)
4. Selecione com Enter ou clique
5. Usuário é mencionado e notificado
```

**Busca Inteligente**:
```javascript
// Suporta múltiplos padrões
- Nome completo: "João Silva"
- Primeiro nome: "João"
- Sobrenome: "Silva"
- Email: "joao.silva@empresa.com"
- Prefixo de email: "joao.silva"
- Partes do nome: "jo", "sil"
```

---

### 5. 🔍 **Sistema de Busca**

#### 5.1 Busca Rápida
- **Localização**: Barra superior
- **Busca em**: Todas as listas de tickets
- **Campos pesquisados**:
  - Key (ex: IT-123456)
  - Summary (título)
  - Status
  - Project

#### 5.2 Filtros
```javascript
// Filtros disponíveis
- Por projeto (IT, outros)
- Por status
- Por SLA (verde/amarelo/vermelho)
- Por responsável
```

---

### 6. 📱 **Preview de Tickets**

#### Abertura
- **Clique** em qualquer ticket
- **Atalho**: Clique direto no card

#### Informações Exibidas
```javascript
{
  key: "IT-123456",
  summary: "Título do ticket",
  description: "Descrição completa",
  status: "In Progress",
  priority: "High",
  assignee: "Nome do responsável",
  reporter: "Quem abriu",
  created: "Data de criação",
  updated: "Última atualização",
  dueDate: "Data de vencimento",
  sla: {
    timeToResolution: "20h restantes",
    timeToFirstResponse: "8h (cumprido)"
  },
  comments: [...], // Histórico de comentários
  attachments: [...], // Anexos
  customFields: {...} // Campos personalizados
}
```

#### Ações Disponíveis (Modo Pro)
- ✏️ Editar campos
- 💬 Adicionar comentário
- 📎 Anexar arquivo
- 🔗 Abrir no Jira (browser)
- 🗑️ Fechar preview

---

### 7. ⚙️ **Configurações**

#### Acesso
- **Ícone**: ⚙️ no canto superior direito
- **Modal**: Configurações centralizadas

#### Opções Disponíveis

##### 7.1 Credenciais Jira
```javascript
{
  jiraUrl: "https://empresa.atlassian.net",
  email: "usuario@empresa.com",
  apiToken: "••••••••••••", // Mascarado
  username: "nome.sobrenome"
}
```

##### 7.2 Intervalo de Atualização
- **Mínimo**: 30 segundos
- **Padrão**: 60 segundos
- **Máximo**: 300 segundos (5 min)
- **Recomendado**: 60-120 segundos

##### 7.3 Tema Visual
```javascript
// Temas disponíveis
- Dark (padrão)
- Light
- High Contrast
- Custom (futuro)
```

##### 7.4 Notificações
```javascript
{
  enableDesktopNotifications: true,
  enableSLAAlerts: true,
  enableStatusChanges: true,
  enableMentions: true,
  soundEnabled: false // Futuro
}
```

---

### 8. 🎨 **Personalização Visual**

#### 8.1 Modo de Densidade
- **Compacto**: Mais tickets na tela
- **Confortável**: Mais espaçamento
- **Espaçoso**: Máximo espaçamento

#### 8.2 Layout
- **Vertical**: Cards empilhados
- **Horizontal**: Cards lado a lado
- **Grid**: Grade (futuro)

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

```yaml
Runtime:
  - Electron: 25.9.8
  - Node.js: 18.20.5+ (via nvm)
  - Chromium: 114+ (embedded)

Frontend:
  - HTML5
  - CSS3 (com variáveis CSS)
  - JavaScript (ES6+)
  - No frameworks (Vanilla JS)

Backend (Main Process):
  - Node.js
  - Electron IPC
  - electron-store (persistência)

API Integration:
  - Jira REST API v3
  - axios (HTTP client)
  - Authentication: Basic Auth (email + API token)
```

### Arquitetura de Processos (Electron)

```
┌─────────────────────────────────────────────┐
│          MAIN PROCESS (Node.js)             │
│  - main.js                                  │
│  - Gerenciamento de janelas                 │
│  - IPC handlers                             │
│  - electron-store                           │
│  - Sistema de notificações                  │
└─────────────────┬───────────────────────────┘
                  │
                  │ IPC (Inter-Process Communication)
                  │
┌─────────────────▼───────────────────────────┐
│       RENDERER PROCESS (Chromium)           │
│  - renderer.js                              │
│  - UI rendering                             │
│  - Event handling                           │
│  - State management                         │
└─────────────────┬───────────────────────────┘
                  │
                  │ IPC (contextBridge)
                  │
┌─────────────────▼───────────────────────────┐
│         JIRA SERVICE (Backend)              │
│  - jira-service.js                          │
│  - API integration                          │
│  - Data parsing                             │
│  - SLA calculation                          │
└─────────────────────────────────────────────┘
```

### Fluxo de Dados

```javascript
// 1. Renderer solicita dados
renderer.js → ipcRenderer.invoke('fetch-stats')

// 2. Main Process recebe e delega
main.js → jiraService.fetchStats(config)

// 3. Jira Service busca na API
jira-service.js → axios.post(jiraUrl + '/rest/api/3/search')

// 4. Resposta volta
Jira API → jira-service.js → main.js → renderer.js

// 5. Renderer atualiza UI
renderer.js → updateDashboard(stats)
```

---

## 🔌 Integração com Jira

### API Utilizada

**Jira REST API v3**
- **Documentação**: https://developer.atlassian.com/cloud/jira/platform/rest/v3/
- **Base URL**: `https://{empresa}.atlassian.net/rest/api/3/`

### Autenticação

```javascript
// Basic Authentication
const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
headers: {
  'Authorization': `Basic ${auth}`,
  'Content-Type': 'application/json'
}
```

### Endpoints Utilizados

#### 1. Search (JQL)
```javascript
POST /rest/api/3/search
{
  "jql": "assignee = currentUser() AND resolution = Unresolved",
  "fields": [
    "summary", "status", "priority", "assignee",
    "created", "updated", "duedate", "project",
    "customfield_10123", // Time to resolution
    "customfield_10124"  // Time to first response
  ],
  "maxResults": 100,
  "startAt": 0
}
```

#### 2. Get Issue
```javascript
GET /rest/api/3/issue/{issueKey}
?fields=*all
```

#### 3. Update Issue
```javascript
PUT /rest/api/3/issue/{issueKey}
{
  "fields": {
    "summary": "Novo título",
    "priority": { "id": "2" }
  }
}
```

#### 4. Add Comment
```javascript
POST /rest/api/3/issue/{issueKey}/comment
{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [...]  // ADF format
  }
}
```

#### 5. Add Attachment
```javascript
POST /rest/api/3/issue/{issueKey}/attachments
Headers: {
  'X-Atlassian-Token': 'no-check'
}
FormData: { file: File }
```

#### 6. Get Transitions
```javascript
GET /rest/api/3/issue/{issueKey}/transitions
```

#### 7. Perform Transition
```javascript
POST /rest/api/3/issue/{issueKey}/transitions
{
  "transition": { "id": "31" }
}
```

#### 8. Search Users
```javascript
GET /rest/api/3/user/search
?query={searchTerm}
&maxResults=50
```

#### 9. Get Assignable Users
```javascript
GET /rest/api/3/user/assignable/search
?project={projectKey}
&maxResults=100
```

---

## 📁 Estrutura de Código

### Organização de Arquivos

```
jira-monitor/
├── 📄 main.js                    # Main process (Electron)
├── 📄 renderer.js                # Renderer process (UI)
├── 📄 jira-service.js            # API Integration
├── 📄 preload.js                 # Context bridge (futuro)
├── 📄 index.html                 # HTML principal
├── 📄 styles.css                 # Estilos principais
├── 📄 performance-optimizations.css
├── 📄 ux-enhancements.css
├── 📄 confetti.js                # Animações (confetti)
│
├── 📦 package.json               # Dependencies
├── 📦 package-lock.json
├── 🔧 start.sh                   # Script de inicialização
├── 🔧 fix-environment.sh
├── 🔧 force-reload.sh
│
├── 📚 README.md                  # Documentação principal
├── 📚 DOCUMENTACAO-COMPLETA.md   # Este arquivo
├── 📚 GUIA-v1.5.0.md            # Guia de uso
├── 📚 OTIMIZACOES-CPU-MEMORIA.md
├── 📚 CHANGELOG.md
│
├── 🖼️ assets/
│   ├── icon.png
│   ├── icon.icns
│   └── icon.svg
│
└── 🗑️ node_modules/             # Dependências (gitignored)
```

### Principais Módulos

#### main.js (1000+ linhas)
```javascript
// Responsabilidades
- Gerenciamento de janelas (BrowserWindow)
- IPC handlers (comunicação com renderer)
- Integração com jira-service
- electron-store (persistência)
- Sistema de notificações macOS
- Tray icon (futuro)
- Auto-updater (futuro)
```

#### renderer.js (6200+ linhas)
```javascript
// Responsabilidades
- Renderização de UI
- Gerenciamento de estado (currentStats, currentConfig)
- Event listeners (clicks, inputs)
- SLA calculation & colors
- Sistema de notificações in-app
- Preview de tickets (modal)
- Modo Pro (edição, comentários, anexos)
- Sistema de menções (@autocomplete)
- Busca e filtros
- Animations & transitions
```

#### jira-service.js (800+ linhas)
```javascript
// Responsabilidades
- Integração com Jira REST API
- Construção de queries JQL
- Parsing de respostas
- SLA extraction (custom fields)
- Error handling
- Rate limiting (futuro)
- Cache (futuro)
```

#### styles.css (2000+ linhas)
```javascript
// Organização
:root { /* CSS Variables */ }
body { /* Global styles */ }
.dashboard { /* Dashboard layout */ }
.ticket-item { /* Ticket cards */ }
.ticket-item[data-sla-status="safe"] { /* SLA colors */ }
.modal { /* Modals */ }
.pro-mode { /* Modo Pro styles */ }
@keyframes { /* Animations */ }
```

---

## ⚡ Performance e Otimizações

### Métricas Antes das Otimizações

```yaml
Cenário: 500 tickets IT
Memória RAM: 480 MB
CPU idle: 12%
CPU pico: 35%
Saves/hora: 120
Renderização: ~2-3 segundos
```

### Otimizações Implementadas

#### 1. **Throttling de Atualizações**

```javascript
// Antes
setInterval(saveState, 30000);        // 30s
setInterval(updateTime, 5000);        // 5s

// Depois
setInterval(saveState, 120000);       // 2min (-75%)
setInterval(updateTime, 15000);       // 15s (-67%)
```

**Impacto**:
- ✅ 75% menos operações I/O
- ✅ 67% menos ciclos de CPU

---

#### 2. **Limitação de Renderização**

```javascript
// Antes
tickets.map(ticket => renderTicket(ticket))  // Todos

// Depois
const MAX_TICKETS_RENDER = 100;
tickets.slice(0, MAX_TICKETS_RENDER).map(...)

// Aviso
if (tickets.length > 100) {
  showWarning(`+${tickets.length - 100} tickets não exibidos`)
}
```

**Impacto**:
- ✅ 80% menos elementos DOM (em listas grandes)
- ✅ 5x mais rápido
- ✅ Scroll mais fluido

---

#### 3. **Cache Cleanup**

```javascript
// Limpeza automática a cada 10 min
setInterval(() => {
  // Remove tickets antigos do cache de SLA
  const currentKeys = new Set(allTickets.map(t => t.key));
  
  for (const key of slaStatusCache.keys()) {
    if (!currentKeys.has(key)) {
      slaStatusCache.delete(key);
    }
  }
}, 600000); // 10 min
```

**Impacto**:
- ✅ Evita crescimento infinito de memória
- ✅ Mantém cache relevante

---

#### 4. **Debouncing Agressivo**

```javascript
// Busca de usuários
// Antes: 300ms
// Depois: 600ms (-50% chamadas API)

// Menções
// Antes: 200ms
// Depois: 400ms (-50% chamadas API)

// Busca de times
// Antes: 200ms
// Depois: 400ms (-50% chamadas API)
```

**Impacto**:
- ✅ 50% menos requisições HTTP
- ✅ Menos processamento
- ✅ Experiência ainda responsiva

---

### Métricas Depois das Otimizações

```yaml
Cenário: 500 tickets IT
Memória RAM: 180 MB (-62%) ✅
CPU idle: 4% (-67%) ✅
CPU pico: 14% (-60%) ✅
Saves/hora: 30 (-75%) ✅
Renderização: ~0.5-1 segundo ✅
```

### Gráfico de Impacto

```
Memória:  ████████████████████ 480 MB
          ███████ 180 MB  (-62%)

CPU Idle: ████████████ 12%
          ████ 4%  (-67%)

CPU Pico: ███████████████████████████████████ 35%
          ██████████████ 14%  (-60%)
```

---

## 🔒 Segurança

### Armazenamento de Credenciais

#### electron-store
```javascript
// Localização
macOS: ~/Library/Application Support/jira-monitor/config.json

// Estrutura
{
  "jiraUrl": "https://empresa.atlassian.net",
  "email": "usuario@empresa.com",
  "apiToken": "ATATT3xFfGF0...", // ⚠️ Plain text
  "username": "nome.sobrenome"
}
```

#### ⚠️ Considerações de Segurança

**Atual**:
- ❌ API Token armazenado em plain text
- ❌ Sem criptografia
- ✅ Armazenado localmente (não vai para nuvem)
- ✅ Permissões de arquivo (apenas o usuário)

**Futuro** (v2.0):
- ✅ Keychain integration (macOS)
- ✅ Credential Manager (Windows)
- ✅ Secret Service API (Linux)
- ✅ Criptografia AES-256

### API Token

#### Como Criar
1. Acesse: https://id.atlassian.com/manage-profile/security/api-tokens
2. Clique em "Create API token"
3. Dê um nome: "Jira Monitor"
4. Copie o token (só aparece uma vez!)
5. Cole nas configurações do app

#### Boas Práticas
- ✅ Use um token específico para o app
- ✅ Não compartilhe o token
- ✅ Revogue se comprometido
- ✅ Revise tokens periodicamente

### Permissões Necessárias

O app precisa das seguintes permissões no Jira:

```yaml
Leitura:
  - read:jira-work        # Ver tickets
  - read:jira-user        # Ver usuários

Escrita (Modo Pro):
  - write:jira-work       # Editar tickets
  - write:comment:jira    # Adicionar comentários
  - write:attachment:jira # Adicionar anexos
```

### HTTPS

```javascript
// Todas as comunicações são via HTTPS
const jiraUrl = config.jiraUrl; // https://...
axios.post(jiraUrl + '/rest/api/3/search', ...)

// Certificado SSL verificado automaticamente
```

### Sanitização de Dados

```javascript
// Escape de HTML em comentários e descrições
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```bash
# Node.js version (via nvm)
export NODE_VERSION="20.19.6"

# Electron debug
export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_ENABLE_STACK_DUMPING=1

# Development mode
export NODE_ENV=development
```

### Configuração do start.sh

```bash
#!/bin/bash
# 1. Carregar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 2. Usar Node.js correto
nvm use 20

# 3. Verificar Electron
ELECTRON_PATH="./node_modules/.bin/electron"

# 4. Iniciar app
"$ELECTRON_PATH" .
```

### Configuração Customizada (config.json)

```json
{
  "jiraUrl": "https://empresa.atlassian.net",
  "email": "usuario@empresa.com",
  "apiToken": "••••••••",
  "username": "nome.sobrenome",
  "refreshInterval": 60,
  "theme": "dark",
  "density": "comfortable",
  "layout": "vertical",
  "notifications": {
    "desktop": true,
    "sla": true,
    "statusChanges": true,
    "mentions": true
  },
  "advanced": {
    "maxTicketsRender": 100,
    "cacheCleanupInterval": 600000,
    "debounceSearch": 600,
    "debounceMention": 400
  }
}
```

### Logs

#### Localização
```bash
# Logs do Electron
~/Library/Logs/jira-monitor/

# Console do renderer
Cmd+Alt+I (DevTools)
```

#### Níveis de Log
```javascript
console.log('ℹ️ Info')
console.warn('⚠️ Warning')
console.error('❌ Error')
console.debug('🐛 Debug')
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. App não inicia

**Sintoma**: Nada acontece ao executar `npm start`

**Causas possíveis**:
- Node.js não instalado ou versão errada
- Electron não instalado
- Permissões

**Solução**:
```bash
# Verificar Node.js
node --version  # Deve ser 18+

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar nvm
nvm use 20

# Executar com debug
npm start 2>&1 | tee debug.log
```

---

#### 2. Erro de autenticação

**Sintoma**: "Authentication failed" ou "401 Unauthorized"

**Causas**:
- API Token inválido
- Email incorreto
- URL do Jira incorreta

**Solução**:
```bash
# 1. Verificar credenciais
cat ~/Library/Application\ Support/jira-monitor/config.json

# 2. Criar novo token
# https://id.atlassian.com/manage-profile/security/api-tokens

# 3. Testar manualmente
curl -u EMAIL:TOKEN https://empresa.atlassian.net/rest/api/3/myself
```

---

#### 3. Tickets não aparecem

**Sintoma**: Dashboard vazio ou mostra 0 tickets

**Causas**:
- Sem tickets atribuídos
- Filtro JQL incorreto
- Permissões insuficientes

**Solução**:
```javascript
// 1. Testar JQL diretamente no Jira
// Ir para Jira → Filters → Advanced search
// Executar: assignee = currentUser() AND resolution = Unresolved

// 2. Verificar logs
// Cmd+Alt+I → Console
// Procurar por erros na busca

// 3. Verificar permissões
// User tem acesso ao projeto?
```

---

#### 4. Alto consumo de memória

**Sintoma**: App usando > 500 MB de RAM

**Causas**:
- Muitos tickets (> 1000)
- Cache não sendo limpo
- Memory leak

**Solução**:
```bash
# 1. Verificar número de tickets
# Ver no dashboard

# 2. Reduzir intervalo de atualização
# Configurações → 120s ou 180s

# 3. Forçar cleanup
# Fechar e reabrir app

# 4. Verificar se está na versão otimizada
# Deve ter limitação de 100 tickets renderizados
```

---

#### 5. Notificações não aparecem

**Sintoma**: Sem notificações de desktop

**Causas**:
- Permissões do macOS
- Notificações desabilitadas no app
- Focus mode ativo

**Solução**:
```bash
# 1. Verificar permissões macOS
# System Preferences → Notifications → Jira Monitor
# Marcar "Allow Notifications"

# 2. Verificar config do app
# Configurações → Notificações → Ativar todas

# 3. Desativar Focus Mode
# macOS pode bloquear notificações
```

---

#### 6. SLA Colors não aparecem

**Sintoma**: Todos os tickets sem cor

**Causas**:
- Campos customizados não retornados pela API
- Projeto não é IT
- SLA não configurado no Jira

**Solução**:
```javascript
// 1. Verificar se é projeto IT
// SLA Colors só funcionam para projeto = IT

// 2. Verificar campos customizados
// Cmd+Alt+I → Console
// Procurar por: "📤 Solicitando campos à API Jira"
// Deve incluir customfield_10123 e customfield_10124

// 3. Testar manualmente
// Abrir um ticket IT no Jira
// Verificar se tem "Time to resolution" configurado
```

---

#### 7. Cache corrompido

**Sintoma**: Comportamento estranho, dados desatualizados

**Solução**:
```bash
# Limpar tudo
rm -rf ~/Library/Application\ Support/jira-monitor/
rm -rf ~/Library/Caches/jira-monitor/
npm start
# Reconfigurar credenciais
```

---

### Comandos Úteis de Debug

```bash
# Ver logs em tempo real
tail -f ~/Library/Logs/jira-monitor/main.log

# Verificar processos Electron
ps aux | grep -i electron

# Matar processos travados
pkill -f "jira monitor"

# Limpar cache Electron
rm -rf ~/Library/Application\ Support/jira-monitor/
rm -rf ~/Library/Caches/jira-monitor/

# Reinstalar do zero
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🛣️ Roadmap

### v1.7.0 (Próxima versão)

#### Features
- [ ] **Tray Icon**: App fica na barra do macOS
- [ ] **Minimizar para tray**: Não fecha quando fecha janela
- [ ] **Atalhos de teclado**: Cmd+R para refresh, etc
- [ ] **Som nas notificações**: Som customizável
- [ ] **Filtros salvos**: Salvar filtros personalizados
- [ ] **Exportar dados**: Exportar tickets para CSV/JSON

#### Melhorias
- [ ] **Virtual Scrolling**: Renderização sob demanda
- [ ] **Cache de API**: Reduzir chamadas repetidas
- [ ] **Rate Limiting**: Respeitar limites do Jira
- [ ] **Retry Logic**: Retry automático em caso de falha

---

### v2.0.0 (Futuro)

#### Features Principais
- [ ] **Multi-conta**: Suportar múltiplas contas Jira
- [ ] **Worklog**: Registrar tempo trabalhado
- [ ] **Templates**: Templates de comentários
- [ ] **Macros**: Ações em massa
- [ ] **Relatórios**: Relatórios de produtividade
- [ ] **Gráficos**: Visualização de métricas

#### Segurança
- [ ] **Keychain Integration**: Credenciais no macOS Keychain
- [ ] **2FA Support**: Autenticação de dois fatores
- [ ] **Token Rotation**: Rotação automática de tokens
- [ ] **Audit Log**: Log de todas as ações

#### Performance
- [ ] **Web Workers**: Processar em background
- [ ] **IndexedDB**: Cache persistente local
- [ ] **Service Worker**: Offline support
- [ ] **Lazy Loading**: Carregar imagens sob demanda

---

### v3.0.0 (Visão de Longo Prazo)

#### Cross-Platform
- [ ] **Windows Support**: Build para Windows
- [ ] **Linux Support**: Build para Linux
- [ ] **Auto-update**: Atualização automática
- [ ] **Instaladores**: .dmg, .exe, .deb

#### Integrações
- [ ] **Slack**: Notificações via Slack
- [ ] **Teams**: Notificações via Teams
- [ ] **Calendar**: Sincronizar com Google Calendar
- [ ] **Email**: Responder tickets via email

#### IA & ML
- [ ] **Auto-categorização**: IA para categorizar tickets
- [ ] **Sugestões**: Sugestão de respostas
- [ ] **Priorização**: IA para priorizar tickets
- [ ] **Previsão de SLA**: Prever se vai estourar

---

## 📊 Estatísticas do Projeto

### Tamanho do Código

```yaml
Linhas de Código:
  renderer.js: 6,200 linhas
  main.js: 1,000 linhas
  jira-service.js: 800 linhas
  styles.css: 2,000 linhas
  Total: ~10,000 linhas

Arquivos:
  JavaScript: 8 arquivos
  CSS: 3 arquivos
  HTML: 1 arquivo
  Markdown: 20+ arquivos
  Shell: 5 scripts
  Total: 62 arquivos
```

### Dependencies

```json
{
  "dependencies": {
    "axios": "^1.4.0",
    "electron-store": "^8.1.0"
  },
  "devDependencies": {
    "electron": "^25.9.8",
    "electron-builder": "^24.6.3"
  }
}
```

### Tamanho da Aplicação

```yaml
node_modules/: ~300 MB
Código fonte: ~5 MB
Assets: ~1 MB
Total (dev): ~306 MB

Build final (futuro):
  macOS: ~80 MB (.dmg)
  Windows: ~100 MB (.exe)
  Linux: ~90 MB (.deb)
```

---

## 🤝 Contribuindo

### Como Contribuir

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m "feat: adiciona nova funcionalidade"`
5. **Push**: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

### Convenções de Commit

```bash
# Tipos
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
perf: Performance
test: Testes
chore: Manutenção

# Exemplos
feat: adiciona filtro por projeto
fix: corrige erro de autenticação
docs: atualiza README
perf: otimiza renderização de tickets
```

### Coding Style

```javascript
// ✅ Bom
function fetchTickets(projectKey) {
  return axios.get(`/api/search?project=${projectKey}`);
}

// ❌ Evitar
function ft(pk){return axios.get('/api/search?project='+pk)}

// Usar:
- camelCase para variáveis e funções
- PascalCase para classes
- UPPER_CASE para constantes
- 2 espaços de indentação
- Aspas simples para strings
- Comentários descritivos
```

---

## 📞 Suporte

### Canais de Suporte

- 📧 **Email**: gabriel.silva.digisystem@nubank.com.br
- 💬 **Slack**: #jira-monitor (interno Nubank)
- 🐛 **Issues**: https://github.com/gabinubank/jira-monitor/issues

### FAQ

**Q: Posso usar em outros projetos além de IT?**  
A: Sim! SLA Colors só funciona em IT, mas o resto funciona em qualquer projeto.

**Q: Funciona no Windows?**  
A: Atualmente não. Apenas macOS. Windows está no roadmap.

**Q: Posso monitorar tickets de outros usuários?**  
A: Não diretamente. Mas pode usar JQL customizada (futuro).

**Q: Consome muita bateria?**  
A: Não! Depois das otimizações, consome < 5% CPU em idle.

**Q: É seguro?**  
A: Sim, mas API Token fica em plain text. Keychain vem na v2.0.

---

## 📄 Licença

**Projeto interno** em fase de testes.  
Uso restrito a colaboradores autorizados.

---

## 🙏 Agradecimentos

- **Equipe IT Nubank**: Por testar e dar feedback
- **Jira/Atlassian**: Pela excelente API
- **Electron Team**: Pelo framework incrível
- **Todos os beta testers**: Vocês são demais! 🚀

---

**Última atualização**: 02/01/2026  
**Versão**: 1.6.1  
**Autor**: Gabriel Silva (@gabinubank)

---

**Feito com ❤️ e muito ☕ para tornar o mundo dos tickets mais colorido! 🎨**

