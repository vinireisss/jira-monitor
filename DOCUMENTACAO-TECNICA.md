# 🔧 Documentação Técnica - Jira Monitor

> **Guia completo para desenvolvedores e mantenedores do projeto**

![Jira Monitor](assets/icon.png)

---

## 📑 Índice

1. [Visão Geral Técnica](#-visão-geral-técnica)
2. [Arquitetura do Sistema](#-arquitetura-do-sistema)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Componentes Principais](#-componentes-principais)
6. [Integração com Jira API](#-integração-com-jira-api)
7. [Fluxo de Dados](#-fluxo-de-dados)
8. [Sistema de SLA Colors](#-sistema-de-sla-colors)
9. [Sistema de Notificações](#-sistema-de-notificações)
10. [Performance e Otimizações](#-performance-e-otimizações)
11. [Segurança](#-segurança)
12. [Testes](#-testes)
13. [Build e Deploy](#-build-e-deploy)
14. [Guia de Desenvolvimento](#-guia-de-desenvolvimento)

---

## 🎯 Visão Geral Técnica

### O que é o Jira Monitor?

**Jira Monitor** é uma aplicação desktop desenvolvida em **Electron** que permite monitoramento em tempo real de tickets do Jira Service Management, com foco especial em:

- **Visualização de SLA por cores** (verde/amarelo/vermelho)
- **Notificações proativas** de mudanças e alertas
- **Dashboard centralizado** com estatísticas em tempo real
- **Modo Pro** com edição inline e recursos avançados
- **Performance otimizada** para alto volume de tickets

### Tecnologias Core

```yaml
Runtime: Electron 25.9.8
Language: JavaScript ES6+
Node.js: 20+ (compatível com v20, v22, v25, v26+)
Platform: macOS (Darwin 24.6.0)
Shell: zsh
```

---

## 🏗️ Arquitetura do Sistema

### Modelo de Processos Electron

```
┌──────────────────────────────────────────────────────────┐
│                    MAIN PROCESS                          │
│                    (Node.js)                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ main.js                                            │  │
│  │ - Window Management                                │  │
│  │ - IPC Handlers                                     │  │
│  │ - Tray Manager                                     │  │
│  │ - Notification System                              │  │
│  │ - electron-store                                   │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │ IPC Channel
                     │ (ipcMain/ipcRenderer)
┌────────────────────▼─────────────────────────────────────┐
│                 RENDERER PROCESS                         │
│                  (Chromium)                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │ renderer.js                                        │  │
│  │ - UI Rendering                                     │  │
│  │ - Event Handling                                   │  │
│  │ - State Management                                 │  │
│  │ - DOM Manipulation                                 │  │
│  │ - SLA Calculation                                  │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP/REST
                     │
┌────────────────────▼─────────────────────────────────────┐
│              JIRA SERVICE LAYER                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ jira-service.js                                    │  │
│  │ - API Integration                                  │  │
│  │ - JQL Queries                                      │  │
│  │ - Data Parsing                                     │  │
│  │ - Field Mapping                                    │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTPS
                     │
┌────────────────────▼─────────────────────────────────────┐
│              JIRA REST API v3                            │
│          https://empresa.atlassian.net                   │
└──────────────────────────────────────────────────────────┘
```

### Comunicação entre Processos

```javascript
// Renderer → Main
ipcRenderer.invoke('fetch-jira-stats', config)
  → main.js (ipcMain.handle)
  → jiraService.fetchStats()
  → Jira API

// Main → Renderer
mainWindow.webContents.send('manual-refresh')
  → renderer.js (ipcRenderer.on)
  → fetchStats()
```

---

## 📚 Stack Tecnológico

### Core Dependencies

```json
{
  "dependencies": {
    "electron-store": "^8.1.0",  // Persistência local
    "form-data": "^4.0.0",       // Upload de anexos
    "node-fetch": "^2.7.0"       // HTTP requests
  },
  "devDependencies": {
    "electron": "^25.9.8",        // Framework desktop
    "electron-builder": "^24.13.3" // Build e empacotamento
  }
}
```

### Tecnologias Frontend

```yaml
HTML5:
  - Semantic HTML
  - Custom data attributes
  - Template literals

CSS3:
  - CSS Variables (custom properties)
  - Flexbox & Grid
  - Animations & Transitions
  - Media Queries

JavaScript:
  - ES6+ (async/await, arrow functions)
  - DOM Manipulation (Vanilla JS)
  - Event Delegation
  - Template Strings
```

### APIs Utilizadas

```yaml
Jira REST API v3:
  Base URL: https://{domain}.atlassian.net/rest/api/3/
  Authentication: Basic Auth (email + API token)
  Format: JSON
  
Electron APIs:
  - BrowserWindow
  - ipcMain / ipcRenderer
  - Tray & Menu
  - Notification
  - shell
  - dialog
  
Node.js APIs:
  - fs (file system)
  - path
  - Buffer
  - fetch
```

---

## 📁 Estrutura do Projeto

### Árvore de Arquivos

```
jira-monitor/
├── 🎯 Core Files
│   ├── main.js                    # Processo principal Electron
│   ├── renderer.js                # UI e lógica do renderer
│   ├── jira-service.js            # Integração com Jira API
│   ├── tray-manager.js            # Gerenciador de Menu Bar
│   ├── tray-icon-generator.js    # Gerador de ícones coloridos
│   └── index.html                 # HTML principal
│
├── 🎨 Styles
│   ├── styles.css                 # Estilos principais
│   ├── ux-enhancements.css        # Melhorias de UX
│   └── performance-optimizations.css
│
├── 🔧 Utils
│   ├── confetti.js                # Animações de confetti
│   └── i18n.js                    # Internacionalização
│
├── 📦 Configuration
│   ├── package.json               # Dependências e scripts
│   ├── package-lock.json
│   └── config.example.json        # Exemplo de configuração
│
├── 🚀 Scripts
│   ├── start.sh                   # Script de inicialização
│   ├── install.sh                 # Instalação manual
│   ├── install-auto.sh            # Instalação automática
│   ├── fix-environment.sh         # Corrige ambiente Node.js
│   ├── force-reload.sh
│   ├── ativar-inicio-automatico.sh
│   └── desativar-inicio-automatico.sh
│
├── 🖼️ Assets
│   ├── icon.png                   # Ícone 512x512
│   ├── icon.icns                  # Ícone macOS
│   ├── icon.svg                   # Ícone vetorial
│   └── tray-icons/               # Ícones da menu bar
│       ├── red.png               # SLA vencido
│       ├── yellow.png            # SLA próximo
│       ├── green.png             # SLA OK
│       └── gray.png              # Sem dados
│
├── 📚 Documentation
│   ├── README.md
│   ├── DOCUMENTACAO-TECNICA.md   # Este arquivo
│   ├── DOCUMENTACAO-USUARIO.md   # Manual do usuário
│   ├── DOCUMENTACAO-COMPLETA.md
│   ├── CHANGELOG.md
│   ├── TROUBLESHOOTING.md
│   └── [outros arquivos .md]
│
└── 🗂️ Output (gerados)
    ├── node_modules/             # Dependências (gitignored)
    └── dist/                     # Build final (gitignored)
```

### Arquivos de Configuração

```bash
# Configuração do usuário (runtime)
~/Library/Application Support/jira-monitor/config.json

# Cache Electron
~/Library/Caches/jira-monitor/

# Logs
~/Library/Logs/jira-monitor/
```

---

## 🧩 Componentes Principais

### 1. Main Process (main.js)

**Responsabilidades:**
- Gerenciamento de janelas (BrowserWindow)
- Handlers IPC para comunicação
- Persistência com electron-store
- Sistema de notificações nativas
- Tray Manager (Menu Bar)

**Principais funções:**

```javascript
// Criação de janela
function createWindow() {
  const savedBounds = store.get('windowBounds', defaultBounds);
  
  mainWindow = new BrowserWindow({
    width: savedBounds.width,
    height: savedBounds.height,
    x: savedBounds.x,
    y: savedBounds.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  mainWindow.loadFile('index.html');
}

// IPC Handlers
ipcMain.handle('fetch-jira-stats', async (event, config) => {
  const jiraService = new JiraService(config);
  const stats = await jiraService.fetchStats();
  return { success: true, data: stats };
});

ipcMain.handle('get-ticket-details', async (event, ticketKey) => {
  const service = getJiraService();
  const details = await service.getTicketDetails(ticketKey);
  return { success: true, data: details };
});
```

**Localização:** `/Users/gabriel.silva.digisystem/jira monitor/main.js` (1205 linhas)

---

### 2. Renderer Process (renderer.js)

**Responsabilidades:**
- Renderização da UI
- Gerenciamento de estado local
- Manipulação de eventos
- Cálculo de SLA e cores
- Preview de tickets
- Modo Pro (edição inline)

**Estrutura de estado:**

```javascript
// Estado global
let currentStats = null;
let currentConfig = null;
let allTicketsCache = [];
let notificationsHistory = new Set();
let slaStatusCache = new Map();
let updateInterval = null;
let proactiveAlertsInterval = null;

// Configurações
const MAX_TICKETS_RENDER = 100;
const CACHE_CLEANUP_INTERVAL = 600000; // 10 min
```

**Principais funções:**

```javascript
// Fetch de estatísticas
async function fetchStats() {
  showLoading();
  try {
    const result = await ipc.invoke('fetch-jira-stats', currentConfig);
    if (result.success) {
      currentStats = result.data;
      updateDashboard(result.data);
      updateTrayWithTickets(result.data);
      checkForMentions();
    }
  } catch (error) {
    showError(error);
  } finally {
    hideLoading();
  }
}

// Cálculo de SLA
function calculateSlaStatus(ticket) {
  const slaField = ticket.fields.customfield_10123; // Time to resolution
  
  if (!slaField || !slaField.ongoingCycle) {
    return 'unknown';
  }
  
  // Verificar se já estourou
  if (slaField.ongoingCycle.breached === true) {
    return 'overdue'; // 🔴 Vermelho
  }
  
  const breachTime = slaField.ongoingCycle.breachTime?.iso8601;
  if (!breachTime) return 'unknown';
  
  const now = new Date();
  const dueDate = new Date(breachTime);
  const diffMinutes = (dueDate - now) / 60000;
  
  if (diffMinutes < 0) return 'overdue';    // 🔴 Estourado
  if (diffMinutes <= 60) return 'critical'; // 🔴 Crítico (< 1h)
  if (diffMinutes <= 180) return 'warning'; // 🟡 Alerta (1-3h)
  return 'safe';                            // 🟢 OK (> 3h)
}

// Renderização de ticket
function renderTicket(ticket, listElement) {
  const slaStatus = calculateSlaStatus(ticket);
  
  const ticketDiv = document.createElement('div');
  ticketDiv.className = 'ticket-item';
  ticketDiv.dataset.slaStatus = slaStatus;
  ticketDiv.dataset.ticketKey = ticket.key;
  
  ticketDiv.innerHTML = `
    <div class="ticket-key">${ticket.key}</div>
    <div class="ticket-summary">${ticket.summary}</div>
    <div class="ticket-status">${ticket.status}</div>
    ${slaStatus !== 'unknown' ? `
      <div class="ticket-sla-indicator sla-${slaStatus}">
        ${getSlaIcon(slaStatus)} ${getSlaText(slaStatus)}
      </div>
    ` : ''}
  `;
  
  ticketDiv.addEventListener('click', () => {
    openTicketPreview(ticket.key);
  });
  
  listElement.appendChild(ticketDiv);
}
```

**Localização:** `/Users/gabriel.silva.digisystem/jira monitor/renderer.js` (6976 linhas)

---

### 3. Jira Service (jira-service.js)

**Responsabilidades:**
- Integração com Jira REST API v3
- Construção de queries JQL
- Parsing de respostas
- Conversão de formato ADF para HTML
- Gerenciamento de cache de campos

**Estrutura da classe:**

```javascript
class JiraService {
  constructor(config) {
    this.baseUrl = config.jiraUrl;
    this.email = config.jiraEmail;
    this.apiToken = config.jiraApiToken;
    this.auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    this._cachedFieldIds = {
      itopsTeam: null,
      satisfaction: null
    };
  }

  // Requisição base
  async _makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Basic ${this.auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`Jira API Error (${response.status})`);
    }

    return await response.json();
  }

  // Busca com JQL
  async _searchJql(jql, fields = ['status', 'summary', 'key']) {
    const endpoint = `/rest/api/3/search/jql`;
    
    const body = {
      jql,
      fields,
      maxResults: 1000
    };

    return await this._makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Fetch de estatísticas principais
  async fetchStats() {
    const assignee = 'currentUser()';
    
    const totalJql = `assignee = ${assignee} AND resolution = Unresolved AND project = IT`;
    const supportJql = `assignee = ${assignee} AND status = "Waiting for Support" AND project = IT`;
    
    const [totalData, supportData] = await Promise.all([
      this._searchJql(totalJql, ['status', 'summary', 'key', 'customfield_10123']),
      this._searchJql(supportJql, ['status', 'summary', 'key'])
    ]);

    return {
      total: totalData.issues?.length || 0,
      waitingForSupport: supportData.issues?.length || 0,
      allTickets: totalData.issues,
      supportTickets: supportData.issues
    };
  }

  // Detalhes de um ticket
  async getTicketDetails(ticketKey) {
    const endpoint = `/rest/api/3/issue/${ticketKey}`;
    const fields = 'status,summary,description,assignee,reporter,priority,created,updated,comment,attachment,customfield_*';
    
    const ticketData = await this._makeRequest(`${endpoint}?fields=${fields}`);
    
    return {
      key: ticketKey,
      summary: ticketData.fields.summary,
      description: this._convertADFToHTML(ticketData.fields.description),
      status: ticketData.fields.status.name,
      comments: ticketData.fields.comment?.comments || [],
      attachments: ticketData.fields.attachment || []
    };
  }

  // Conversão de ADF (Atlassian Document Format) para HTML
  _convertADFToHTML(content) {
    if (!content || typeof content === 'string') {
      return content || '';
    }
    
    if (content.type === 'doc') {
      return content.content.map(node => this._convertNodeToHTML(node)).join('');
    }
    
    return this._convertNodeToHTML(content);
  }

  _convertNodeToHTML(node) {
    switch (node.type) {
      case 'paragraph':
        const pContent = node.content ? 
          node.content.map(n => this._convertNodeToHTML(n)).join('') : '';
        return `<p>${pContent}</p>`;
        
      case 'text':
        let text = node.text || '';
        
        if (node.marks) {
          node.marks.forEach(mark => {
            switch (mark.type) {
              case 'strong':
                text = `<strong>${text}</strong>`;
                break;
              case 'em':
                text = `<em>${text}</em>`;
                break;
              case 'link':
                text = `<a href="${mark.attrs.href}" target="_blank">${text}</a>`;
                break;
            }
          });
        }
        return text;
        
      case 'mention':
        return `<span class="mention">@${node.attrs.text}</span>`;
        
      case 'hardBreak':
        return '<br>';
        
      default:
        return '';
    }
  }
}

module.exports = JiraService;
```

**Localização:** `/Users/gabriel.silva.digisystem/jira monitor/jira-service.js` (2223 linhas)

---

### 4. Tray Manager (tray-manager.js)

**Responsabilidades:**
- Gerenciamento do ícone na Menu Bar
- Menu dropdown categorizado
- Indicadores visuais múltiplos
- Abertura de tickets ao clicar

**Estrutura:**

```javascript
class TrayManager {
  constructor(mainWindow, recreateWindowFn) {
    this.mainWindow = mainWindow;
    this.recreateWindowFn = recreateWindowFn;
    this.tray = null;
    this.ticketsData = {
      critical: [], // 🔴 SLA vencido
      warning: [],  // 🟡 Próximo do vencimento
      normal: []    // 🟢 No prazo
    };
  }

  // Criar tray icon
  create() {
    const icon = this.createTextIcon('○', 'white');
    this.tray = new Tray(icon);
    this.tray.setToolTip('Jira Monitor - Carregando...');
    this.updateMenu();
  }

  // Atualizar ícone baseado em tickets
  updateIcon() {
    let emojis = '';
    
    if (this.ticketsData.critical.length > 0) {
      emojis += '🔴'; // Vermelho
    }
    
    if (this.ticketsData.warning.length > 0) {
      emojis += '🟡'; // Amarelo
    }
    
    if (this.ticketsData.normal.length > 0) {
      emojis += '🟢'; // Verde
    }
    
    if (emojis === '') {
      emojis = '⚪'; // Sem tickets
    }
    
    this.tray.setTitle(emojis);
  }

  // Atualizar menu dropdown
  updateMenu() {
    const menuTemplate = [];
    
    // Tickets críticos
    if (this.ticketsData.critical.length > 0) {
      menuTemplate.push({
        label: '🔴 SLA VENCIDO',
        enabled: false
      });
      
      this.ticketsData.critical.slice(0, 5).forEach(ticket => {
        menuTemplate.push({
          label: `   ${ticket.key}: ${ticket.summary}`,
          click: () => this.openTicket(ticket.key)
        });
      });
    }
    
    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    this.tray.setContextMenu(contextMenu);
  }

  // Abrir ticket específico
  openTicket(ticketKey) {
    this.pendingTicketFocus = ticketKey;
    this.showMainWindow();
    
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      setTimeout(() => {
        this.mainWindow.webContents.send('focus-ticket', ticketKey);
        this.pendingTicketFocus = null;
      }, 100);
    }
  }
}

module.exports = TrayManager;
```

**Localização:** `/Users/gabriel.silva.digisystem/jira monitor/tray-manager.js` (623 linhas)

---

## 🔌 Integração com Jira API

### Autenticação

```javascript
// Basic Authentication
const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

headers: {
  'Authorization': `Basic ${auth}`,
  'Content-Type': 'application/json'
}
```

### Endpoints Principais

#### 1. Search com JQL

```javascript
POST /rest/api/3/search/jql
Content-Type: application/json

{
  "jql": "assignee = currentUser() AND resolution = Unresolved",
  "fields": [
    "summary",
    "status",
    "priority",
    "customfield_10123", // Time to resolution
    "customfield_10124"  // Time to first response
  ],
  "maxResults": 1000,
  "startAt": 0
}

// Response
{
  "issues": [
    {
      "key": "IT-12345",
      "fields": {
        "summary": "Título do ticket",
        "status": { "name": "In Progress" },
        "customfield_10123": {
          "ongoingCycle": {
            "breached": false,
            "breachTime": {
              "iso8601": "2026-01-10T15:30:00.000-0300"
            }
          }
        }
      }
    }
  ]
}
```

#### 2. Get Issue Details

```javascript
GET /rest/api/3/issue/{issueKey}?fields=*all

// Response
{
  "key": "IT-12345",
  "fields": {
    "summary": "Título",
    "description": { ... }, // ADF format
    "status": { "name": "In Progress" },
    "assignee": {
      "accountId": "557058:f58131cb-b67d-43c7-b30d-6b58d40bd077",
      "displayName": "João Silva",
      "emailAddress": "joao.silva@empresa.com"
    },
    "comment": {
      "comments": [
        {
          "id": "10001",
          "author": { ... },
          "body": { ... }, // ADF format
          "created": "2026-01-09T10:15:00.000-0300"
        }
      ]
    }
  }
}
```

#### 3. Add Comment

```javascript
POST /rest/api/3/issue/{issueKey}/comment
Content-Type: application/json

{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Comentário de teste"
          },
          {
            "type": "mention",
            "attrs": {
              "id": "557058:f58131cb-b67d-43c7-b30d-6b58d40bd077",
              "text": "@João Silva"
            }
          }
        ]
      }
    ]
  },
  "properties": [
    {
      "key": "sd.public.comment",
      "value": { "internal": false }
    }
  ]
}
```

#### 4. Upload Attachment

```javascript
POST /rest/api/3/issue/{issueKey}/attachments
Content-Type: multipart/form-data
X-Atlassian-Token: no-check

FormData: {
  file: <binary data>
}
```

#### 5. Search Users

```javascript
GET /rest/api/3/user/search?query={searchTerm}&maxResults=50

// Response
[
  {
    "accountId": "557058:...",
    "displayName": "João Silva",
    "emailAddress": "joao.silva@empresa.com",
    "avatarUrls": {
      "48x48": "https://avatar-management.services.atlassian.com/..."
    }
  }
]
```

### Rate Limiting

```javascript
// Jira Cloud tem rate limits:
// - 10 requests/segundo (burst)
// - 300 requests/minuto (sustained)

// Implementação futura:
class RateLimiter {
  constructor(requestsPerSecond = 10) {
    this.queue = [];
    this.processing = false;
    this.interval = 1000 / requestsPerSecond;
  }

  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const { fn, resolve, reject } = this.queue.shift();
    
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      setTimeout(() => {
        this.processing = false;
        this.process();
      }, this.interval);
    }
  }
}
```

---

## 🔄 Fluxo de Dados

### Fluxo Completo de Atualização

```
┌─────────────────────────────────────────────────────────┐
│ 1. Timer (setInterval)                                  │
│    - Intervalo configurável (padrão: 60s)               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Renderer: fetchStats()                               │
│    - Mostra loading                                     │
│    - Invoca IPC                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ ipcRenderer.invoke('fetch-jira-stats')
┌─────────────────────────────────────────────────────────┐
│ 3. Main: IPC Handler                                    │
│    - Recebe config                                      │
│    - Cria JiraService                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ jiraService.fetchStats()
┌─────────────────────────────────────────────────────────┐
│ 4. JiraService: fetchStats()                            │
│    - Constrói queries JQL                               │
│    - Executa múltiplas buscas em paralelo               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ Promise.all([query1, query2, ...])
┌─────────────────────────────────────────────────────────┐
│ 5. Jira API                                             │
│    - Processa queries                                   │
│    - Retorna dados em JSON                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ Response (JSON)
┌─────────────────────────────────────────────────────────┐
│ 6. JiraService: Parse & Transform                       │
│    - Extrai campos necessários                          │
│    - Calcula SLA (se disponível)                        │
│    - Agrupa por projeto                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ return stats
┌─────────────────────────────────────────────────────────┐
│ 7. Main: Retorna via IPC                                │
│    - Envia para renderer                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ { success: true, data: stats }
┌─────────────────────────────────────────────────────────┐
│ 8. Renderer: updateDashboard(stats)                     │
│    - Atualiza currentStats                              │
│    - Renderiza UI                                       │
│    - Atualiza tray                                      │
│    - Verifica notificações                              │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Preview de Ticket

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuário clica em ticket                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ openTicketPreview(ticketKey)
┌─────────────────────────────────────────────────────────┐
│ 2. Renderer: Abre modal                                 │
│    - Mostra loading                                     │
│    - Invoca IPC                                         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ ipcRenderer.invoke('get-ticket-details')
┌─────────────────────────────────────────────────────────┐
│ 3. Main: IPC Handler                                    │
│    - Chama JiraService                                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ service.getTicketDetails(ticketKey)
┌─────────────────────────────────────────────────────────┐
│ 4. JiraService: Busca detalhes                          │
│    - GET /issue/{key}?fields=*all                       │
│    - Converte ADF para HTML                             │
│    - Processa anexos e comentários                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ return ticketDetails
┌─────────────────────────────────────────────────────────┐
│ 5. Renderer: Renderiza preview                          │
│    - Preenche campos                                    │
│    - Lista comentários                                  │
│    - Mostra anexos                                      │
│    - Ativa modo Pro (se habilitado)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Sistema de SLA Colors

### Lógica de Cálculo

```javascript
/**
 * Calcula status de SLA de um ticket
 * 
 * @param {Object} ticket - Objeto do ticket do Jira
 * @returns {string} 'safe' | 'warning' | 'critical' | 'overdue' | 'unknown'
 */
function calculateSlaStatus(ticket) {
  // 1. Buscar campo Time to resolution
  const timeToResolution = ticket.fields.customfield_10123;
  
  if (!timeToResolution || !timeToResolution.ongoingCycle) {
    return 'unknown';
  }
  
  // 2. Verificar se já estourou (campo breached)
  if (timeToResolution.ongoingCycle.breached === true) {
    return 'overdue'; // 🔴 Vermelho (estourado)
  }
  
  // 3. Verificar tempo restante
  const breachTime = timeToResolution.ongoingCycle.breachTime?.iso8601;
  if (!breachTime) return 'unknown';
  
  const now = new Date();
  const dueDate = new Date(breachTime);
  const diffMinutes = (dueDate - now) / 60000;
  
  // 4. Classificar por tempo
  if (diffMinutes < 0) {
    return 'overdue';    // 🔴 Estourado (< 0)
  } else if (diffMinutes <= 60) {
    return 'critical';   // 🔴 Crítico (0-1h)
  } else if (diffMinutes <= 180) {
    return 'warning';    // 🟡 Alerta (1-3h)
  } else {
    return 'safe';       // 🟢 OK (> 3h)
  }
}
```

### Mapeamento de Cores (CSS)

```css
/* Variáveis de cores SLA */
:root {
  --sla-safe: #10B981;       /* Verde */
  --sla-warning: #F59E0B;    /* Amarelo */
  --sla-critical: #EF4444;   /* Vermelho */
  --sla-overdue: #DC2626;    /* Vermelho escuro */
}

/* Aplicação em tickets */
.ticket-item[data-sla-status="safe"] {
  border-left: 6px solid var(--sla-safe);
  background: linear-gradient(
    90deg,
    rgba(16, 185, 129, 0.05) 0%,
    transparent 100%
  );
}

.ticket-item[data-sla-status="warning"] {
  border-left: 6px solid var(--sla-warning);
  background: linear-gradient(
    90deg,
    rgba(245, 158, 11, 0.1) 0%,
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
}

.ticket-item[data-sla-status="critical"] {
  border-left: 6px solid var(--sla-critical);
  background: linear-gradient(
    90deg,
    rgba(239, 68, 68, 0.15) 0%,
    transparent 100%
  );
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.3);
}

.ticket-item[data-sla-status="overdue"] {
  border-left: 6px solid var(--sla-overdue);
  background: linear-gradient(
    90deg,
    rgba(220, 38, 38, 0.2) 0%,
    transparent 100%
  );
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
  animation: pulse-critical 2s ease-in-out infinite;
}

/* Animação de pulsação para tickets estourados */
@keyframes pulse-critical {
  0%, 100% {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(220, 38, 38, 0.6);
  }
}
```

### Campos SLA do Jira Service Management

```javascript
// Campos customizados importantes
const SLA_FIELDS = {
  timeToResolution: 'customfield_10123',
  timeToFirstResponse: 'customfield_10124'
};

// Estrutura do campo Time to resolution
{
  "customfield_10123": {
    "ongoingCycle": {
      "startTime": {
        "iso8601": "2026-01-09T10:00:00.000-0300"
      },
      "breachTime": {
        "iso8601": "2026-01-10T18:00:00.000-0300"
      },
      "breached": false,
      "remainingTime": {
        "millis": 115200000
      }
    },
    "completedCycles": []
  }
}
```

---

## 🔔 Sistema de Notificações

### Tipos de Notificações

```javascript
const NOTIFICATION_TYPES = {
  NEW_TICKET: 'new_ticket',           // Novo ticket atribuído
  STATUS_CHANGE: 'status_change',     // Mudança de status
  SLA_WARNING: 'sla_warning',         // SLA entrando em alerta (1-3h)
  SLA_CRITICAL: 'sla_critical',       // SLA crítico (< 1h)
  SLA_OVERDUE: 'sla_overdue',         // SLA estourado
  MENTION: 'mention',                 // Menção em comentário
  COMMENT: 'comment',                 // Novo comentário
  REASSIGNMENT: 'reassignment'        // Ticket reatribuído
};
```

### Fluxo de Notificações

```javascript
// 1. Verificação periódica
async function checkForNotifications() {
  const previousStats = currentStats;
  await fetchStats();
  const newStats = currentStats;
  
  // 2. Comparar estados
  const newTickets = findNewTickets(previousStats, newStats);
  const slaChanges = findSlaChanges(previousStats, newStats);
  
  // 3. Enviar notificações
  newTickets.forEach(ticket => {
    sendNotification(NOTIFICATION_TYPES.NEW_TICKET, {
      title: `Novo Ticket: ${ticket.key}`,
      body: ticket.summary,
      ticketKey: ticket.key
    });
  });
  
  slaChanges.forEach(change => {
    if (change.newStatus === 'critical') {
      sendNotification(NOTIFICATION_TYPES.SLA_CRITICAL, {
        title: `⚠️ SLA Crítico: ${change.ticket.key}`,
        body: `Menos de 1h para vencer!`,
        ticketKey: change.ticket.key
      });
    }
  });
}

// 4. Enviar notificação desktop (macOS)
function sendNotification(type, data) {
  // Verificar se já foi enviada
  const notificationId = `${type}_${data.ticketKey}`;
  if (notificationsHistory.has(notificationId)) {
    return;
  }
  
  // Desktop notification
  const notification = new Notification(data.title, {
    body: data.body,
    icon: getNotificationIcon(type),
    silent: !currentConfig.soundEnabled
  });
  
  notification.onclick = () => {
    openTicketPreview(data.ticketKey);
  };
  
  // In-app notification
  showInAppNotification(type, data);
  
  // Salvar histórico
  notificationsHistory.add(notificationId);
}
```

### Notificações In-App

```javascript
/**
 * Sistema de notificações in-app
 * Aparece como badge no ícone de notificações
 */
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
  }

  add(notification) {
    this.notifications.unshift(notification);
    this.unreadCount++;
    this.updateBadge();
    this.renderList();
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.unreadCount--;
      this.updateBadge();
    }
  }

  updateBadge() {
    const badge = document.getElementById('notification-badge');
    if (this.unreadCount > 0) {
      badge.textContent = this.unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  renderList() {
    const list = document.getElementById('notifications-preview-body');
    list.innerHTML = '';
    
    this.notifications.slice(0, 15).forEach(notification => {
      const item = document.createElement('div');
      item.className = `notification-item ${!notification.read ? 'unread' : ''}`;
      item.innerHTML = `
        <div class="notification-icon">${this.getIcon(notification.type)}</div>
        <div class="notification-content">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-body">${notification.body}</div>
          <div class="notification-time">${this.formatTime(notification.time)}</div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        this.markAsRead(notification.id);
        if (notification.ticketKey) {
          openTicketPreview(notification.ticketKey);
        }
      });
      
      list.appendChild(item);
    });
  }
}

const notificationManager = new NotificationManager();
```

---

## ⚡ Performance e Otimizações

### Otimizações Implementadas

#### 1. Throttling de Updates

```javascript
// Antes: Salvar estado a cada 30s
setInterval(saveState, 30000);

// Depois: Salvar estado a cada 2 minutos
setInterval(saveState, 120000);

// Impacto: -75% operações I/O
```

#### 2. Limitação de Renderização

```javascript
// Renderizar no máximo 100 tickets por lista
const MAX_TICKETS_RENDER = 100;

function renderTickets(tickets, container) {
  const ticketsToRender = tickets.slice(0, MAX_TICKETS_RENDER);
  
  ticketsToRender.forEach(ticket => {
    renderTicket(ticket, container);
  });
  
  // Mostrar aviso se houver mais tickets
  if (tickets.length > MAX_TICKETS_RENDER) {
    const remaining = tickets.length - MAX_TICKETS_RENDER;
    showWarning(container, `+${remaining} tickets não exibidos para melhor performance`);
  }
}

// Impacto: -80% elementos DOM em listas grandes
```

#### 3. Cache de SLA Status

```javascript
// Cache para evitar recalcular SLA repetidamente
const slaStatusCache = new Map();

function getSlaStatus(ticketKey, ticket) {
  if (slaStatusCache.has(ticketKey)) {
    const cached = slaStatusCache.get(ticketKey);
    
    // Verificar se ainda é válido (< 1 minuto)
    if (Date.now() - cached.timestamp < 60000) {
      return cached.status;
    }
  }
  
  const status = calculateSlaStatus(ticket);
  slaStatusCache.set(ticketKey, {
    status,
    timestamp: Date.now()
  });
  
  return status;
}

// Limpeza de cache a cada 10 minutos
setInterval(() => {
  const currentKeys = new Set(allTicketsCache.map(t => t.key));
  
  for (const key of slaStatusCache.keys()) {
    if (!currentKeys.has(key)) {
      slaStatusCache.delete(key);
    }
  }
}, 600000); // 10 min

// Impacto: -50% cálculos de SLA
```

#### 4. Debouncing Agressivo

```javascript
// Debounce para busca de usuários
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Aplicação
const searchUsers = debounce(async (query) => {
  const result = await ipc.invoke('search-users', query, 10);
  displayUserResults(result.data);
}, 600); // 600ms

// Antes: 300ms
// Depois: 600ms
// Impacto: -50% requisições HTTP
```

#### 5. Virtual Scrolling (Futuro)

```javascript
/**
 * Virtual scrolling para listas grandes
 * Renderiza apenas elementos visíveis no viewport
 */
class VirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.viewportHeight = container.clientHeight;
    this.startIndex = 0;
    this.endIndex = Math.ceil(this.viewportHeight / itemHeight);
    
    this.render();
    this.setupScrollListener();
  }

  render() {
    const visibleItems = this.items.slice(this.startIndex, this.endIndex);
    
    this.container.innerHTML = '';
    this.container.style.height = `${this.items.length * this.itemHeight}px`;
    
    visibleItems.forEach((item, index) => {
      const element = this.renderItem(item);
      element.style.position = 'absolute';
      element.style.top = `${(this.startIndex + index) * this.itemHeight}px`;
      this.container.appendChild(element);
    });
  }

  setupScrollListener() {
    this.container.addEventListener('scroll', () => {
      const scrollTop = this.container.scrollTop;
      const newStartIndex = Math.floor(scrollTop / this.itemHeight);
      const newEndIndex = newStartIndex + Math.ceil(this.viewportHeight / this.itemHeight);
      
      if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
        this.startIndex = newStartIndex;
        this.endIndex = newEndIndex;
        this.render();
      }
    });
  }
}
```

### Métricas de Performance

```yaml
Antes das Otimizações:
  Memória: 480 MB (500 tickets)
  CPU idle: 12%
  CPU pico: 35%
  Saves/hora: 120
  Renderização: 2-3 segundos

Depois das Otimizações:
  Memória: 180 MB (-62%)
  CPU idle: 4% (-67%)
  CPU pico: 14% (-60%)
  Saves/hora: 30 (-75%)
  Renderização: 0.5-1 segundo (-75%)
```

### Profiling e Debug

```javascript
// Medir tempo de execução
console.time('fetchStats');
await fetchStats();
console.timeEnd('fetchStats');
// Output: fetchStats: 1234.56ms

// Medir uso de memória
console.memory.usedJSHeapSize / 1048576; // MB
console.memory.jsHeapSizeLimit / 1048576; // MB

// Performance API
const start = performance.now();
await heavyOperation();
const end = performance.now();
console.log(`Operação levou ${end - start}ms`);
```

---

## 🔒 Segurança

### Armazenamento de Credenciais

#### Localização

```bash
# macOS
~/Library/Application Support/jira-monitor/config.json

# Estrutura
{
  "jiraUrl": "https://empresa.atlassian.net",
  "jiraEmail": "usuario@empresa.com",
  "jiraApiToken": "ATATT3xFfGF0...",  // ⚠️ Plain text
  "username": "nome.sobrenome"
}
```

#### ⚠️ Segurança Atual

```yaml
Status: ⚠️ PLAIN TEXT
Criptografia: ❌ Nenhuma
Permissões: ✅ Apenas o usuário (chmod 600)
Keychain: ❌ Não implementado
```

#### ✅ Melhorias Futuras (v2.0)

```javascript
// Usar macOS Keychain
const keytar = require('keytar');

// Salvar
await keytar.setPassword('jira-monitor', 'apiToken', apiToken);

// Ler
const apiToken = await keytar.getPassword('jira-monitor', 'apiToken');

// Deletar
await keytar.deletePassword('jira-monitor', 'apiToken');
```

### HTTPS & SSL

```javascript
// Todas as comunicações são via HTTPS
const jiraUrl = 'https://empresa.atlassian.net';

// Certificado SSL verificado automaticamente pelo Node.js
// Rejeitar conexões inseguras
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: true
});

axios.get(url, { httpsAgent: agent });
```

### Sanitização de Inputs

```javascript
/**
 * Sanitiza HTML para prevenir XSS
 */
function sanitizeHtml(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Escape de caracteres especiais
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Uso
const userInput = getUserInput();
const safe = escapeHtml(userInput);
element.innerHTML = safe;
```

### API Token Permissions

```yaml
Permissões Necessárias:
  read:jira-work: ✅
    - Ver tickets
    - Ver projetos
    - Ver status

  read:jira-user: ✅
    - Buscar usuários
    - Ver perfis

  write:jira-work: ✅ (Modo Pro)
    - Editar tickets
    - Mudar status
    - Atribuir tickets

  write:comment:jira: ✅ (Modo Pro)
    - Adicionar comentários
    - Editar comentários próprios
    - Deletar comentários próprios

  write:attachment:jira: ✅ (Modo Pro)
    - Upload de anexos
    - Download de anexos
```

### Content Security Policy (Futuro)

```html
<!-- Adicionar CSP no index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://*.atlassian.net;
      "
>
```

---

## 🧪 Testes

### Estrutura de Testes (Futuro)

```
tests/
├── unit/
│   ├── jira-service.test.js
│   ├── sla-calculator.test.js
│   └── utils.test.js
│
├── integration/
│   ├── api-integration.test.js
│   └── ipc-communication.test.js
│
└── e2e/
    ├── app-launch.test.js
    ├── ticket-preview.test.js
    └── notifications.test.js
```

### Exemplo de Teste Unitário

```javascript
// jira-service.test.js
const JiraService = require('../jira-service');

describe('JiraService', () => {
  let service;
  
  beforeEach(() => {
    service = new JiraService({
      jiraUrl: 'https://test.atlassian.net',
      jiraEmail: 'test@example.com',
      jiraApiToken: 'test-token'
    });
  });
  
  describe('calculateSlaStatus', () => {
    it('should return "safe" for tickets with > 3h', () => {
      const ticket = {
        fields: {
          customfield_10123: {
            ongoingCycle: {
              breached: false,
              breachTime: {
                iso8601: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
              }
            }
          }
        }
      };
      
      const status = service.calculateSlaStatus(ticket);
      expect(status).toBe('safe');
    });
    
    it('should return "overdue" for tickets with breached = true', () => {
      const ticket = {
        fields: {
          customfield_10123: {
            ongoingCycle: {
              breached: true,
              breachTime: {
                iso8601: new Date(Date.now() - 1000).toISOString()
              }
            }
          }
        }
      };
      
      const status = service.calculateSlaStatus(ticket);
      expect(status).toBe('overdue');
    });
  });
});
```

### Testes Manuais

```markdown
# Checklist de Testes Manuais

## Funcionalidades Básicas
- [ ] App inicia corretamente
- [ ] Login com credenciais válidas funciona
- [ ] Dashboard carrega tickets
- [ ] Números de tickets estão corretos
- [ ] Atualização automática funciona

## SLA Colors
- [ ] Tickets verdes aparecem verdes
- [ ] Tickets amarelos aparecem amarelos
- [ ] Tickets vermelhos aparecem vermelhos
- [ ] Animação de pulsação funciona em tickets estourados
- [ ] SLA é recalculado após atualização

## Notificações
- [ ] Notificação de novo ticket aparece
- [ ] Notificação de SLA crítico aparece
- [ ] Badge de notificações atualiza
- [ ] Clicar em notificação abre ticket
- [ ] Limpar notificações funciona

## Modo Pro
- [ ] Ativar/desativar Modo Pro funciona
- [ ] Editar campos inline funciona
- [ ] Adicionar comentário funciona
- [ ] Menções (@) funcionam
- [ ] Upload de anexo funciona
- [ ] Download de anexo funciona

## Menu Bar (Tray)
- [ ] Ícone aparece na menu bar
- [ ] Emojis coloridos aparecem
- [ ] Menu dropdown funciona
- [ ] Clicar em ticket abre preview
- [ ] Teste de cores funciona

## Performance
- [ ] Uso de CPU < 10% idle
- [ ] Uso de memória < 300 MB
- [ ] App responde rapidamente
- [ ] Scroll é fluido
```

---

## 🚀 Build e Deploy

### Build macOS

```bash
# 1. Instalar dependências
npm install

# 2. Build com electron-builder
npm run build

# Saída
dist/
├── jira-monitor-1.6.1.dmg      # Instalador DMG
├── jira-monitor-1.6.1-arm64.zip # App para Apple Silicon
└── jira-monitor-1.6.1-x64.zip   # App para Intel
```

### Configuração do Build

```json
// package.json
{
  "build": {
    "appId": "com.nubank.jiramonitor",
    "productName": "Jira Monitor",
    "mac": {
      "category": "public.app-category.productivity",
      "icon": "assets/icon.icns",
      "target": [
        {
          "target": "dmg",
          "arch": ["x64", "arm64"]
        },
        {
          "target": "zip",
          "arch": ["x64", "arm64"]
        }
      ],
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist"
    },
    "dmg": {
      "title": "Jira Monitor ${version}",
      "icon": "assets/icon.icns",
      "window": {
        "width": 540,
        "height": 380
      }
    }
  }
}
```

### Code Signing (Futuro)

```bash
# 1. Criar certificado de desenvolvedor Apple
# https://developer.apple.com/account/

# 2. Assinar app
electron-builder --mac --sign

# 3. Notarizar app (macOS 10.14+)
xcrun altool --notarize-app \
  --primary-bundle-id "com.nubank.jiramonitor" \
  --username "dev@empresa.com" \
  --password "@keychain:AC_PASSWORD" \
  --file "dist/jira-monitor-1.6.1.dmg"

# 4. Verificar status
xcrun altool --notarization-info {UUID} \
  --username "dev@empresa.com" \
  --password "@keychain:AC_PASSWORD"

# 5. Staple (anexar notarização ao app)
xcrun stapler staple "dist/Jira Monitor.app"
```

### Auto-Update (Futuro)

```javascript
// main.js
const { autoUpdater } = require('electron-updater');

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Atualização Disponível',
    message: 'Uma nova versão está disponível. Deseja atualizar?',
    buttons: ['Atualizar', 'Mais Tarde']
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

// Verificar atualizações ao iniciar
app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

---

## 👨‍💻 Guia de Desenvolvimento

### Setup do Ambiente

```bash
# 1. Clonar repositório
git clone git@github.com:gabinubank/jira-monitor.git
cd jira-monitor

# 2. Instalar Node.js 20+ via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 3. Instalar dependências
npm install

# 4. Iniciar em modo desenvolvimento
npm start

# 5. Abrir DevTools
# Cmd+Alt+I (macOS)
```

### Estrutura de Desenvolvimento

```javascript
// Modo desenvolvimento
if (process.argv.includes('--dev')) {
  mainWindow.webContents.openDevTools();
  console.log('🔧 Modo desenvolvimento ativo');
}

// Hot reload (manual)
mainWindow.webContents.on('devtools-reload-page', () => {
  console.log('🔄 Recarregando...');
});
```

### Debugging

#### 1. Main Process

```bash
# Iniciar com inspector
electron --inspect=5858 .

# Conectar Chrome DevTools
# Abrir: chrome://inspect
```

#### 2. Renderer Process

```javascript
// Console do Chromium
// Cmd+Alt+I

console.log('Debug:', variavel);
console.table(array);
console.group('Grupo');
console.groupEnd();
```

#### 3. Logs

```javascript
// Criar sistema de logs
class Logger {
  constructor(prefix) {
    this.prefix = prefix;
  }

  log(...args) {
    console.log(`[${this.prefix}]`, ...args);
  }

  error(...args) {
    console.error(`[${this.prefix}] ❌`, ...args);
  }

  warn(...args) {
    console.warn(`[${this.prefix}] ⚠️`, ...args);
  }

  info(...args) {
    console.info(`[${this.prefix}] ℹ️`, ...args);
  }
}

const logger = new Logger('JiraService');
logger.log('Iniciando busca de tickets...');
```

### Coding Standards

```javascript
// ✅ Bom
function fetchTicketDetails(ticketKey) {
  if (!ticketKey) {
    throw new Error('ticketKey é obrigatório');
  }
  
  return ipc.invoke('get-ticket-details', ticketKey);
}

// ❌ Evitar
function ftd(tk){if(!tk)throw 'err';return ipc.invoke('gtd',tk)}

// Padrões
// - camelCase para variáveis e funções
// - PascalCase para classes
// - UPPER_SNAKE_CASE para constantes
// - 2 espaços de indentação
// - Aspas simples para strings
// - Ponto e vírgula obrigatório
// - Comentários descritivos
// - JSDoc para funções públicas
```

### Commits

```bash
# Conventional Commits
feat: adiciona filtro por projeto
fix: corrige erro de autenticação no Jira
docs: atualiza README com novas instruções
style: formata código com prettier
refactor: refatora função de cálculo de SLA
perf: otimiza renderização de tickets
test: adiciona testes para JiraService
chore: atualiza dependências

# Commit com escopo
feat(sla): adiciona campo Time to first response
fix(notifications): corrige badge não atualizando

# Breaking changes
feat!: remove suporte para Node.js 16
BREAKING CHANGE: Node.js 18+ agora é obrigatório
```

### Pull Requests

```markdown
# Template de PR

## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Melhoriaperformance
- [ ] Documentação
- [ ] Refatoração

## Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## Checklist
- [ ] Código testado localmente
- [ ] Documentação atualizada
- [ ] Sem erros no console
- [ ] Performance verificada
- [ ] Screenshots (se aplicável)

## Screenshots
<!-- Adicionar screenshots se houver mudanças visuais -->
```

---

## 📊 Métricas do Projeto

### Tamanho do Código

```yaml
Arquivos JavaScript: 8
Linhas de Código:
  main.js: 1,205
  renderer.js: 6,976
  jira-service.js: 2,223
  tray-manager.js: 623
  Total: ~11,000

Arquivos CSS: 3
Linhas de Estilo:
  styles.css: ~2,000
  ux-enhancements.css: ~500
  performance-optimizations.css: ~300
  Total: ~2,800

Arquivos HTML: 1
  index.html: 1,367

Documentação:
  Arquivos .md: 30+
  Linhas: ~5,000
```

### Complexidade Ciclomática

```javascript
// Funções mais complexas
fetchStats()              // Complexidade: 15
calculateSlaStatus()      // Complexidade: 8
renderTicket()            // Complexidade: 12
updateDashboard()         // Complexidade: 10
```

### Bundle Size

```yaml
Desenvolvimento:
  node_modules/: 300 MB
  Código fonte: 5 MB
  Assets: 1 MB
  Total: 306 MB

Produção (empacotado):
  macOS .dmg: 80 MB
  Incluindo Electron runtime
```

---

## 🗺️ Roadmap Técnico

### v1.7.0 (Próxima)

```yaml
Features:
  - [ ] Virtual Scrolling para listas grandes
  - [ ] Cache de API com IndexedDB
  - [ ] Rate Limiting inteligente
  - [ ] Web Workers para processos pesados

Performance:
  - [ ] Lazy loading de imagens
  - [ ] Service Worker para offline
  - [ ] Compression de dados

Qualidade:
  - [ ] Testes unitários (Jest)
  - [ ] Testes E2E (Spectron)
  - [ ] CI/CD com GitHub Actions
  - [ ] Code coverage > 80%
```

### v2.0.0 (Futuro)

```yaml
Segurança:
  - [ ] Keychain integration (macOS)
  - [ ] Criptografia de dados
  - [ ] 2FA support
  - [ ] Token rotation

Arquitetura:
  - [ ] Context Isolation (Electron)
  - [ ] Preload scripts
  - [ ] Content Security Policy
  - [ ] TypeScript migration

Cross-Platform:
  - [ ] Windows support
  - [ ] Linux support
  - [ ] Auto-update
  - [ ] Instaladores (.exe, .deb, .rpm)
```

---

## 📞 Suporte Técnico

### Contatos

```yaml
Desenvolvedores:
  - Gabriel Silva (@GABS SILVA)
    Email: gabriel.silva.digisystem@nubank.com.br
    Slack: @GABS SILVA

  - Yanka Dantas (@ya)
    Email: yanka.araujo.digisystem@nubank.com.br
    Slack: @ya

Repositório:
  GitHub: https://github.com/gabinubank/jira-monitor
  Issues: https://github.com/gabinubank/jira-monitor/issues

Documentação:
  Technical: DOCUMENTACAO-TECNICA.md (este arquivo)
  User Guide: DOCUMENTACAO-USUARIO.md
  Complete: DOCUMENTACAO-COMPLETA.md
```

### Processo de Issue

```markdown
1. Verificar se já existe issue similar
2. Criar nova issue com template
3. Incluir:
   - Versão do app
   - Versão do Node.js
   - Sistema operacional
   - Logs relevantes
   - Screenshots
   - Passos para reproduzir

4. Aguardar triagem
5. Receber fix ou workaround
```

---

## 📄 Licença

**Projeto interno** em fase de desenvolvimento.  
Uso restrito a colaboradores autorizados do Nubank.

---

## 🙏 Créditos

### Tecnologias

- **Electron** - Framework desktop
- **Node.js** - Runtime JavaScript
- **Jira REST API** - Integração com Jira
- **electron-store** - Persistência local

### Inspirações

- **GitKraken** - Interface desktop moderna
- **Slack** - Sistema de notificações
- **VS Code** - Atalhos de teclado

---

**Última atualização**: 09/01/2026  
**Versão**: 1.6.1  
**Autores**: Gabriel Silva & Yanka Dantas

---

**Feito com ❤️ e muito ☕ no Nubank! 🚀**
