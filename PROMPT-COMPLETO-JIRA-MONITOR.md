# 🚀 PROMPT COMPLETO: Criar Jira Monitor v1.5.0

## 📋 Descrição

Crie uma aplicação desktop Electron completa para monitorar tickets do Jira Service Desk em tempo real com Dashboard de Performance, Timer/Pomodoro e Alertas Proativos. A aplicação deve ser um widget flutuante (always on top) com design moderno usando glassmorphism e gradientes roxos.

## ✨ Funcionalidades Principais

### Core Features
- Widget flutuante sempre visível (always on top) e arrastável
- 4 cards de estatísticas principais:
  - Total de tickets do projeto IT
  - Waiting for Support (IT)
  - Waiting for Customer (IT)
  - Tickets Pending (IT)
- Atualização automática configurável (padrão: 60 segundos)
- Refresh manual com botão
- Cards clicáveis que abrem o Jira com filtros específicos
- Cards expansíveis mostrando lista completa de tickets
- Redimensionável com handle no canto inferior direito
- Lembra posição e tamanho da janela entre sessões
- Sistema de tray icon (bandeja do sistema)

### Alertas e Notificações
- Notificações desktop para:
  - Novos tickets atribuídos ao usuário
  - Mudanças de status
  - Reatribuições
  - Menções em comentários
- Alerta de SLA próximo (1 hora antes do vencimento)
- Alerta de tickets antigos (sem atualização há X dias configuráveis)
- Sons automáticos nas notificações (macOS: afplay)
- Sistema de notificações com preview de atividades e menções
- Painel de notificações com badge de contador

### Preview de Tickets (Modal Completo)
- Visualizar detalhes completos do ticket sem sair do app
- Campos editáveis inline:
  - Status (com transições disponíveis)
  - Priority
  - Assignee (com autocomplete)
  - Reporter (com autocomplete)
  - Campos customizados (Support Level, ITOps Team)
- Adicionar comentários (públicos ou internos)
- Suporte a menções (@usuário) nos comentários com autocomplete
- Visualizar, adicionar e baixar anexos
- Preview automático de imagens em modal
- Editar e excluir comentários existentes
- Histórico completo de atividades

### Busca e Navegação
- Busca rápida de tickets (Cmd+K) com navegação por teclado
- Filtros por status, projeto, assignee
- Atalhos de teclado completos (ver seção de atalhos)
- Menu hambúrguer com acesso rápido

### Modo Pro (Recursos Avançados)
- Atividade de Hoje:
  - Contador de tickets recebidos hoje
  - Contador de tickets fechados hoje
  - Contador de comentários feitos hoje
  - Lista expansível com detalhes de cada atividade
- Tickets de Telefonia SIM cards (filtro específico)
- Tickets Avaliados (últimos tickets com satisfaction rating)
- Estatísticas por projeto (IT, DCI, GTC, etc.) com listas expansíveis
- Tickets recentes (últimos 5 atualizados)
- Gráfico de tendência com histórico real dos últimos 7 dias
- Botões customizáveis:
  - Editáveis (duplo clique no texto)
  - Arrastáveis (drag and drop)
  - Ícone de edição e drag handle

### 📊 Dashboard de Performance (v1.5.0 - Modo Pro)
- Tempo médio de resolução de tickets (horas e dias)
- Taxa de fechamento (tickets/dia e tickets/semana)
- Gráficos de pizza interativos:
  - Por tipo de ticket
  - Por prioridade
  - Por projeto
- Heatmap de atividade por horário (0h-24h):
  - Identificar horários mais produtivos
  - Células com intensidade por volume
  - Tooltips com valores exatos
- Lista dos últimos 10 tickets resolvidos:
  - Clicável para abrir preview
  - Com horário e prioridade
- Botão de atualização manual de métricas
- Análise de 30 dias de histórico
- Cache inteligente de dados

### ⏱️ Timer & Pomodoro (v1.5.0)
- Timer manual para rastreamento livre de tempo
- Modo Pomodoro completo:
  - 25 minutos de trabalho focado
  - 5 minutos de pausa curta
  - 15 minutos de pausa longa (após 4 sessões)
  - Contador de sessões (1-4)
  - Indicador de próxima ação
- Widget flutuante e arrastável:
  - Display HH:MM:SS
  - Minimizável para modo compacto
  - Sempre visível sobre outras janelas
- Controles completos:
  - Iniciar / Pausar / Parar
  - Trocar entre Manual e Pomodoro
- Worklog automático no Jira:
  - Campo de comentário contextual
  - Salvamento automático ao completar Pomodoro
  - Salvamento manual quando necessário
  - Tempo mínimo: 1 minuto
- Notificações sonoras ao completar sessão
- Atalho rápido: Cmd+T

### 🔔 Alertas Proativos (v1.5.0 - Modo Pro)
- Tickets sem resposta há X horas (padrão: 4h):
  - Detecta tickets em "Waiting for Support" ou "In Progress"
  - Verifica se último comentário foi do usuário
  - Notificação desktop automática
- SLA crítico (15 minutos antes do vencimento):
  - Alertas com cor vermelha (danger)
  - Notificação prioritária a cada 15 min
  - Som de alerta crítico
  - Contador de minutos restantes
- Menções não lidas em comentários:
  - Detecta @menções nos últimos 3 dias
  - Mostra preview do comentário
  - Link direto para o ticket
- Cards visuais com cores distintas:
  - ⚠️ Warning (laranja) - Sem resposta
  - 🚨 Danger (vermelho) - SLA crítico
  - 💬 Info (azul) - Menções
- Verificação automática a cada 5 minutos
- Throttling inteligente de notificações:
  - Evita spam repetido
  - Cache de notificações enviadas
- Mensagem "Tudo tranquilo" quando não há alertas
- Lista clicável de tickets em alerta
- Integração com notificações desktop do sistema

### Monitoramento de Outros Usuários
- Dropdown de seleção de usuário no header
- Visualizar tickets de qualquer usuário do Jira
- Todas as estatísticas adaptadas ao usuário selecionado
- Indicador visual no header mostrando usuário monitorado
- Adicionar múltiplos usuários à lista
- Abrir janela separada para monitorar outro usuário simultaneamente
- Remover usuários da lista

### Personalização
- 3 temas: Padrão (gradiente roxo), Dark Mode, Light Mode
- Seletor de tema no menu de configurações
- Modo Focus (Cmd+Shift+F) - oculta tudo exceto números
- Slider de opacidade da janela (20% a 100%)
- Layouts:
  - Modo Vertical (padrão)
  - Modo Barra Horizontal (compacto)
- Densidade:
  - Compacto
  - Padrão
  - Confortável
- Temas customizáveis (modal de personalização)
- Cores de acento personalizadas

### Integração e Links Rápidos
- Botões para abrir:
  - OKTA (Nubank)
  - JAMF Cloud
  - Documentação L1 (Google Docs link configurável)
  - Documentação BPO (Google Docs link configurável)
  - MVE (Vivo)
  - Controle de SIMCARD (Google Sheets)

## 🛠️ Stack Tecnológico

- **Electron**: v25.9.8
- **Node.js**: v20 (via NVM)
- **electron-store**: v8.1.0 (armazenamento de configurações)
- **node-fetch**: v2.7.0 (chamadas HTTP)
- **form-data**: v4.0.0 (upload de anexos)

## 📁 Estrutura de Arquivos

```
jira-monitor/
├── package.json
├── package-lock.json
├── main.js                          # Processo principal do Electron
├── renderer.js                      # Lógica da interface (frontend)
├── jira-service.js                  # Serviço de integração com Jira API
├── index.html                       # Estrutura HTML da aplicação
├── styles.css                       # Estilos principais
├── ux-enhancements.css              # Estilos adicionais para UX
├── config.example.json              # Exemplo de configuração
├── start.sh                         # Script de inicialização com NVM
├── README.md                        # Documentação
├── ativar-inicio-automatico.sh      # Script macOS para auto-start
├── desativar-inicio-automatico.sh   # Script macOS para remover auto-start
└── assets/
    └── icon.png                     # Ícone da aplicação (opcional)
```

## 📦 package.json

```json
{
  "name": "jira-monitor",
  "version": "1.5.0",
  "description": "Monitor de tickets do Jira Service Desk em tempo real com Performance Dashboard e Timers",
  "main": "main.js",
  "scripts": {
    "start": "./start.sh",
    "dev": "./start.sh --dev",
    "build": "electron-builder --mac",
    "install:fresh": "rm -rf node_modules package-lock.json && npm install",
    "clean": "rm -rf dist build"
  },
  "keywords": [
    "jira",
    "monitor",
    "electron",
    "service-desk"
  ],
  "author": "Nubank",
  "license": "MIT",
  "dependencies": {
    "electron-store": "^8.1.0",
    "form-data": "^4.0.0",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "electron": "^25.9.8",
    "electron-builder": "^24.13.3"
  },
  "build": {
    "appId": "com.nubank.jiramonitor",
    "productName": "Jira Monitor",
    "files": [
      "**/*",
      "!**/*.md",
      "!dist/**/*",
      "!build/**/*",
      "!.git/**/*"
    ],
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
      ]
    }
  }
}
```

## ⌨️ Atalhos de Teclado Completos

### Principais
- `Cmd+K` ou `Ctrl+K` - Abrir busca rápida de tickets
- `Cmd+P` ou `Ctrl+P` - Alternar Modo Pro
- `Cmd+T` ou `Ctrl+T` - Abrir Timer/Pomodoro ⭐ NOVO v1.5.0
- `Cmd+L` ou `Ctrl+L` - Alternar layout (vertical/horizontal)
- `Cmd+R` ou `Ctrl+R` - Atualizar manualmente
- `Cmd+,` ou `Ctrl+,` - Abrir configurações
- `Cmd+Shift+F` ou `Ctrl+Shift+F` - Ativar/desativar Modo Focus
- `Cmd+E` ou `Ctrl+E` - Exportar relatório
- `Esc` - Fechar modais ou minimizar

### Numéricos (acesso rápido aos cards)
- `1` - Expandir/colapsar Total de Tickets
- `2` - Expandir/colapsar Waiting for Support
- `3` - Expandir/colapsar Waiting for Customer
- `4` - Expandir/colapsar Tickets Pending

### Busca Rápida
- `↑` `↓` - Navegar entre resultados
- `Enter` - Abrir ticket selecionado
- `Esc` - Fechar busca

## 🎨 Design System

### Cores (Tema Padrão)
- **Gradiente Principal**: #667eea → #764ba2
- **Card Background**: rgba(255, 255, 255, 0.95)
- **Header/Footer**: rgba(255, 255, 255, 0.15) com blur
- **Cards Específicos**:
  - Total: #3498db (azul)
  - Support: #f39c12 (laranja)
  - Customer: #2ecc71 (verde)
  - Pending: #9b59b6 (roxo)

### Tema Dark
- **Gradiente**: #1a1a2e → #16213e
- **Cards**: rgba(30, 30, 45, 0.95)

### Tema Light
- **Gradiente**: #f5f7fa → #c3cfe2
- **Cards**: rgba(255, 255, 255, 0.98)

### Animações
- Transitions suaves em 0.3s
- Hover effects com scale e shadow
- Skeleton loading com shimmer effect
- Toast notifications com slide-in
- Modal fade-in com backdrop blur

## 🔌 API do Jira

### Autenticação
- **Método**: Basic Auth
- **Header**: `Authorization: Basic base64(email:apiToken)`
- **Endpoint Base**: Configurável (ex: https://nubank.atlassian.net)

### Endpoints Usados
1. **Buscar Tickets**: `/rest/api/3/search/jql` (POST)
2. **Detalhes do Ticket**: `/rest/api/3/issue/{key}` (GET)
3. **Adicionar Comentário**: `/rest/api/3/issue/{key}/comment` (POST)
4. **Atualizar Ticket**: `/rest/api/3/issue/{key}` (PUT)
5. **Upload de Anexo**: `/rest/api/3/issue/{key}/attachments` (POST)
6. **Buscar Usuários**: `/rest/api/3/user/search` (GET)
7. **Prioridades**: `/rest/api/3/priority` (GET)
8. **Transições**: `/rest/api/3/issue/{key}/transitions` (GET)
9. **Usuário Atual**: `/rest/api/3/myself` (GET)
10. **Campos do Jira**: `/rest/api/3/field` (GET)
11. **⭐ Adicionar Worklog**: `/rest/api/3/issue/{key}/worklog` (POST) - v1.5.0
12. **⭐ Buscar Worklogs**: `/rest/api/3/issue/{key}/worklog` (GET) - v1.5.0

### JQL Queries Principais
- **Total IT**: `assignee = currentUser() AND resolution = Unresolved AND status NOT IN ("Cancelled", "Closed") AND project = IT`
- **Waiting for Support**: `assignee = currentUser() AND resolution = Unresolved AND status in ("Waiting for Support") AND project = IT`
- **Waiting for Customer**: `assignee = currentUser() AND resolution = Unresolved AND status in ("Waiting for Customer") AND project = IT`
- **Pending**: `assignee = currentUser() AND resolution = Unresolved AND status in ("Pending") AND project = IT`
- **Todos os Projetos**: `assignee = currentUser() AND resolution = Unresolved AND status NOT IN ("Cancelled", "Closed")`

### Formato ADF (Atlassian Document Format)
Comentários e descrições usam formato ADF (JSON estruturado):
```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Texto normal" },
        { "type": "mention", "attrs": { "id": "accountId", "text": "@Nome" } }
      ]
    }
  ]
}
```

## 📝 Configuração

### Arquivo de Configuração (electron-store)
O app usa `electron-store` que salva automaticamente em:
- **macOS**: `~/Library/Application Support/jira-monitor/config.json`
- **Windows**: `%APPDATA%/jira-monitor/config.json`
- **Linux**: `~/.config/jira-monitor/config.json`

### Campos de Configuração
```json
{
  "jiraUrl": "https://nubank.atlassian.net",
  "jiraEmail": "seu.email@empresa.com",
  "jiraApiToken": "SEU_API_TOKEN",
  "queueId": "1104",
  "refreshInterval": 60,
  "oldTicketsDays": 7,
  "alertSla": true,
  "alertOldTickets": true,
  "desktopNotifications": true,
  "soundNotifications": true,
  "notifyNewTickets": true,
  "notifyStatusChanges": true,
  "notifyReassignments": true,
  "notifyMentions": true,
  "proMode": false,
  "theme": "default",
  "monitorOtherUser": false,
  "otherUserEmail": "",
  "windowBounds": { "x": 100, "y": 100, "width": 420, "height": 700 },
  "windowOpacity": 1.0,
  "isHorizontalLayout": false,
  "focusMode": false,
  "accentColor": "#667eea",
  "themePreset": "default"
}
```

## 🔧 Funcionalidades Técnicas Específicas

### 1. Sistema de Notificações
- Detecta novos tickets comparando com snapshot anterior
- Detecta mudanças de status
- Detecta reatribuições
- Detecta menções em comentários
- Armazena histórico de notificações limpas
- Badge visual no ícone de notificações

### 2. Modo Pro - Atividade Diária
- Reset automático à meia-noite
- Contadores persistidos em localStorage
- Listas detalhadas de:
  - Tickets recebidos (com horário)
  - Tickets fechados (com horário)
  - Comentários feitos (com preview)

### 3. Preview de Tickets
- Modal fullscreen responsivo
- Loading states com skeleton
- Erro handling com retry
- Edição inline de campos
- Autocomplete para assignee/reporter (busca na API)
- Suporte a menções com @ trigger
- Upload de múltiplos arquivos
- Download de anexos
- Preview de imagens em modal separado

### 4. Cards Expansíveis
- Animação suave de expand/collapse
- Estado persistido durante a sessão
- Setas com animação de rotação
- Listas com scroll customizado
- Quick actions nos tickets (copiar, abrir)

### 5. Estatísticas por Projeto
- Agrupamento dinâmico de projetos
- Contadores por projeto
- Listas expansíveis de tickets por projeto
- Detecção automática de todos os projetos do usuário

### 6. Gráfico de Tendência
- 7 dias de histórico real
- Barras interativas com hover
- Tooltips com detalhes
- Animação de entrada
- Click para ver JQL da query

### 7. Drag & Drop
- Botões customizáveis arrastáveis
- Reordenação visual
- Salvamento automático da ordem
- Feedback visual durante drag

### 8. Temas e Personalização
- Sistema de variáveis CSS
- Troca de tema sem reload
- Preview em tempo real
- Persistência de preferências
- Slider de opacidade da janela
- Cores de acento customizadas

## 🎯 Requisitos Importantes

### 1. Janela Electron
- Frameless (sem borda nativa)
- Transparent background
- Always on top
- Resizable
- Draggable (via header)
- Lembra posição entre sessões

### 2. Performance
- Debounce em saves (300ms)
- Throttle em scroll events
- Lazy loading de listas grandes
- Virtual scrolling para 100+ tickets
- Cache de requests HTTP

### 3. Segurança
- API Token nunca exposto na UI
- Toggle password visibility
- Validação de inputs
- Sanitização de HTML (XSS protection)
- HTTPS obrigatório para Jira

### 4. UX
- Loading states em todas as ações
- Error handling com mensagens claras
- Confirmação para ações destrutivas
- Toast notifications para feedback
- Skeleton loading durante carregamento inicial
- Estados vazios com mensagens amigáveis

### 5. Acessibilidade
- Atalhos de teclado completos
- Focus visible em todos os elementos interativos
- Labels em todos os inputs
- ARIA labels onde necessário
- Navegação por Tab funcional

## 🚀 Instruções de Implementação

### Passo 1: Criar Estrutura Inicial
```bash
mkdir jira-monitor
cd jira-monitor
npm init -y
```

### Passo 2: Instalar Dependências
```bash
npm install electron@25.9.8 electron-store@8.1.0 node-fetch@2.7.0 form-data@4.0.0
npm install --save-dev electron-builder@24.13.3
```

### Passo 3: Criar Arquivos
Crie os seguintes arquivos com o conteúdo fornecido:
- `package.json` (já mostrado acima)
- `main.js` (processo principal do Electron)
- `renderer.js` (lógica do frontend)
- `jira-service.js` (integração com Jira)
- `index.html` (estrutura da UI)
- `styles.css` (estilos principais)
- `ux-enhancements.css` (estilos adicionais)
- `config.example.json` (exemplo de config)
- `start.sh` (script de inicialização)

### Passo 4: Implementar main.js
O arquivo `main.js` deve:
- Criar janela com `BrowserWindow` (frameless, transparent, alwaysOnTop)
- Configurar menu de contexto (cut, copy, paste, etc.)
- Criar tray icon
- Implementar IPC handlers para:
  - `get-config` / `save-config`
  - `fetch-jira-stats`
  - `get-ticket-details`
  - `add-comment` / `update-comment` / `delete-comment`
  - `select-and-upload-attachments`
  - `update-ticket-field`
  - `get-assignable-users`
  - `search-jira-tickets`
  - Etc.
- Salvar e restaurar posição da janela
- Handle de drag (no header)
- Função para abrir janelas secundárias (monitorar outro usuário)

### Passo 5: Implementar jira-service.js
Classe `JiraService` com métodos:
- `constructor(config)` - Inicializa com URL, email, API token
- `_makeRequest(endpoint, options)` - Método base para requisições HTTP
- `_searchJql(jql, fields)` - Buscar tickets via JQL
- `fetchStats()` - Buscar todas as estatísticas principais
- `getTicketDetails(ticketKey)` - Detalhes completos de um ticket
- `addComment(ticketKey, body, isInternal, mentions)` - Adicionar comentário
- `updateTicketField(ticketKey, fieldName, value)` - Atualizar campo
- `getAssignableUsers(projectKey)` - Buscar usuários assignáveis
- `searchUsers(query)` - Buscar usuários por nome/email
- `uploadAttachment(ticketKey, filePath)` - Upload de anexo
- `downloadAttachment(attachmentId)` - Download de anexo
- `getJiraPriorities()` - Buscar prioridades disponíveis
- `fetchMentions()` - Buscar tickets onde usuário foi mencionado
- `getRecentNotifications(maxResults)` - Buscar notificações recentes
- `_convertADFToHTML(content)` - Converter ADF para HTML
- `_getTrendData()` - Calcular tendência (últimos 7 dias)
- `_getSimCardsTickets()` - Buscar tickets de SIM cards (filtro 52128)
- `_getEvaluatedTickets()` - Buscar tickets avaliados (filtro 52358)
- `_getTodayUserComments()` - Contar comentários feitos hoje
- **⭐ v1.5.0 - Dashboard de Performance:**
  - `getPerformanceMetrics(days)` - Calcular métricas de performance (tempo médio, taxa, etc.)
- **⭐ v1.5.0 - Timer & Worklog:**
  - `addWorklog(ticketKey, timeSpentSeconds, comment, startedDate)` - Adicionar worklog ao ticket
  - `getWorklogs(ticketKey)` - Buscar worklogs de um ticket
- **⭐ v1.5.0 - Alertas Proativos:**
  - `getTicketsWithoutResponseSince(hours)` - Buscar tickets sem resposta há X horas
  - `getTicketsWithCriticalSLA(minutesBefore)` - Buscar tickets com SLA próximo do vencimento

### Passo 6: Implementar renderer.js
Funções principais:
- `loadConfig()` - Carregar configuração
- `fetchAndUpdateStats()` - Buscar e atualizar todas as estatísticas
- `updateUI(stats)` - Atualizar interface com dados
- `startAutoUpdate()` - Iniciar timer de atualização automática
- `showConfigPanel()` / `hideConfigPanel()` - Toggle de configurações
- `saveConfig()` - Salvar configuração
- `toggleProMode()` - Ativar/desativar modo pro
- `openTicketPreview(ticketKey)` - Abrir modal de preview
- `setupKeyboardShortcuts()` - Configurar todos os atalhos
- `showQuickSearch()` - Mostrar busca rápida
- `showNotifications()` - Mostrar painel de notificações
- `toggleFocusMode()` - Ativar/desativar modo focus
- `updateWindowOpacity(value)` - Ajustar opacidade
- `applyTheme(themeName)` - Aplicar tema
- `checkForNewTickets(newStats)` - Detectar novos tickets e notificar
- `sendDesktopNotification(title, body, icon)` - Enviar notificação nativa
- `updateDailyActivityDisplay()` - Atualizar contadores de atividade
- `setupDragAndDrop()` - Configurar drag & drop dos botões
- `expandCard(cardId)` - Expandir/colapsar card
- Listeners de eventos (clicks, hovers, etc.)
- **⭐ v1.5.0 - Dashboard de Performance:**
  - `loadPerformanceDashboard(days)` - Carregar e exibir métricas de performance
  - `generatePerformanceCharts(metrics)` - Gerar gráficos de pizza e heatmap
  - `generateSimplePieChart(canvasId, data, legendId)` - Renderizar gráfico de pizza com Canvas
  - `generateHeatmap(activityByHour)` - Renderizar heatmap de atividade por horário
  - `displayRecentResolved(tickets)` - Exibir lista de tickets resolvidos
- **⭐ v1.5.0 - Timer & Pomodoro:**
  - `showTimerWidget(ticketKey)` - Exibir widget do timer
  - `hideTimerWidget()` - Ocultar widget do timer
  - `minimizeTimerWidget()` - Minimizar widget para modo compacto
  - `restoreTimerWidget()` - Restaurar widget minimizado
  - `startTimer()` - Iniciar contagem do timer
  - `pauseTimer()` - Pausar timer
  - `stopTimer()` - Parar timer e retornar tempo total
  - `updateTimerDisplay()` - Atualizar display do tempo (HH:MM:SS)
  - `switchTimerMode(mode)` - Trocar entre Manual e Pomodoro
  - `updatePomodoroUI()` - Atualizar interface do Pomodoro
  - `completePomodoroSession()` - Finalizar sessão Pomodoro
  - `saveWorklog(timeSpentSeconds)` - Salvar worklog no Jira
  - `formatTime(seconds)` - Formatar segundos para HH:MM:SS
- **⭐ v1.5.0 - Alertas Proativos:**
  - `checkProactiveAlerts()` - Verificar todos os alertas (sem resposta, SLA, menções)
  - `startProactiveAlerts()` - Iniciar verificação automática a cada 5 minutos
  - `displayNoResponseAlert(tickets)` - Exibir alerta de tickets sem resposta
  - `displayCriticalSlaAlert(tickets)` - Exibir alerta de SLA crítico
  - `displayMentionsAlert(mentions)` - Exibir alerta de menções
  - `hideAlert(alertId)` - Ocultar alerta específico
  - `updateNoAlertsMessage()` - Atualizar mensagem "tudo tranquilo"

### Passo 7: Implementar index.html
Estrutura HTML:
- Header com:
  - Título "Jira Monitor"
  - Indicador de usuário monitorado
  - Botão de menu hambúrguer
  - Botão de notificações (com badge)
  - Botão de documentação
  - Botões de layout, densidade, minimize, close
- Container de busca rápida (toggle)
- Conteúdo principal:
  - Banner de erro (hidden por padrão)
  - Skeleton loading (hidden por padrão)
  - Grid de 4 cards de estatísticas
  - Seção Modo Pro (hidden por padrão):
    - Atividade de Hoje
    - Tickets de Telefonia
    - Tickets Avaliados
    - Estatísticas por Projeto
    - Tickets Recentes
    - Gráfico de Tendência
    - **⭐ v1.5.0:** Dashboard de Performance (expansível com gráficos)
    - **⭐ v1.5.0:** Alertas Proativos (cards de alerta interativos)
- Footer com:
  - Última atualização
  - Loading indicator
  - Botão de refresh
  - Barra de progresso
- Painel de configuração (modal)
- Modal de atalhos
- Modal de preview de tickets
- Modal de busca rápida
- Modal de temas customizáveis
- Modal de export
- Toast container
- Resize handle
- **⭐ v1.5.0:** Widget de Timer/Pomodoro (flutuante, arrastável, minimizável)
- **⭐ v1.5.0:** Timer minimizado (modo compacto)

### Passo 8: Implementar styles.css
Principais seções:
- Reset e variáveis de tema
- Glassmorphism effects
- Header e footer
- Cards de estatísticas
- Badges e alerts
- Listas de tickets
- Modais e overlays
- Formulários de configuração
- Animações e transitions
- Scrollbars customizadas
- Responsividade
- Estados (hover, active, disabled)
- Modo Pro styles
- Dark/Light theme overrides

### Passo 9: Implementar ux-enhancements.css
Estilos adicionais para:
- Busca rápida modal
- Histórico de atividade diária
- Modo Focus
- Campos editáveis no preview
- Autocomplete e mentions
- Links e menções formatados
- Slider de opacidade
- Modal de temas customizáveis
- Modal de atalhos customizáveis
- Modal de export
- Indicadores visuais de usuário monitorado
- Quick actions nos tickets
- Tooltips em gráficos
- Drag & drop visual feedback
- Cards de projeto expansíveis
- Modal de preview de anexos/imagens
- Cards de atividade diária animados
- Badges de prioridade
- Responsividade mobile

### Passo 10: Criar Scripts Auxiliares

#### start.sh (para macOS com NVM)
```bash
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20 > /dev/null 2>&1
exec "$(pwd)/node_modules/.bin/electron" "$(pwd)"
```

#### ativar-inicio-automatico.sh (macOS)
Criar arquivo `.plist` em `~/Library/LaunchAgents/` para auto-start.

#### config.example.json
Arquivo de exemplo com todas as configurações disponíveis.

### Passo 11: Criar Ícone (Opcional)
Criar ícone da aplicação em `assets/icon.png` (512x512px recomendado).

## ⚠️ Detalhes Críticos de Implementação

### 1. Salvamento de Estado
- Usar `beforeunload` para salvar estado antes de fechar
- Implementar `save-config-sync` IPC para salvamento síncrono
- Debounce de 300ms em salvamentos automáticos
- Salvar posição da janela em `move` e `resize` events

### 2. Detecção de Novos Tickets
- Manter `Set` de ticket keys do snapshot anterior
- Comparar com snapshot novo em cada update
- Detectar novos tickets (key não estava no Set anterior)
- Detectar mudanças de status (comparar estados)
- Enviar notificação desktop para cada novo/mudança

### 3. Sistema de Notificações
- Verificar permissão: `Notification.permission`
- Solicitar se necessário: `Notification.requestPermission()`
- Criar notificação: `new Notification(title, { body, icon })`
- Tocar som no macOS: `exec('afplay /System/Library/Sounds/Ping.aiff')`
- Badge no ícone de notificações com contador
- Painel dropdown com lista de notificações
- Botão "Limpar" para marcar como lidas
- Persistir histórico de notificações limpas

### 4. Cards Expansíveis
- Armazenar estado em variável global (não persistir)
- Toggle class `expanded` no botão
- Mostrar/ocultar `.tickets-list` com `display: none/block`
- Animar seta com `transform: rotate(180deg)`
- Buscar tickets ao expandir (se ainda não buscou)
- Loading state durante busca

### 5. Edição Inline de Campos
- Click no campo → trocar de display para edit mode
- Mostrar input/select apropriado
- Botões Salvar/Cancelar
- Autocomplete para usuários:
  - Debounce de 300ms no input
  - Buscar via `searchUsers(query)`
  - Dropdown com resultados
  - Select ao clicar
- Salvar via `updateTicketField(key, field, value)`
- Atualizar UI após salvar

### 6. Comentários com Menções
- Textarea com listener de `@` character
- Trigger autocomplete ao digitar `@`
- Buscar usuários com query após `@`
- Inserir menção no formato `@Nome`
- Converter para ADF ao enviar:
  ```json
  { "type": "mention", "attrs": { "id": "accountId", "text": "@Nome" } }
  ```
- Renderizar menções com span styled

### 7. Upload de Anexos
- Dialog do OS: `dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })`
- FormData com `fs.createReadStream(filePath)`
- Header: `X-Atlassian-Token: no-check`
- Enviar para `/rest/api/3/issue/{key}/attachments`
- Atualizar lista após upload

### 8. Download de Anexos
- Dialog do OS: `dialog.showSaveDialog({ defaultPath: filename })`
- Buscar via `/rest/api/3/attachment/content/{attachmentId}`
- Salvar buffer: `fs.writeFileSync(path, buffer)`

### 9. Preview de Imagens
- Detectar MIME type de imagem
- Criar modal fullscreen com overlay escuro
- Carregar imagem com autenticação Basic Auth
- Mostrar em `<img>` com max-width/height 95vh/vw
- Botão X para fechar
- Click fora da imagem para fechar

### 10. Gráfico de Tendência
- Buscar últimos 7 dias de tickets
- Calcular max value para escala
- Renderizar barras com height proporcional
- Hover para mostrar tooltip com valor
- Click para mostrar JQL da query
- Animação de entrada com stagger

## 🎨 Estilização Específica

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Gradientes
```css
/* Header/Footer */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Números dos Cards */
background: linear-gradient(135deg, #667eea, #764ba2);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Sombras
```css
/* Cards */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* Hover */
box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);

/* Modais */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
```

### Animações
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Down */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

## 🔐 Segurança

### API Token
- Nunca expor o token em logs
- Input type="password" com toggle de visibilidade
- Armazenar via electron-store (criptografado automaticamente)
- Enviar apenas no header Basic Auth

### XSS Protection
- Sanitizar HTML de comentários e descrições
- Usar `textContent` em vez de `innerHTML` quando possível
- Validar inputs de formulários
- Escapar caracteres especiais em queries

### HTTPS
- Forçar HTTPS para todas as requisições ao Jira
- Validar certificados SSL
- Não permitir conexões inseguras

## 📊 Métricas e Analytics (Opcional)

### Rastreamento Interno
- Contadores de uso de features
- Tempo de resposta de requests
- Erros e exceções
- Número de notificações enviadas
- Features mais usadas

### Logs
```javascript
console.log('📊 Stats updated:', { total, support, customer });
console.log('🔔 Notification sent:', { type, ticketKey });
console.log('⚠️ Error:', error.message);
```

## ✅ Checklist de Implementação

- [ ] Estrutura de arquivos criada
- [ ] Dependências instaladas
- [ ] main.js implementado com todos os IPC handlers
- [ ] jira-service.js implementado com todos os métodos
- [ ] renderer.js implementado com toda a lógica
- [ ] index.html com estrutura completa
- [ ] styles.css com todos os estilos
- [ ] ux-enhancements.css com estilos adicionais
- [ ] Sistema de configuração funcionando
- [ ] Busca de tickets funcionando
- [ ] Atualização automática funcionando
- [ ] Cards expansíveis funcionando
- [ ] Modo Pro implementado
- [ ] Sistema de notificações funcionando
- [ ] Preview de tickets funcionando
- [ ] Edição inline de campos funcionando
- [ ] Comentários com menções funcionando
- [ ] Upload/download de anexos funcionando
- [ ] Preview de imagens funcionando
- [ ] Monitoramento de outros usuários funcionando
- [ ] Busca rápida (Cmd+K) funcionando
- [ ] Todos os atalhos de teclado funcionando
- [ ] Sistema de temas funcionando
- [ ] Modo Focus funcionando
- [ ] Slider de opacidade funcionando
- [ ] Gráfico de tendência funcionando
- [ ] Atividade diária funcionando
- [ ] Drag & drop de botões funcionando
- [ ] Tray icon funcionando
- [ ] Persistência de estado funcionando
- [ ] Error handling em todas as ações
- [ ] Loading states em todas as ações
- [ ] Animações e transitions suaves
- [ ] Responsividade testada
- [ ] Performance otimizada
- [ ] Segurança validada
- **⭐ v1.5.0:**
- [ ] Dashboard de Performance funcionando
- [ ] Métricas calculadas corretamente
- [ ] Gráficos de pizza renderizando
- [ ] Heatmap de atividade funcionando
- [ ] Timer/Pomodoro funcionando
- [ ] Worklog sendo salvo no Jira
- [ ] Modo Pomodoro com sessões corretas
- [ ] Sons de notificação tocando
- [ ] Alertas Proativos detectando tickets
- [ ] Notificações desktop para alertas críticos
- [ ] Throttling de notificações funcionando
- [ ] Atalho Cmd+T abrindo timer

## 🧪 Testes Manuais

### Teste 1: Configuração Inicial
1. Abrir app pela primeira vez
2. Ver tela de configuração
3. Preencher campos (URL, email, API token)
4. Salvar
5. Verificar que conectou ao Jira
6. Verificar que mostra tickets

### Teste 2: Atualização Automática
1. Configurar intervalo de 60 segundos
2. Esperar 1 minuto
3. Verificar que atualizou (contador no footer)
4. Verificar barra de progresso

### Teste 3: Notificações
1. Criar novo ticket no Jira atribuído ao usuário
2. Esperar próxima atualização
3. Verificar notificação desktop
4. Verificar badge no ícone de notificações
5. Clicar no ícone e ver notificação na lista

### Teste 4: Preview de Ticket
1. Clicar em um ticket
2. Ver modal de preview
3. Verificar todos os campos
4. Editar um campo (ex: status)
5. Verificar que salvou
6. Adicionar comentário
7. Verificar que comentário foi adicionado
8. Upload anexo
9. Verificar que anexo foi adicionado

### Teste 5: Modo Pro
1. Ativar Modo Pro (Cmd+P)
2. Verificar seções adicionais apareceram
3. Verificar contadores de atividade diária
4. Verificar tickets de telefonia
5. Verificar estatísticas por projeto
6. Verificar gráfico de tendência

### Teste 6: Busca Rápida
1. Pressionar Cmd+K
2. Digitar key de ticket
3. Ver resultados
4. Navegar com ↑↓
5. Pressionar Enter
6. Verificar que abriu preview

### Teste 7: Monitoramento de Outro Usuário
1. Clicar no dropdown de usuário
2. Adicionar email de outro usuário
3. Selecionar o usuário
4. Verificar que mostra tickets desse usuário
5. Verificar indicador visual no header

### Teste 8: Temas
1. Abrir configurações
2. Trocar tema para Dark
3. Verificar que tema mudou
4. Trocar para Light
5. Verificar que tema mudou
6. Ajustar slider de opacidade
7. Verificar que opacidade mudou

### Teste 9: Persistência
1. Mover janela para nova posição
2. Redimensionar janela
3. Ativar Modo Pro
4. Trocar tema
5. Fechar app (Cmd+Q)
6. Reabrir app
7. Verificar que tudo foi restaurado

### Teste 10: Atalhos de Teclado
1. Testar todos os atalhos listados
2. Verificar que todos funcionam
3. Verificar feedback visual

### ⭐ Teste 11: Dashboard de Performance (v1.5.0)
1. Ativar Modo Pro (Cmd+P)
2. Rolar até "📊 Dashboard de Performance"
3. Clicar na seta para expandir
4. Verificar métricas resumidas (tempo médio, resolvidos, taxa)
5. Verificar gráficos de pizza renderizando
6. Verificar heatmap de atividade (células coloridas)
7. Passar mouse sobre célula do heatmap (ver tooltip)
8. Clicar em ticket da lista "Últimos 10 Resolvidos"
9. Verificar que abre preview
10. Clicar em "Atualizar Métricas"
11. Verificar que recarrega os dados

### ⭐ Teste 12: Timer & Pomodoro (v1.5.0)
1. Pressionar Cmd+T
2. Verificar que widget do timer abre
3. Clicar em "Manual" e depois "Pomodoro"
4. Verificar que modo muda
5. Clicar em "▶️ Iniciar"
6. Verificar que timer começa (00:00:01, 00:00:02...)
7. Clicar em "⏸️ Pausar"
8. Verificar que timer pausa
9. Clicar em "▶️ Iniciar" novamente
10. Clicar em "⏹️ Parar"
11. Verificar que timer para
12. Adicionar comentário no campo de worklog
13. Clicar em "💾 Salvar Worklog no Jira"
14. Verificar toast de sucesso
15. Clicar em "—" (minimizar)
16. Verificar timer minimizado no canto
17. Clicar no timer minimizado
18. Verificar que restaura

### ⭐ Teste 13: Alertas Proativos (v1.5.0)
1. Ativar Modo Pro (Cmd+P)
2. Rolar até "🔔 Alertas Proativos"
3. Se houver tickets sem resposta:
   - Verificar card laranja aparece
   - Verificar contador de alertas
   - Clicar em um ticket
   - Verificar que abre preview
4. Se houver SLA crítico:
   - Verificar card vermelho aparece
   - Verificar contador de minutos restantes
   - Verificar notificação desktop apareceu
   - Verificar som tocou
5. Se houver menções:
   - Verificar card azul aparece
   - Verificar lista de menções
6. Se não houver alertas:
   - Verificar mensagem "✨ Tudo tranquilo!"
7. Aguardar 5 minutos
8. Verificar que alertas atualizam automaticamente

## 📚 Documentação Adicional

Criar também estes arquivos de documentação:
- `README.md` - Documentação principal
- `CHANGELOG.md` - Histórico de versões
- `INSTALACAO.md` - Guia de instalação detalhado
- `COMO-USAR.md` - Guia de uso para usuários
- `TROUBLESHOOTING.md` - Solução de problemas comuns

## 🎉 Resultado Final

Após implementar tudo, você terá uma aplicação completa e profissional de monitoramento do Jira com:
- ✅ Interface moderna e responsiva
- ✅ Performance otimizada
- ✅ Experiência de usuário excelente
- ✅ Recursos avançados (Modo Pro)
- ✅ Personalização completa
- ✅ Notificações inteligentes
- ✅ Preview e edição de tickets
- ✅ Monitoramento de múltiplos usuários
- ✅ Estatísticas e analytics
- ✅ Atalhos de teclado produtivos
- ✅ Sistema de temas
- ✅ Persistência de estado
- **⭐ v1.5.0:**
- ✅ Dashboard de Performance com métricas detalhadas
- ✅ Gráficos interativos (pizza, heatmap)
- ✅ Timer/Pomodoro para rastreamento de tempo
- ✅ Worklog automático no Jira
- ✅ Alertas Proativos inteligentes
- ✅ Notificações com throttling
- ✅ 2500+ linhas de código adicionadas

---

## 📚 Documentação v1.5.0

Arquivos de documentação incluídos:
- **GUIA-v1.5.0.md** - Guia completo de uso das novas funcionalidades
- **README.md** - Documentação principal atualizada
- **CHANGELOG.md** - Histórico detalhado de versões
- **TROUBLESHOOTING.md** - Solução de problemas

---

**Importante**: Este prompt é completo e auto-suficiente. Você pode copiar e colar ele diretamente no Cursor para que a IA crie a aplicação completa do zero, arquivo por arquivo, exatamente como o original.

**Nota**: 
- Certifique-se de ter Node.js v20 instalado via NVM
- Permissões necessárias para notificações desktop no sistema operacional
- Para v1.5.0: Canvas API nativo do navegador (sem dependências extras)

## 🚀 Novidades v1.5.0

### O que mudou?
1. **+250 linhas** em `jira-service.js` (5 novos métodos)
2. **+70 linhas** em `main.js` (6 novos IPC handlers)
3. **+300 linhas** em `index.html` (3 novas seções)
4. **+800 linhas** em `styles.css` (estilos completos)
5. **+1080 linhas** em `renderer.js` (toda a lógica)

### Performance
- Cache inteligente de métricas
- Throttling de notificações (evita spam)
- Debounce em salvamentos
- Virtual scrolling para listas grandes

### Segurança
- Worklog com validação de tempo mínimo
- Sanitização de inputs
- Throttling de notificações críticas
- LocalStorage para cache temporário

**Total: 2500+ linhas de código adicionadas** 🎉

