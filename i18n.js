/**
 * 🌍 SISTEMA DE INTERNACIONALIZAÇÃO (i18n)
 * Sistema completo de tradução para Jira Monitor
 * Idiomas suportados: pt-BR, en (inglês), es (espanhol)
 */

const i18n = {
  // ========================================
  // 🇧🇷 PORTUGUÊS (PT-BR) - DEFAULT
  // ========================================
  'pt-BR': {
    // Header
    'app.title': 'Jira Monitor',
    'header.menu': 'Menu',
    'header.notifications': 'Notificações',
    'header.docs': 'Documentação',
    'header.minimize': 'Minimizar',
    'header.close': 'Fechar',
    
    // Menu Items
    'menu.proMode': '⭐ Modo Pro',
    'menu.refresh': '🔄 Atualizar',
    'menu.settings': '⚙️ Configurações',
    'menu.okta': '🔐 OKTA',
    'menu.jamf': '🍎 JAMF',
    'menu.search': '🔍 Busca Rápida',
    'menu.shortcuts': '⌨️ Atalhos',
    'menu.templates': '📋 Templates',
    'menu.timer': '⏱️ Timer / Pomodoro',
    'menu.focusMode': '🎯 Modo Focus',
    'menu.opacity': '🪟 Opacidade',
    'menu.themes': '🎨 Temas',
    'menu.language': '🌍 Idioma',
    'menu.export': '📄 Exportar',
    
    // User Monitor
    'user.monitor': 'Monitorar Usuário',
    'user.you': 'Você',
    'user.addAnother': 'Adicionar Outro Usuário...',
    
    // Stats Cards
    'stats.total': 'Total de Tickets - IT',
    'stats.support': 'Waiting for Support - IT',
    'stats.customer': 'Waiting for Customer - IT',
    'stats.pending': 'Tickets Pending - IT',
    'stats.expand': 'Expandir',
    'stats.sla': 'SLA',
    'stats.old': 'Antigos',
    
    // Pro Mode Sections
    'pro.dailyActivity': '📅 Atividade de Hoje',
    'pro.received': 'Recebidos',
    'pro.resolved': 'Fechados',
    'pro.commented': 'Atividade',
    'pro.comments': 'comentários',
    'pro.today': 'hoje',
    'pro.telefonia': '📱 Telefonia',
    'pro.simCards': 'Tickets SIM Cards',
    'pro.evaluated': '✅ Tickets Avaliados',
    'pro.lastEvaluated': 'Todos os Avaliados',
    'pro.byProject': '📊 Por Projeto',
    'pro.recentTickets': '🕐 Tickets Recentes',
    'pro.trend': '📈 Tendência (7 dias)',
    
    // Performance Dashboard
    'perf.title': '📊 Dashboard de Performance',
    'perf.avgTime': 'Tempo Médio',
    'perf.resolution': 'de resolução',
    'perf.resolved': 'Resolvidos',
    'perf.last30days': 'últimos 30 dias',
    'perf.perWeek': 'Por Semana',
    'perf.closeRate': 'taxa fechamento',
    'perf.byPriority': '🏷️ Por Prioridade',
    'perf.byProject': '📦 Por Projeto',
    'perf.heatmap': '🔥 Heatmap de Atividade',
    'perf.productive': 'Horários mais produtivos (últimos 30 dias)',
    'perf.last10': '📋 Últimos 10 Resolvidos',
    'perf.updateMetrics': 'Atualizar Métricas',
    
    // Proactive Alerts
    'alerts.title': '🔔 Alertas Proativos',
    'alerts.noResponse': 'Tickets sem resposta',
    'alerts.criticalSla': 'SLA Crítico',
    'alerts.mentions': 'Menções em comentários',
    'alerts.allClear': 'Tudo tranquilo! Nenhum alerta no momento.',
    
    // Timer Widget
    'timer.title': 'Timer',
    'timer.minimize': 'Minimizar',
    'timer.close': 'Fechar',
    'timer.manual': 'Manual',
    'timer.pomodoro': 'Pomodoro',
    'timer.start': 'Iniciar',
    'timer.pause': 'Pausar',
    'timer.stop': 'Parar',
    'timer.session': 'Sessão:',
    'timer.next': 'Próximo:',
    'timer.break': 'Pausa',
    'timer.worklogComment': 'Comentário do worklog (opcional)...',
    'timer.autoSave': 'Salvar worklog automaticamente',
    'timer.saveWorklog': 'Salvar Worklog no Jira',
    
    // Search
    'search.placeholder': 'Buscar ticket (ex: IT-1234) ou palavras-chave...',
    'search.quickSearch': '🔍 Buscar ticket por key, summary ou projeto...',
    'search.hint': '↑↓ para navegar • Enter para abrir • Esc para fechar',
    
    // Templates
    'templates.title': '📋 Templates de Resposta',
    'templates.create': 'Criar Novo Template',
    'templates.edit': '✏️ Editar Template',
    'templates.name': 'Nome do Template:',
    'templates.text': 'Texto:',
    'templates.internal': 'Comentário interno (visível apenas para equipe)',
    'templates.cancel': 'Cancelar',
    'templates.save': 'Salvar Template',
    'templates.hint': 'Clique em um template para usar • Cmd+Shift+T para abrir',
    
    // Notifications
    'notifications.title': 'Notificações',
    'notifications.viewAll': 'Ver Todas',
    'notifications.clear': 'Limpar',
    'notifications.reset': '🔄 Resetar',
    
    // Documentation
    'docs.title': '📚 Documentação',
    'docs.l1': 'Documentação L1',
    'docs.bpo': 'Documentação BPO',
    
    // Daily Activity
    'daily.title': '📊 Atividade de Hoje',
    'daily.new': 'Novos',
    'daily.closed': 'Fechados',
    'daily.updated': 'Atualizados',
    'daily.receivedTitle': '🆕 Tickets Recebidos Hoje',
    'daily.resolvedTitle': '✅ Tickets Fechados Hoje',
    'daily.commentsTitle': '💬 Comentários de Hoje',
    'daily.noReceived': 'Nenhum ticket recebido hoje',
    'daily.noResolved': 'Nenhum ticket fechado hoje',
    'daily.noComments': 'Nenhum comentário hoje',
    
    // Theme Customizer
    'theme.title': '🎨 Personalizar Tema',
    'theme.accent': 'Cor de Acento:',
    'theme.presets': 'Temas Pré-definidos:',
    'theme.default': 'Padrão',
    'theme.cyberpunk': 'Cyberpunk',
    'theme.nord': 'Nord',
    'theme.dracula': 'Dracula',
    
    // Shortcuts
    'shortcuts.title': '⌨️ Atalhos de Teclado',
    'shortcuts.main': '🚀 Atalhos Principais',
    'shortcuts.openSearch': '🔍 Abrir busca rápida de tickets',
    'shortcuts.togglePro': '⭐ Alternar Modo Pro',
    'shortcuts.toggleLayout': '🔄 Alternar layout (vertical/horizontal)',
    'shortcuts.refresh': '🔄 Atualizar manualmente',
    'shortcuts.openSettings': '⚙️ Abrir configurações',
    'shortcuts.close': '❌ Fechar modais ou minimizar',
    'shortcuts.newFeatures': '✨ Novos Recursos UX',
    'shortcuts.focusMode': '🎯 Ativar/desativar Modo Focus',
    'shortcuts.export': '📄 Exportar relatório',
    'shortcuts.numeric': '🔢 Atalhos Numéricos',
    'shortcuts.card1': '📊 Abrir card Total de Tickets',
    'shortcuts.card2': '🔧 Abrir card Waiting for Support',
    'shortcuts.card3': '👤 Abrir card Waiting for Customer',
    'shortcuts.card4': '⏸️ Abrir card Tickets Pending',
    'shortcuts.searchSection': '🔍 Busca Rápida',
    'shortcuts.navigate': 'Navegar entre resultados',
    'shortcuts.open': 'Abrir ticket selecionado',
    'shortcuts.tips': '💡 Dicas',
    
    // Export
    'export.title': '📄 Exportar Relatório',
    'export.period': 'Período:',
    'export.format': 'Formato:',
    'export.include': 'Incluir:',
    'export.stats': 'Estatísticas',
    'export.tickets': 'Lista de Tickets',
    'export.trend': 'Gráfico de Tendência',
    'export.download': '📥 Baixar Relatório',
    'export.today': 'Hoje',
    'export.week': 'Esta Semana',
    'export.month': 'Este Mês',
    
    // Settings
    'settings.title': '⚙️ Configurações',
    'settings.jiraUrl': 'URL do Jira',
    'settings.email': 'Email',
    'settings.apiToken': 'API Token',
    'settings.createApiToken': '🔗 Crie seu API token do Jira aqui',
    'settings.queueId': 'ID da Fila',
    'settings.refreshInterval': 'Intervalo de Atualização (segundos)',
    'settings.oldTicketsDays': 'Dias sem atualização para alertar',
    'settings.alertSla': 'Alertar sobre SLA próximo (1 hora antes)',
    'settings.alertOld': 'Alertar sobre tickets antigos',
    'settings.desktopNotifications': '🔔 Notificações desktop',
    'settings.test': 'Testar',
    'settings.notifyNew': '🎫 Novos tickets atribuídos',
    'settings.notifyStatus': '🔄 Mudanças de status',
    'settings.notifyReassign': '👤 Reatribuições para você',
    'settings.notifyMentions': '📢 Quando você for mencionado',
    'settings.soundNotifications': '🔊 Tocar som nas notificações',
    'settings.proMode': '⭐ Modo Pro',
    'settings.theme': '🎨 Tema da Aplicação',
    'settings.themeDefault': '🎨 Padrão (Gradiente Roxo)',
    'settings.themeDark': '🌙 Escuro (Dark Mode)',
    'settings.themeLight': '☀️ Claro (Light Mode)',
    'settings.language': '🌍 Idioma',
    'settings.save': 'Salvar',
    'settings.cancel': 'Cancelar',
    
    // Footer
    'footer.loading': 'Carregando...',
    'footer.refresh': 'Atualizar',
    'footer.lastUpdate': 'Última atualização',
    
    // Error Messages
    'error.connection': 'Erro de Conexão',
    'error.noConnection': 'Não foi possível conectar ao Jira',
    'error.retry': 'Tentar Novamente',
    'error.loading': 'Erro ao carregar ticket',
    
    // Buttons
    'btn.close': 'Fechar',
    'btn.save': 'Salvar',
    'btn.cancel': 'Cancelar',
    'btn.confirm': 'Confirmar',
    'btn.add': 'Adicionar',
    'btn.edit': 'Editar',
    'btn.delete': 'Deletar',
    'btn.retry': 'Tentar Novamente',
    
    // Add User Modal
    'addUser.title': '➕ Adicionar Usuário para Monitorar',
    'addUser.description': 'Digite o e-mail do usuário que deseja monitorar:',
    'addUser.placeholder': 'exemplo@nubank.com.br',
    'addUser.cancel': 'Cancelar',
    'addUser.add': 'Adicionar',
    
    // Context Menu
    'context.back': '⬅️ Voltar',
    'context.forward': '➡️ Avançar',
    'context.reload': '🔄 Recarregar',
    'context.cut': '✂️ Recortar',
    'context.copy': '📋 Copiar',
    'context.paste': '📄 Colar',
    'context.delete': '🗑️ Deletar',
    'context.selectAll': '🔍 Selecionar Tudo',
    'context.copyLink': '🔗 Copiar Link',
    'context.copyImage': '🖼️ Copiar Imagem',
    'context.openExternal': '🌐 Abrir Link em Navegador Externo',
    'context.inspect': '🔧 Inspecionar Elemento'
  },
  
  // ========================================
  // 🇺🇸 ENGLISH
  // ========================================
  'en': {
    // Header
    'app.title': 'Jira Monitor',
    'header.menu': 'Menu',
    'header.notifications': 'Notifications',
    'header.docs': 'Documentation',
    'header.minimize': 'Minimize',
    'header.close': 'Close',
    
    // Menu Items
    'menu.proMode': '⭐ Pro Mode',
    'menu.refresh': '🔄 Refresh',
    'menu.settings': '⚙️ Settings',
    'menu.okta': '🔐 OKTA',
    'menu.jamf': '🍎 JAMF',
    'menu.search': '🔍 Quick Search',
    'menu.shortcuts': '⌨️ Shortcuts',
    'menu.templates': '📋 Templates',
    'menu.timer': '⏱️ Timer / Pomodoro',
    'menu.focusMode': '🎯 Focus Mode',
    'menu.opacity': '🪟 Opacity',
    'menu.themes': '🎨 Themes',
    'menu.language': '🌍 Language',
    'menu.export': '📄 Export',
    
    // User Monitor
    'user.monitor': 'Monitor User',
    'user.you': 'You',
    'user.addAnother': 'Add Another User...',
    
    // Stats Cards
    'stats.total': 'Total Tickets - IT',
    'stats.support': 'Waiting for Support - IT',
    'stats.customer': 'Waiting for Customer - IT',
    'stats.pending': 'Tickets Pending - IT',
    'stats.expand': 'Expand',
    'stats.sla': 'SLA',
    'stats.old': 'Old',
    
    // Pro Mode Sections
    'pro.dailyActivity': '📅 Today\'s Activity',
    'pro.received': 'Received',
    'pro.resolved': 'Resolved',
    'pro.commented': 'Activity',
    'pro.comments': 'comments',
    'pro.today': 'today',
    'pro.telefonia': '📱 Telephony',
    'pro.simCards': 'SIM Cards Tickets',
    'pro.evaluated': '✅ Evaluated Tickets',
    'pro.lastEvaluated': 'All Evaluated',
    'pro.byProject': '📊 By Project',
    'pro.recentTickets': '🕐 Recent Tickets',
    'pro.trend': '📈 Trend (7 days)',
    
    // Performance Dashboard
    'perf.title': '📊 Performance Dashboard',
    'perf.avgTime': 'Average Time',
    'perf.resolution': 'to resolution',
    'perf.resolved': 'Resolved',
    'perf.last30days': 'last 30 days',
    'perf.perWeek': 'Per Week',
    'perf.closeRate': 'close rate',
    'perf.byPriority': '🏷️ By Priority',
    'perf.byProject': '📦 By Project',
    'perf.heatmap': '🔥 Activity Heatmap',
    'perf.productive': 'Most productive hours (last 30 days)',
    'perf.last10': '📋 Last 10 Resolved',
    'perf.updateMetrics': 'Update Metrics',
    
    // Proactive Alerts
    'alerts.title': '🔔 Proactive Alerts',
    'alerts.noResponse': 'Tickets without response',
    'alerts.criticalSla': 'Critical SLA',
    'alerts.mentions': 'Mentions in comments',
    'alerts.allClear': 'All clear! No alerts at this time.',
    
    // Timer Widget
    'timer.title': 'Timer',
    'timer.minimize': 'Minimize',
    'timer.close': 'Close',
    'timer.manual': 'Manual',
    'timer.pomodoro': 'Pomodoro',
    'timer.start': 'Start',
    'timer.pause': 'Pause',
    'timer.stop': 'Stop',
    'timer.session': 'Session:',
    'timer.next': 'Next:',
    'timer.break': 'Break',
    'timer.worklogComment': 'Worklog comment (optional)...',
    'timer.autoSave': 'Save worklog automatically',
    'timer.saveWorklog': 'Save Worklog to Jira',
    
    // Search
    'search.placeholder': 'Search ticket (e.g.: IT-1234) or keywords...',
    'search.quickSearch': '🔍 Search ticket by key, summary or project...',
    'search.hint': '↑↓ to navigate • Enter to open • Esc to close',
    
    // Templates
    'templates.title': '📋 Response Templates',
    'templates.create': 'Create New Template',
    'templates.edit': '✏️ Edit Template',
    'templates.name': 'Template Name:',
    'templates.text': 'Text:',
    'templates.internal': 'Internal comment (visible to team only)',
    'templates.cancel': 'Cancel',
    'templates.save': 'Save Template',
    'templates.hint': 'Click on a template to use • Cmd+Shift+T to open',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.viewAll': 'View All',
    'notifications.clear': 'Clear',
    'notifications.reset': '🔄 Reset',
    
    // Documentation
    'docs.title': '📚 Documentation',
    'docs.l1': 'L1 Documentation',
    'docs.bpo': 'BPO Documentation',
    
    // Daily Activity
    'daily.title': '📊 Today\'s Activity',
    'daily.new': 'New',
    'daily.closed': 'Closed',
    'daily.updated': 'Updated',
    'daily.receivedTitle': '🆕 Tickets Received Today',
    'daily.resolvedTitle': '✅ Tickets Closed Today',
    'daily.commentsTitle': '💬 Today\'s Comments',
    'daily.noReceived': 'No tickets received today',
    'daily.noResolved': 'No tickets closed today',
    'daily.noComments': 'No comments today',
    
    // Theme Customizer
    'theme.title': '🎨 Customize Theme',
    'theme.accent': 'Accent Color:',
    'theme.presets': 'Predefined Themes:',
    'theme.default': 'Default',
    'theme.cyberpunk': 'Cyberpunk',
    'theme.nord': 'Nord',
    'theme.dracula': 'Dracula',
    
    // Shortcuts
    'shortcuts.title': '⌨️ Keyboard Shortcuts',
    'shortcuts.main': '🚀 Main Shortcuts',
    'shortcuts.openSearch': '🔍 Open quick ticket search',
    'shortcuts.togglePro': '⭐ Toggle Pro Mode',
    'shortcuts.toggleLayout': '🔄 Toggle layout (vertical/horizontal)',
    'shortcuts.refresh': '🔄 Refresh manually',
    'shortcuts.openSettings': '⚙️ Open settings',
    'shortcuts.close': '❌ Close modals or minimize',
    'shortcuts.newFeatures': '✨ New UX Features',
    'shortcuts.focusMode': '🎯 Enable/disable Focus Mode',
    'shortcuts.export': '📄 Export report',
    'shortcuts.numeric': '🔢 Numeric Shortcuts',
    'shortcuts.card1': '📊 Open Total Tickets card',
    'shortcuts.card2': '🔧 Open Waiting for Support card',
    'shortcuts.card3': '👤 Open Waiting for Customer card',
    'shortcuts.card4': '⏸️ Open Tickets Pending card',
    'shortcuts.searchSection': '🔍 Quick Search',
    'shortcuts.navigate': 'Navigate between results',
    'shortcuts.open': 'Open selected ticket',
    'shortcuts.tips': '💡 Tips',
    
    // Export
    'export.title': '📄 Export Report',
    'export.period': 'Period:',
    'export.format': 'Format:',
    'export.include': 'Include:',
    'export.stats': 'Statistics',
    'export.tickets': 'Ticket List',
    'export.trend': 'Trend Chart',
    'export.download': '📥 Download Report',
    'export.today': 'Today',
    'export.week': 'This Week',
    'export.month': 'This Month',
    
    // Settings
    'settings.title': '⚙️ Settings',
    'settings.jiraUrl': 'Jira URL',
    'settings.email': 'Email',
    'settings.apiToken': 'API Token',
    'settings.createApiToken': '🔗 Create your Jira API token here',
    'settings.queueId': 'Queue ID',
    'settings.refreshInterval': 'Refresh Interval (seconds)',
    'settings.oldTicketsDays': 'Days without update to alert',
    'settings.alertSla': 'Alert about upcoming SLA (1 hour before)',
    'settings.alertOld': 'Alert about old tickets',
    'settings.desktopNotifications': '🔔 Desktop notifications',
    'settings.test': 'Test',
    'settings.notifyNew': '🎫 New assigned tickets',
    'settings.notifyStatus': '🔄 Status changes',
    'settings.notifyReassign': '👤 Reassignments to you',
    'settings.notifyMentions': '📢 When you are mentioned',
    'settings.soundNotifications': '🔊 Play sound on notifications',
    'settings.proMode': '⭐ Pro Mode',
    'settings.theme': '🎨 Application Theme',
    'settings.themeDefault': '🎨 Default (Purple Gradient)',
    'settings.themeDark': '🌙 Dark (Dark Mode)',
    'settings.themeLight': '☀️ Light (Light Mode)',
    'settings.language': '🌍 Language',
    'settings.save': 'Save',
    'settings.cancel': 'Cancel',
    
    // Footer
    'footer.loading': 'Loading...',
    'footer.refresh': 'Refresh',
    'footer.lastUpdate': 'Last update',
    
    // Error Messages
    'error.connection': 'Connection Error',
    'error.noConnection': 'Could not connect to Jira',
    'error.retry': 'Try Again',
    'error.loading': 'Error loading ticket',
    
    // Buttons
    'btn.close': 'Close',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.confirm': 'Confirm',
    'btn.add': 'Add',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.retry': 'Try Again',
    
    // Add User Modal
    'addUser.title': '➕ Add User to Monitor',
    'addUser.description': 'Enter the email of the user you want to monitor:',
    'addUser.placeholder': 'example@nubank.com.br',
    'addUser.cancel': 'Cancel',
    'addUser.add': 'Add',
    
    // Context Menu
    'context.back': '⬅️ Back',
    'context.forward': '➡️ Forward',
    'context.reload': '🔄 Reload',
    'context.cut': '✂️ Cut',
    'context.copy': '📋 Copy',
    'context.paste': '📄 Paste',
    'context.delete': '🗑️ Delete',
    'context.selectAll': '🔍 Select All',
    'context.copyLink': '🔗 Copy Link',
    'context.copyImage': '🖼️ Copy Image',
    'context.openExternal': '🌐 Open Link in External Browser',
    'context.inspect': '🔧 Inspect Element'
  },
  
  // ========================================
  // 🇪🇸 ESPAÑOL
  // ========================================
  'es': {
    // Header
    'app.title': 'Jira Monitor',
    'header.menu': 'Menú',
    'header.notifications': 'Notificaciones',
    'header.docs': 'Documentación',
    'header.minimize': 'Minimizar',
    'header.close': 'Cerrar',
    
    // Menu Items
    'menu.proMode': '⭐ Modo Pro',
    'menu.refresh': '🔄 Actualizar',
    'menu.settings': '⚙️ Configuración',
    'menu.okta': '🔐 OKTA',
    'menu.jamf': '🍎 JAMF',
    'menu.search': '🔍 Búsqueda Rápida',
    'menu.shortcuts': '⌨️ Atajos',
    'menu.templates': '📋 Plantillas',
    'menu.timer': '⏱️ Timer / Pomodoro',
    'menu.focusMode': '🎯 Modo Foco',
    'menu.opacity': '🪟 Opacidad',
    'menu.themes': '🎨 Temas',
    'menu.language': '🌍 Idioma',
    'menu.export': '📄 Exportar',
    
    // User Monitor
    'user.monitor': 'Monitorear Usuario',
    'user.you': 'Tú',
    'user.addAnother': 'Agregar Otro Usuario...',
    
    // Stats Cards
    'stats.total': 'Total de Tickets - IT',
    'stats.support': 'Esperando Soporte - IT',
    'stats.customer': 'Esperando Cliente - IT',
    'stats.pending': 'Tickets Pendientes - IT',
    'stats.expand': 'Expandir',
    'stats.sla': 'SLA',
    'stats.old': 'Antiguos',
    
    // Pro Mode Sections
    'pro.dailyActivity': '📅 Actividad de Hoy',
    'pro.received': 'Recibidos',
    'pro.resolved': 'Cerrados',
    'pro.commented': 'Actividad',
    'pro.comments': 'comentarios',
    'pro.today': 'hoy',
    'pro.telefonia': '📱 Telefonía',
    'pro.simCards': 'Tickets SIM Cards',
    'pro.evaluated': '✅ Tickets Evaluados',
    'pro.lastEvaluated': 'Todos los Evaluados',
    'pro.byProject': '📊 Por Proyecto',
    'pro.recentTickets': '🕐 Tickets Recientes',
    'pro.trend': '📈 Tendencia (7 días)',
    
    // Performance Dashboard
    'perf.title': '📊 Panel de Rendimiento',
    'perf.avgTime': 'Tiempo Promedio',
    'perf.resolution': 'de resolución',
    'perf.resolved': 'Resueltos',
    'perf.last30days': 'últimos 30 días',
    'perf.perWeek': 'Por Semana',
    'perf.closeRate': 'tasa de cierre',
    'perf.byPriority': '🏷️ Por Prioridad',
    'perf.byProject': '📦 Por Proyecto',
    'perf.heatmap': '🔥 Mapa de Calor de Actividad',
    'perf.productive': 'Horarios más productivos (últimos 30 días)',
    'perf.last10': '📋 Últimos 10 Resueltos',
    'perf.updateMetrics': 'Actualizar Métricas',
    
    // Proactive Alerts
    'alerts.title': '🔔 Alertas Proactivas',
    'alerts.noResponse': 'Tickets sin respuesta',
    'alerts.criticalSla': 'SLA Crítico',
    'alerts.mentions': 'Menciones en comentarios',
    'alerts.allClear': '¡Todo tranquilo! No hay alertas en este momento.',
    
    // Timer Widget
    'timer.title': 'Temporizador',
    'timer.minimize': 'Minimizar',
    'timer.close': 'Cerrar',
    'timer.manual': 'Manual',
    'timer.pomodoro': 'Pomodoro',
    'timer.start': 'Iniciar',
    'timer.pause': 'Pausar',
    'timer.stop': 'Parar',
    'timer.session': 'Sesión:',
    'timer.next': 'Siguiente:',
    'timer.break': 'Pausa',
    'timer.worklogComment': 'Comentario del worklog (opcional)...',
    'timer.autoSave': 'Guardar worklog automáticamente',
    'timer.saveWorklog': 'Guardar Worklog en Jira',
    
    // Search
    'search.placeholder': 'Buscar ticket (ej: IT-1234) o palabras clave...',
    'search.quickSearch': '🔍 Buscar ticket por clave, resumen o proyecto...',
    'search.hint': '↑↓ para navegar • Enter para abrir • Esc para cerrar',
    
    // Templates
    'templates.title': '📋 Plantillas de Respuesta',
    'templates.create': 'Crear Nueva Plantilla',
    'templates.edit': '✏️ Editar Plantilla',
    'templates.name': 'Nombre de la Plantilla:',
    'templates.text': 'Texto:',
    'templates.internal': 'Comentario interno (visible solo para el equipo)',
    'templates.cancel': 'Cancelar',
    'templates.save': 'Guardar Plantilla',
    'templates.hint': 'Haz clic en una plantilla para usar • Cmd+Shift+T para abrir',
    
    // Notifications
    'notifications.title': 'Notificaciones',
    'notifications.viewAll': 'Ver Todas',
    'notifications.clear': 'Limpiar',
    'notifications.reset': '🔄 Resetear',
    
    // Documentation
    'docs.title': '📚 Documentación',
    'docs.l1': 'Documentación L1',
    'docs.bpo': 'Documentación BPO',
    
    // Daily Activity
    'daily.title': '📊 Actividad de Hoy',
    'daily.new': 'Nuevos',
    'daily.closed': 'Cerrados',
    'daily.updated': 'Actualizados',
    'daily.receivedTitle': '🆕 Tickets Recibidos Hoy',
    'daily.resolvedTitle': '✅ Tickets Cerrados Hoy',
    'daily.commentsTitle': '💬 Comentarios de Hoy',
    'daily.noReceived': 'No hay tickets recibidos hoy',
    'daily.noResolved': 'No hay tickets cerrados hoy',
    'daily.noComments': 'No hay comentarios hoy',
    
    // Theme Customizer
    'theme.title': '🎨 Personalizar Tema',
    'theme.accent': 'Color de Acento:',
    'theme.presets': 'Temas Predefinidos:',
    'theme.default': 'Predeterminado',
    'theme.cyberpunk': 'Cyberpunk',
    'theme.nord': 'Nord',
    'theme.dracula': 'Dracula',
    
    // Shortcuts
    'shortcuts.title': '⌨️ Atajos de Teclado',
    'shortcuts.main': '🚀 Atajos Principales',
    'shortcuts.openSearch': '🔍 Abrir búsqueda rápida de tickets',
    'shortcuts.togglePro': '⭐ Alternar Modo Pro',
    'shortcuts.toggleLayout': '🔄 Alternar diseño (vertical/horizontal)',
    'shortcuts.refresh': '🔄 Actualizar manualmente',
    'shortcuts.openSettings': '⚙️ Abrir configuración',
    'shortcuts.close': '❌ Cerrar modales o minimizar',
    'shortcuts.newFeatures': '✨ Nuevas Características UX',
    'shortcuts.focusMode': '🎯 Activar/desactivar Modo Foco',
    'shortcuts.export': '📄 Exportar informe',
    'shortcuts.numeric': '🔢 Atajos Numéricos',
    'shortcuts.card1': '📊 Abrir tarjeta Total de Tickets',
    'shortcuts.card2': '🔧 Abrir tarjeta Esperando Soporte',
    'shortcuts.card3': '👤 Abrir tarjeta Esperando Cliente',
    'shortcuts.card4': '⏸️ Abrir tarjeta Tickets Pendientes',
    'shortcuts.searchSection': '🔍 Búsqueda Rápida',
    'shortcuts.navigate': 'Navegar entre resultados',
    'shortcuts.open': 'Abrir ticket seleccionado',
    'shortcuts.tips': '💡 Consejos',
    
    // Export
    'export.title': '📄 Exportar Informe',
    'export.period': 'Período:',
    'export.format': 'Formato:',
    'export.include': 'Incluir:',
    'export.stats': 'Estadísticas',
    'export.tickets': 'Lista de Tickets',
    'export.trend': 'Gráfico de Tendencia',
    'export.download': '📥 Descargar Informe',
    'export.today': 'Hoy',
    'export.week': 'Esta Semana',
    'export.month': 'Este Mes',
    
    // Settings
    'settings.title': '⚙️ Configuración',
    'settings.jiraUrl': 'URL de Jira',
    'settings.email': 'Correo Electrónico',
    'settings.apiToken': 'Token de API',
    'settings.createApiToken': '🔗 Crea tu token de API de Jira aquí',
    'settings.queueId': 'ID de Cola',
    'settings.refreshInterval': 'Intervalo de Actualización (segundos)',
    'settings.oldTicketsDays': 'Días sin actualización para alertar',
    'settings.alertSla': 'Alertar sobre SLA próximo (1 hora antes)',
    'settings.alertOld': 'Alertar sobre tickets antiguos',
    'settings.desktopNotifications': '🔔 Notificaciones de escritorio',
    'settings.test': 'Probar',
    'settings.notifyNew': '🎫 Nuevos tickets asignados',
    'settings.notifyStatus': '🔄 Cambios de estado',
    'settings.notifyReassign': '👤 Reasignaciones a ti',
    'settings.notifyMentions': '📢 Cuando te mencionen',
    'settings.soundNotifications': '🔊 Reproducir sonido en notificaciones',
    'settings.proMode': '⭐ Modo Pro',
    'settings.theme': '🎨 Tema de la Aplicación',
    'settings.themeDefault': '🎨 Predeterminado (Degradado Púrpura)',
    'settings.themeDark': '🌙 Oscuro (Modo Oscuro)',
    'settings.themeLight': '☀️ Claro (Modo Claro)',
    'settings.language': '🌍 Idioma',
    'settings.save': 'Guardar',
    'settings.cancel': 'Cancelar',
    
    // Footer
    'footer.loading': 'Cargando...',
    'footer.refresh': 'Actualizar',
    'footer.lastUpdate': 'Última actualización',
    
    // Error Messages
    'error.connection': 'Error de Conexión',
    'error.noConnection': 'No se pudo conectar a Jira',
    'error.retry': 'Intentar de Nuevo',
    'error.loading': 'Error al cargar ticket',
    
    // Buttons
    'btn.close': 'Cerrar',
    'btn.save': 'Guardar',
    'btn.cancel': 'Cancelar',
    'btn.confirm': 'Confirmar',
    'btn.add': 'Agregar',
    'btn.edit': 'Editar',
    'btn.delete': 'Eliminar',
    'btn.retry': 'Intentar de Nuevo',
    
    // Add User Modal
    'addUser.title': '➕ Agregar Usuario para Monitorear',
    'addUser.description': 'Ingresa el correo electrónico del usuario que deseas monitorear:',
    'addUser.placeholder': 'ejemplo@nubank.com.br',
    'addUser.cancel': 'Cancelar',
    'addUser.add': 'Agregar',
    
    // Context Menu
    'context.back': '⬅️ Atrás',
    'context.forward': '➡️ Adelante',
    'context.reload': '🔄 Recargar',
    'context.cut': '✂️ Cortar',
    'context.copy': '📋 Copiar',
    'context.paste': '📄 Pegar',
    'context.delete': '🗑️ Eliminar',
    'context.selectAll': '🔍 Seleccionar Todo',
    'context.copyLink': '🔗 Copiar Enlace',
    'context.copyImage': '🖼️ Copiar Imagen',
    'context.openExternal': '🌐 Abrir Enlace en Navegador Externo',
    'context.inspect': '🔧 Inspeccionar Elemento'
  }
};

/**
 * Obtém a tradução para uma chave específica
 * @param {string} key - Chave da tradução
 * @param {string} lang - Idioma (pt-BR, en, es)
 * @returns {string} - Texto traduzido
 */
function getTranslation(key, lang = 'pt-BR') {
  if (!i18n[lang]) {
    console.warn(`⚠️ Idioma '${lang}' não encontrado, usando pt-BR`);
    lang = 'pt-BR';
  }
  
  const translation = i18n[lang][key];
  
  if (!translation) {
    console.warn(`⚠️ Tradução não encontrada para '${key}' no idioma '${lang}'`);
    return i18n['pt-BR'][key] || key;
  }
  
  return translation;
}

/**
 * Obtém o idioma atual do localStorage
 * @returns {string} - Código do idioma (pt-BR, en, es)
 */
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'pt-BR';
}

/**
 * Define o idioma atual
 * @param {string} lang - Código do idioma (pt-BR, en, es)
 */
function setCurrentLanguage(lang) {
  if (!i18n[lang]) {
    console.warn(`⚠️ Idioma '${lang}' não suportado`);
    return;
  }
  localStorage.setItem('language', lang);
}

/**
 * Traduz um elemento HTML baseado no atributo data-i18n
 * @param {HTMLElement} element - Elemento a ser traduzido
 * @param {string} lang - Idioma
 */
function translateElement(element, lang) {
  const key = element.getAttribute('data-i18n');
  if (key) {
    const translation = getTranslation(key, lang);
    
    // Verificar se deve traduzir o placeholder
    if (element.hasAttribute('data-i18n-placeholder')) {
      element.placeholder = translation;
    }
    // Verificar se deve traduzir o title
    else if (element.hasAttribute('data-i18n-title')) {
      element.title = translation;
    }
    // Caso padrão: traduzir o textContent
    else {
      // Se o elemento tem HTML interno complexo, usar innerHTML
      if (element.querySelector('svg, img')) {
        // Manter os elementos internos e atualizar apenas o texto
        const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = translation;
        } else {
          element.innerHTML = translation + element.innerHTML;
        }
      } else {
        element.textContent = translation;
      }
    }
  }
}

/**
 * Aplica as traduções em toda a página
 * @param {string} lang - Idioma (pt-BR, en, es)
 */
function applyTranslations(lang = 'pt-BR') {
  console.log(`🌍 Aplicando traduções para: ${lang}`);
  
  // Selecionar todos os elementos com data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    translateElement(element, lang);
  });
  
  // Atualizar atributo lang do HTML
  document.documentElement.lang = lang;
  
  console.log(`✅ ${elements.length} elementos traduzidos`);
}

// Exportar funções para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    i18n,
    getTranslation,
    getCurrentLanguage,
    setCurrentLanguage,
    translateElement,
    applyTranslations
  };
}

