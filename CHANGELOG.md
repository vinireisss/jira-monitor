# 📝 Changelog - Jira Monitor

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.6.2] - 2026-01-07

### ✨ Novo - Script de Instalação Automática

**🚀 Instalação com 1 Comando:**

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

**Recursos do Script:**
- ✅ Cria automaticamente a estrutura de diretórios `~/dev/nu/jira-monitor`
- ✅ Clona o repositório no caminho padrão correto
- ✅ Detecta e instala Node.js v20 via nvm (se necessário)
- ✅ Instala todas as dependências npm
- ✅ Opção de iniciar o app imediatamente
- ✅ Modo interativo com escolhas (SSH/HTTPS, atualizar/reinstalar, etc.)
- ✅ Validações de segurança e feedback colorido

**Decisões Inteligentes:**
- 🔍 Detecta se o projeto já existe e oferece atualizar
- 🔍 Verifica versão do Node.js e recomenda v20
- 🔍 Detecta node_modules existente e oferece reinstalar
- 🔍 Permite escolher entre clonagem SSH ou HTTPS

### 📚 Documentação Nova
- `install-auto.sh` - Script principal de instalação automática
- `INSTALL-AUTO-README.md` - Documentação completa do script
- `INSTALACAO-GIT.md` - Guia de instalação via Git (manual e automática)

### 📝 Documentação Atualizada
- `README.md` - Adicionada seção de instalação automática no topo
- `QUICK_START.md` - Instalação ultra-rápida com one-liner
- `INSTALACAO-GIT.md` - Reorganizada com instalação automática primeiro

### 🎯 Motivação
Facilitar a instalação para novos usuários, garantindo que o projeto seja sempre clonado no caminho correto (`~/dev/nu/jira-monitor`) e com todas as dependências configuradas automaticamente.

---

## [1.6.1] - 2025-12-31

### 🐛 Correções - Modo PRO com Usuário Monitorado

**Problema:** Ao monitorar outro usuário, algumas funcionalidades PRO ainda mostravam dados do usuário logado ao invés do usuário monitorado.

**Correções Implementadas:**

- **jira-service.js**
  - ✅ `getTicketsWithoutResponseSince()` - Agora verifica se o último comentário foi do usuário **monitorado** (não mais do usuário logado fixo)
  - ✅ `getRecentNotifications()` - Filtra notificações e menções do usuário **monitorado**
  - ✅ `_getTodayUserComments()` - Busca apenas comentários do usuário **monitorado**
  - ✅ Todas as comparações de email agora usam `userEmail` (monitorado ou logado)

- **Interface Visual**
  - ✅ Novo badge `👤 [Nome]` no **Dashboard de Performance** quando monitorando outro usuário
  - ✅ Novo badge `👤 [Nome]` nos **Alertas Proativos** quando monitorando outro usuário
  - ✅ Badges aparecem apenas quando `monitorOtherUser === true`
  - ✅ Estilo: fundo amarelo translúcido com borda, discreto mas visível

- **renderer.js**
  - ✅ Nova função `updateProMonitoredUserBadge()` para gerenciar badges
  - ✅ Badges atualizados ao carregar Dashboard e Alertas
  - ✅ Badges atualizados ao trocar de usuário monitorado
  - ✅ Integrado com `updateMonitoredUserIndicator()`

### 📁 Arquivos Novos
- `TESTE-MODO-PRO-USUARIO-MONITORADO.md` - Guia completo de testes e validação

### ✅ Validação

Todas as funcionalidades PRO agora respeitam corretamente o usuário monitorado:
- ✅ Dashboard de Performance (métricas, gráficos, tickets resolvidos)
- ✅ Alertas Proativos (sem resposta, SLA crítico, menções)
- ✅ Timer / Pomodoro (tickets do usuário monitorado)
- ✅ Notificações internas (sino)
- ✅ Indicadores visuais (badges)

### 🎯 Impacto

**Antes:** Ao monitorar João, o Dashboard mostrava suas métricas, mas os Alertas de "sem resposta" verificavam se **você** (usuário logado) tinha respondido.

**Depois:** Ao monitorar João, **TUDO** mostra dados de João - métricas, alertas, menções, comentários.

---

## [1.6.0] - 2025-12-31

### 🎨 UX Enhancements - Adicionado
- **🎉 Confetti Celebrations**
  - Animação de confetti ao completar/resolver tickets
  - Sistema de confetti puro em JavaScript (sem dependências)
  - Efeitos: basic, fireworks, burst
  - Som de celebração opcional
  - Integrado com sistema de preview de tickets
  
- **📋 Templates de Resposta Rápida**
  - Sistema completo de templates salvos
  - 4 templates padrão pré-configurados
  - Criar, editar e excluir templates personalizados
  - Variáveis dinâmicas: {{ticketKey}}, {{userName}}, {{date}}, {{time}}
  - Opção de comentário interno/público
  - Atalho: Cmd+Shift+T para acesso rápido
  - Aplicar template diretamente no campo de comentário
  - Copiar para clipboard se não estiver no preview
  
- **🌈 Cores por Prioridade**
  - Borda colorida em todos os tickets baseada na prioridade
  - Vermelho (Highest), Laranja (High), Azul (Medium), Verde (Low), Cinza (Lowest)
  - Badges visuais de prioridade
  - Aplicado em: listas de tickets, alertas, tickets resolvidos
  
- **🔍 Fuzzy Search**
  - Busca aproximada/inteligente de tickets
  - Melhor correspondência mesmo com erros de digitação
  - Score de relevância para ordenação de resultados
  - Busca em keys e summaries
  
- **✨ Micro-interações**
  - Estados vazios melhorados com ícones e mensagens
  - Animações suaves (fadeIn, slideUp)
  - Feedback visual aprimorado em todas as ações

### 📁 Arquivos Novos
- `confetti.js` - Sistema de confetti puro (144 linhas)

### 🔧 Técnico
- +500 linhas de CSS para novos componentes
- +400 linhas de JavaScript para lógica de templates
- LocalStorage para persistência de templates
- Event listeners para novos atalhos
- Item novo no menu hambúrguer

---

## [1.5.0] - 2025-12-31

### 🎉 Adicionado
- **📊 Dashboard de Performance** (Modo Pro)
  - Tempo médio de resolução de tickets
  - Taxa de fechamento (tickets/dia e tickets/semana)
  - Gráficos de pizza por tipo e prioridade
  - Gráficos de pizza por projeto
  - Heatmap de atividade (horários mais produtivos)
  - Lista dos últimos 10 tickets resolvidos
  - Botão de atualização manual das métricas
  - Análise de 30 dias de histórico
  
- **⏱️ Sistema de Timer & Pomodoro**
  - Timer manual para rastreamento de tempo
  - Modo Pomodoro (25min trabalho / 5min pausa / 15min pausa longa)
  - Display de tempo em formato HH:MM:SS
  - Controles: Iniciar, Pausar, Parar
  - Widget flutuante e arrastável
  - Modo minimizado com contador compacto
  - Registro automático de worklog no Jira
  - Campo de comentário para contexto do worklog
  - Opção de salvamento automático ao completar Pomodoro
  - Sons de notificação ao completar sessão
  - Contador de sessões Pomodoro (1-4)
  - Indicador de próxima ação (trabalho/pausa)
  
- **🔔 Alertas Proativos** (Modo Pro)
  - Alerta de tickets sem resposta há X horas (padrão: 4h)
  - Alerta de SLA crítico (15 minutos antes do vencimento)
  - Alerta de menções não lidas em comentários
  - Cards visuais com cores distintas (warning/danger/info)
  - Contador de alertas por categoria
  - Lista clicável de tickets em cada alerta
  - Notificações desktop automáticas
  - Mensagem "Tudo tranquilo" quando não há alertas
  - Verificação automática a cada 5 minutos
  - Throttling inteligente de notificações (evita spam)

### ✨ Melhorado
- **Modo Pro expandido** com 3 novas seções
- Sistema de notificações mais inteligente com alertas proativos
- Integração completa com Jira API para worklogs
- Performance otimizada com cache de métricas
- Animações suaves para novos componentes (slideInRight, slideInUp)
- UX aprimorada com feedback visual em tempo real

### 🔧 Técnico
- Novos IPC handlers: `get-performance-metrics`, `add-worklog`, `get-worklogs`, `get-tickets-without-response`, `get-tickets-critical-sla`
- Novos métodos no JiraService: `getPerformanceMetrics()`, `addWorklog()`, `getWorklogs()`, `getTicketsWithoutResponseSince()`, `getTicketsWithCriticalSLA()`
- 800+ linhas de CSS para novos componentes
- 1000+ linhas de JavaScript para lógica das novas features
- Canvas API para gráficos de pizza
- LocalStorage para throttling de notificações

### 📚 Documentação
- README atualizado com novas funcionalidades
- CHANGELOG completo para v1.5.0
- Comentários detalhados no código fonte

---

## [1.4.0] - 2025-12-19

### 🎉 Adicionado
- **Sistema completo de preview de tickets**
  - Visualizar detalhes completos do ticket sem sair do app
  - Informações: status, assignee, reporter, prioridade, datas
  - Descrição formatada (suporte a ADF do Jira)
  - Lista completa de comentários
  
- **Gerenciamento de comentários**
  - Adicionar comentários públicos ou internos
  - Editar comentários existentes (inline)
  - Excluir comentários
  - Menções de usuários (@usuario) com autocomplete
  - Formatação rica de comentários (links clicáveis, negrito, etc.)
  
- **Gerenciamento de anexos**
  - Visualizar lista de anexos com metadados
  - Preview automático de imagens (thumbnail 60x60px)
  - Modal de preview para imagens em tamanho maior
  - Download funcional de anexos com autenticação
  - Upload de múltiplos anexos simultâneos
  - Seletor de arquivos nativo do sistema
  
- **Edição de campos do ticket**
  - Editar status (com transições disponíveis)
  - Editar assignee (busca de usuários com autocomplete)
  - Editar reporter (busca de usuários com autocomplete)
  - Editar campos customizados (IT Ops Team, Support Level, etc.)
  - Autocomplete inteligente para campos customizados
  
- **Sistema de notificações com preview**
  - Botão de notificações no header com badge contador
  - Preview popup com últimas atividades
  - Menções em comentários detectadas automaticamente
  - Informações detalhadas (ticket, tipo, tempo decorrido)
  - Badges de comentário interno/público
  - Cache inteligente para preview instantâneo
  
- **Monitoramento de outros usuários**
  - Visualizar tickets de qualquer usuário do Jira
  - Checkbox nas configurações
  - Indicador visual no header
  - Todas as estatísticas adaptadas ao usuário monitorado
  - Persistência entre sessões
  
- **Busca rápida de tickets**
  - Campo de busca aparece com Cmd+K
  - Buscar por código (IT-1234), palavras-chave ou status
  - Resultados em tempo real
  - Abrir ticket diretamente no Jira ou preview
  
- **Modal de atalhos interativo**
  - Acesso via menu hambúrguer
  - Seções organizadas (Principais, Numéricos, Busca)
  - Teclas estilizadas
  - Animações suaves (fadeIn, slideUp)
  - Fechamento múltiplo (X, Esc, clique fora)

### ✨ Melhorado
- **Cards expansíveis com atualização em tempo real**
  - Botão de expansão em cada card
  - Lista completa de tickets ao expandir
  - Contadores atualizados automaticamente (mesmo expandidos)
  - Listas expandidas atualizadas a cada ciclo
  
- **Botões customizáveis**
  - Drag and drop funcional (reorganizar)
  - Edição inline (duplo clique)
  - Salvamento automático
  - Garantia de handles e ícones
  
- **Gráfico de tendência com dados reais**
  - Busca dados reais da API para cada dia
  - Números exatos acima de cada barra
  - Barras clicáveis (abrem Jira com JQL específico)
  - Histórico mantido localmente (30 dias)
  
- **Menu hambúrguer expandido**
  - Botão OKTA (abre OKTA)
  - Botão JAMF (abre JAMF)
  - Botão Busca Rápida
  - Botão Atalhos
  - Tooltips informativos
  
- **Badges visuais melhorados**
  - Melhor alinhamento
  - Qualidade visual superior
  - Animações pulsantes

### 🔧 Corrigido
- Correção na query JQL para não incluir "Fechado" (status inválido)
- Tickets Pending agora busca corretamente quando monitorando outro usuário
- SIM Cards agora inclui "Waiting for Customer" automaticamente
- Remoção de badges informativos dos botões Layout, Minimizar e Fechar
- Indicador de usuário monitorado atualiza corretamente

### 📚 Documentação
- README.md completo com todas as funcionalidades
- QUICK_START.md para início rápido
- COMANDOS.md com comandos úteis
- ESTRUTURA.md com arquitetura do projeto
- TROUBLESHOOTING.md com soluções para problemas comuns
- CHANGELOG.md para histórico de versões

---

## [1.3.0] - 2025-11-XX

### 🎉 Adicionado
- **Modo Pro** com recursos avançados
  - Documentação L1 (botão customizável)
  - Tickets de Telefonia SIM cards (contador e lista)
  - Estatísticas por projeto (IT, DCI, GTC)
  - Tickets recentes (últimos 5 atualizados)
  - Gráfico de tendência (7 dias)
- Botões editáveis e arrastáveis (drag and drop)
- Skeleton loading durante carregamento inicial

### ✨ Melhorado
- Interface mais organizada com seções
- Performance de carregamento
- Feedback visual melhorado

---

## [1.2.0] - 2025-10-XX

### 🎉 Adicionado
- Menu hambúrguer com dropdown
- Alertas de SLA próximo (1 hora antes)
- Alertas de tickets antigos (configurável)
- Sons automáticos nas notificações (macOS)
- Badges visuais nos cards (SLA e tickets antigos)

### ✨ Melhorado
- Sistema de notificações mais robusto
- Detecção inteligente de mudanças de status

---

## [1.1.0] - 2025-09-XX

### 🎉 Adicionado
- Modo barra horizontal (layout compacto)
- Lembrar posição e tamanho da janela
- Resize handle no canto inferior direito
- Validação de limites da tela

### ✨ Melhorado
- Responsividade entre layouts
- Salvamento automático de posição (debounce 500ms)

---

## [1.0.0] - 2025-08-XX

### 🎉 Lançamento Inicial
- Widget flutuante sempre visível
- Design com glassmorphism e gradiente roxo
- 4 contadores de tickets:
  - Total de tickets
  - Waiting for Support
  - Waiting for Customer
  - Tickets Pending
- Atualização automática configurável
- Refresh manual
- Cards clicáveis
- Notificações desktop
- Início automático (Launch Agent macOS)
- Integração com Jira API v3
- Autenticação Basic Auth
- Tray icon com menu contextual
- Painel de configuração completo
- Armazenamento seguro de credenciais
- Atalhos de teclado básicos

---

## Tipos de Mudanças

- `🎉 Adicionado` - Novas funcionalidades
- `✨ Melhorado` - Melhorias em funcionalidades existentes
- `🔧 Corrigido` - Correções de bugs
- `🗑️ Removido` - Funcionalidades removidas
- `🔒 Segurança` - Correções de segurança
- `📚 Documentação` - Apenas mudanças na documentação
- `🔨 Refatorado` - Refatoração de código
- `⚡ Performance` - Melhorias de performance
- `🎨 Visual` - Mudanças visuais/UI/UX

---

## Próximas Versões (Planejado)

### [1.5.0] - Futuro
- [ ] Temas personalizáveis (claro, escuro, roxo)
- [ ] Exportação de relatórios
- [ ] Filtros avançados personalizados
- [ ] Integração com Slack
- [ ] Widget para dashboard

### [2.0.0] - Futuro
- [ ] Suporte para Windows e Linux
- [ ] Múltiplas instâncias do Jira
- [ ] Dashboard web
- [ ] API REST própria
- [ ] Plugins extensíveis

---

**Para mais informações, consulte o [README.md](README.md).**

