# 📂 Estrutura do Projeto - Jira Monitor v1.4.0

## Arquivos Principais

```
jira monitor/
│
├── 📄 package.json                       # Dependências e scripts npm
├── 📄 .gitignore                         # Arquivos ignorados pelo Git
│
├── 🖥️  main.js                            # Processo principal do Electron
│   ├── Criação da janela
│   ├── Menu de tray
│   ├── IPC handlers
│   ├── Gerenciamento de configuração
│   └── Lembrar posição/tamanho da janela
│
├── 🎨 renderer.js                        # Lógica da interface (Front-end)
│   ├── Inicialização e carregamento
│   ├── Event listeners
│   ├── Atalhos de teclado
│   ├── Busca rápida
│   ├── Menu hambúrguer
│   ├── Modo Pro
│   ├── Cards expansíveis
│   ├── Preview de tickets
│   ├── Notificações
│   ├── Drag and drop
│   ├── Edição de campos
│   └── Toast notifications
│
├── 🔌 jira-service.js                    # Integração com API do Jira
│   ├── Autenticação (Basic Auth)
│   ├── Busca de tickets (JQL)
│   ├── Estatísticas e contadores
│   ├── SLA e alertas
│   ├── Detalhes do ticket
│   ├── Comentários (CRUD)
│   ├── Anexos (upload/download)
│   ├── Edição de campos
│   ├── Busca de usuários
│   ├── Notificações e menções
│   └── Conversão ADF → HTML
│
├── 🌐 index.html                         # Estrutura HTML
│   ├── Header (menu, notificações, botões)
│   ├── Busca rápida
│   ├── Cards de estatísticas
│   ├── Modo Pro (seções)
│   ├── Modal de atalhos
│   ├── Modal de preview de tickets
│   ├── Painel de configuração
│   ├── Toast container
│   └── Resize handle
│
├── 🎨 styles.css                         # Estilos CSS
│   ├── Reset e estilos globais
│   ├── Glassmorphism
│   ├── Header e menu
│   ├── Notificações
│   ├── Busca
│   ├── Cards
│   ├── Modo Pro
│   ├── Modais
│   ├── Skeleton loading
│   ├── Drag and drop
│   ├── Toast notifications
│   └── Responsive (layouts)
│
├── 🚀 ativar-inicio-automatico.sh        # Script para ativar Launch Agent
├── 🛑 desativar-inicio-automatico.sh     # Script para desativar Launch Agent
│
├── 📖 README.md                          # Documentação completa
├── 📖 QUICK_START.md                     # Guia rápido de início
├── 📖 COMANDOS.md                        # Comandos úteis
└── 📖 ESTRUTURA.md                       # Este arquivo

```

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    index.html + styles.css                  │
│                     (Interface Visual)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      renderer.js                            │
│              (Lógica da Interface)                          │
│  • Event listeners                                          │
│  • Manipulação do DOM                                       │
│  • Formatação de dados                                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ IPC (Inter-Process Communication)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                        main.js                              │
│              (Processo Principal)                           │
│  • Gerenciamento da janela                                  │
│  • IPC handlers                                             │
│  • Tray icon                                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    jira-service.js                          │
│               (Integração com Jira)                         │
│  • Requisições HTTP                                         │
│  • Autenticação                                             │
│  • Processamento de dados                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     JIRA API v3                             │
│              (nubank.atlassian.net)                         │
└─────────────────────────────────────────────────────────────┘
```

## Módulos e Dependências

### Dependências Principais

```
electron                v28.0.0      Framework desktop
electron-store          v8.1.0       Armazenamento local
node-fetch              v2.7.0       Requisições HTTP
form-data               (built-in)   Upload de arquivos
```

### Módulos Node.js Nativos Utilizados

```
fs                      Sistema de arquivos
path                    Manipulação de caminhos
child_process           Execução de comandos (afplay)
```

### APIs do Electron Utilizadas

```
app                     Controle da aplicação
BrowserWindow           Criação de janelas
ipcMain / ipcRenderer   Comunicação entre processos
Tray                    Ícone na bandeja do sistema
Menu                    Menus contextuais
dialog                  Diálogos nativos
shell                   Abrir URLs externas
screen                  Informações da tela
```

## Armazenamento Local (electron-store)

### Localização dos Dados
```
~/Library/Application Support/jira-monitor/
├── config.json              # Configurações do usuário
└── trend-history.json       # Histórico de tendência (30 dias)
```

### Estrutura do config.json
```json
{
  "jiraUrl": "https://nubank.atlassian.net",
  "jiraEmail": "usuario@empresa.com",
  "jiraApiToken": "...",
  "queueId": "1104",
  "refreshInterval": 60,
  "oldTicketsDays": 7,
  "alertSla": true,
  "alertOldTickets": true,
  "soundNotifications": true,
  "proMode": false,
  "monitorOtherUser": false,
  "otherUserEmail": "",
  "windowBounds": {
    "x": 100,
    "y": 100,
    "width": 420,
    "height": 700
  },
  "simCardsButtons": [...],
  "docL1Buttons": [...],
  "projectButtons": [...]
}
```

## Launch Agent (macOS)

### Localização
```
~/Library/LaunchAgents/com.nubank.jiramonitor.plist
```

### Logs
```
~/Library/Logs/com.nubank.jiramonitor.log       # Log de saída
~/Library/Logs/com.nubank.jiramonitor.error.log # Log de erros
```

## Endpoints da API Jira Utilizados

```
POST   /rest/api/3/search/jql                   # Buscar tickets (JQL) - NOVO ENDPOINT OBRIGATÓRIO
GET    /rest/api/3/filter/{filterId}            # Obter filtro
GET    /rest/api/3/issue/{issueKey}             # Detalhes do ticket
GET    /rest/api/3/issue/{issueKey}/editmeta    # Metadados de edição
GET    /rest/api/3/issue/{issueKey}/transitions # Transições disponíveis
POST   /rest/api/3/issue/{issueKey}/comment     # Adicionar comentário
PUT    /rest/api/3/issue/{issueKey}/comment/{id}# Atualizar comentário
DELETE /rest/api/3/issue/{issueKey}/comment/{id}# Excluir comentário
POST   /rest/api/3/issue/{issueKey}/attachments # Upload de anexo
GET    /rest/api/3/attachment/content/{id}      # Download de anexo
PUT    /rest/api/3/issue/{issueKey}             # Atualizar campos
POST   /rest/api/3/issue/{issueKey}/transitions # Alterar status
GET    /rest/api/3/user/search                  # Buscar usuários
GET    /rest/api/3/myself                       # Usuário atual
```

## Funcionalidades por Arquivo

### main.js
- ✅ Criação da janela frameless
- ✅ Sempre no topo (alwaysOnTop)
- ✅ Tray icon com menu contextual
- ✅ IPC handlers para comunicação
- ✅ Salvamento automático de posição/tamanho
- ✅ Validação de limites da tela

### renderer.js
- ✅ Carregamento de configuração
- ✅ Fetch e atualização de estatísticas
- ✅ Atualização automática (intervalo configurável)
- ✅ Atalhos de teclado (15+ atalhos)
- ✅ Busca rápida de tickets
- ✅ Menu hambúrguer com dropdown
- ✅ Sistema de notificações
- ✅ Preview completo de tickets
- ✅ Modo Pro (estatísticas avançadas)
- ✅ Cards expansíveis
- ✅ Drag and drop de botões
- ✅ Edição inline de botões
- ✅ Toast notifications
- ✅ Skeleton loading
- ✅ Resize handle
- ✅ Layout responsivo

### jira-service.js
- ✅ Autenticação Basic Auth
- ✅ Queries JQL complexas
- ✅ Cálculo de SLA
- ✅ Detecção de tickets antigos
- ✅ Estatísticas por projeto
- ✅ Histórico de tendência real
- ✅ Tickets de Telefonia SIM cards
- ✅ Detalhes completos do ticket
- ✅ CRUD de comentários
- ✅ Upload/download de anexos
- ✅ Conversão ADF → HTML
- ✅ Busca de usuários
- ✅ Notificações e menções
- ✅ Edição de campos e transições
- ✅ Suporte a monitorar outro usuário

### index.html
- ✅ Header com logo, título e botões
- ✅ Menu hambúrguer
- ✅ Botão de notificações com badge
- ✅ Campo de busca rápida
- ✅ 4 cards de estatísticas
- ✅ Badges visuais (SLA, tickets antigos)
- ✅ Seções do Modo Pro
- ✅ Modal de atalhos
- ✅ Modal de preview de tickets
- ✅ Painel de configuração
- ✅ Toast container
- ✅ Resize handle

### styles.css
- ✅ Gradiente roxo (#667eea → #764ba2)
- ✅ Glassmorphism
- ✅ Animações suaves
- ✅ Skeleton loading
- ✅ Badges pulsantes
- ✅ Drag and drop visual
- ✅ Modais com fade/slide
- ✅ Toast notifications
- ✅ Scrollbar customizada
- ✅ Responsive (2 layouts)

## Estatísticas do Projeto

```
📊 Total de arquivos:      11
📊 Linhas de código:       ~5.000+ linhas
📊 Funcionalidades:        50+
📊 Atalhos de teclado:     15+
📊 IPC handlers:           15+
📊 Endpoints Jira:         12+
📊 Modais:                 3
📊 Cards:                  4
📊 Layouts:                2
```

## Tecnologias Utilizadas

- **Framework**: Electron 28
- **Linguagem**: JavaScript (ES6+)
- **UI**: HTML5 + CSS3
- **API**: Jira REST API v3
- **Storage**: electron-store
- **HTTP**: node-fetch
- **OS**: macOS (com suporte para Launch Agent)

---

**Última atualização**: Dezembro 2025  
**Versão**: 1.4.0

