const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

// 🔥 VERSÃO COM API v3 /search/jql (NOVO ENDPOINT OBRIGATÓRIO) - TICKETS AVALIADOS
// 🔥 V9.0 - FIX CRÍTICO: Extração rigorosa de ratings (estava classificando todos como 5★)
const JIRA_SERVICE_VERSION = 'v9.0-strict-rating-validation';

// 🎛️ CONTROLE DE DEBUG: Altere para true para ver logs detalhados
const DEBUG_MODE = false;

// 🛡️ PROTEÇÃO GLOBAL: Ignorar erros EPIPE em stdout/stderr
if (process.stdout) {
  process.stdout.on('error', (err) => {
    if (err.code === 'EPIPE' || err.code === 'ERR_STREAM_DESTROYED') {
      // Ignorar silenciosamente
    }
  });
}

if (process.stderr) {
  process.stderr.on('error', (err) => {
    if (err.code === 'EPIPE' || err.code === 'ERR_STREAM_DESTROYED') {
      // Ignorar silenciosamente
    }
  });
}

// 🛡️ Wrapper seguro para logs que previne crashes EPIPE (NUNCA chama a si mesmo)
const safeLog = (...args) => {
  // 🎛️ Se DEBUG_MODE está desativado, não loga nada
  if (!DEBUG_MODE) {
    return;
  }

  // Se stdout não está disponível, não faz nada
  if (!process.stdout || process.stdout.destroyed || !process.stdout.writable) {
    return;
  }
  
  try {
    // Tentar usar console.log normalmente
    console.log(...args);
  } catch (error) {
    // Se der EPIPE ou stream destruído, silenciosamente ignorar
    if (error?.code === 'EPIPE' || error?.code === 'ERR_STREAM_DESTROYED') {
      return;
    }
    
    // Para outros erros, tentar logar no stderr
    try {
      if (process.stderr && !process.stderr.destroyed && process.stderr.writable) {
        process.stderr.write(`[safeLog error: ${error?.code || error?.message}]\n`);
      }
    } catch (_) {
      // Se nem stderr funcionar, realmente não há nada a fazer
    }
  }
};

safeLog(`🔥🔥🔥 JIRA-SERVICE.JS CARREGADO - VERSÃO ${JIRA_SERVICE_VERSION} 🔥🔥🔥`);

class JiraService {
  constructor(config) {
    this.baseUrl = config.jiraUrl || 'https://nubank.atlassian.net';
    this.email = config.jiraEmail;
    this.apiToken = config.jiraApiToken;
    this.queueId = config.queueId || '1104';
    this.monitorOtherUser = config.monitorOtherUser || false;
    this.otherUserEmail = config.otherUserEmail || '';
    this.evaluatedTicketsJql = config.evaluatedTicketsJql || null; // JQL customizada opcional para tickets avaliados
    this.evaluatedTicketsSatisfactionField = config.evaluatedTicketsSatisfactionField || null; // Campo de avaliação configurado manualmente
    this.evaluatedTicketsMaxPages = config.evaluatedTicketsMaxPages || 100; // Limite de páginas para evitar buscar milhares de tickets
    
    if (!this.email || !this.apiToken) {
      throw new Error('Email e API Token são obrigatórios');
    }
    
    this.auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    
    // Cache para IDs de campos customizados identificados dinamicamente
    this._cachedFieldIds = {
      itopsTeam: null
    };
  }

  _getAssignee() {
    if (this.monitorOtherUser && this.otherUserEmail) {
      return `"${this.otherUserEmail}"`;
    }
    return 'currentUser()';
  }

  async _makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Basic ${this.auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error (${response.status}): ${errorText}`);
    }

    // Verificar se há conteúdo na resposta antes de fazer parse
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Se não tem conteúdo ou é 204 (No Content), retornar objeto vazio
    if (response.status === 204 || contentLength === '0') {
      return {};
    }
    
    // Se tem conteúdo JSON, fazer parse
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }
    
    // Fallback: retornar vazio
    return {};
  }

  // Buscar tickets onde o usuário pode ter sido mencionado
  async fetchMentions() {
    try {
      const assignee = this._getAssignee();
      const userEmail = this.monitorOtherUser && this.otherUserEmail ? this.otherUserEmail : this.email;
      
      // Buscar tickets atualizados recentemente (últimos 3 dias)
      // Vamos verificar os comentários no cliente
      const jql = `updated >= -3d ORDER BY updated DESC`;
      
      const data = await this._searchJql(jql, ['key', 'summary', 'updated', 'comment', 'status', 'assignee', 'customfield_10123', 'customfield_10124']);
      
      // Filtrar apenas tickets onde o usuário foi mencionado
      const mentionedTickets = [];
      
      if (data.issues) {
        for (const issue of data.issues) {
          const comments = issue.fields.comment?.comments || [];
          
          // Verificar se algum comentário menciona o usuário
          const hasMention = comments.some(comment => {
            const body = comment.body;
            
            // Verificar se o comentário tem menções no formato ADF (Atlassian Document Format)
            if (body && body.content) {
              const mentions = this._findMentionsInADF(body, userEmail);
              return mentions.length > 0;
            }
            
            return false;
          });
          
          if (hasMention) {
            // Encontrar o comentário mais recente com menção
            const latestMentionComment = comments
              .filter(c => {
                if (c.body && c.body.content) {
                  return this._findMentionsInADF(c.body, userEmail).length > 0;
                }
                return false;
              })
              .sort((a, b) => new Date(b.created) - new Date(a.created))[0];
            
            if (latestMentionComment) {
              mentionedTickets.push({
                ...issue,
                latestMentionComment: latestMentionComment,
                mentionedAt: latestMentionComment.created
              });
            }
          }
        }
      }
      
      return {
        issues: mentionedTickets,
        total: mentionedTickets.length
      };
    } catch (error) {
      console.error('Erro ao buscar menções:', error);
      return { issues: [], total: 0 };
    }
  }
  
  // ============================================
  // 📊 DASHBOARD DE PERFORMANCE - MÉTRICAS
  // ============================================
  
  // Calcular métricas de performance
  async getPerformanceMetrics(days = 30) {
    try {
      const assignee = this._getAssignee();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];
      
      // 1. Tickets resolvidos no período
      const resolvedJql = `assignee = ${assignee} AND resolved >= ${startDateStr} ORDER BY resolved DESC`;
      const resolvedData = await this._searchJql(resolvedJql, ['key', 'summary', 'created', 'resolved', 'resolutiondate', 'priority', 'project']);
      
      // 2. Tickets criados no período (para calcular taxa)
      const createdJql = `assignee = ${assignee} AND created >= ${startDateStr} ORDER BY created DESC`;
      const createdData = await this._searchJql(createdJql, ['key', 'summary', 'created', 'priority', 'project']);
      
      const resolvedTickets = resolvedData.issues || [];
      const createdTickets = createdData.issues || [];
      
      // Calcular tempo médio de resolução
      let totalResolutionTime = 0;
      let resolutionCount = 0;
      
      resolvedTickets.forEach(ticket => {
        const created = new Date(ticket.fields.created);
        const resolved = new Date(ticket.fields.resolutiondate || ticket.fields.resolved);
        const diffHours = (resolved - created) / (1000 * 60 * 60);
        
        if (diffHours > 0 && diffHours < 365 * 24) { // Ignorar valores absurdos
          totalResolutionTime += diffHours;
          resolutionCount++;
        }
      });
      
      const avgResolutionHours = resolutionCount > 0 ? totalResolutionTime / resolutionCount : 0;
      
      // Taxa de fechamento por dia/semana
      const ticketsPerDay = resolvedTickets.length / days;
      const ticketsPerWeek = ticketsPerDay * 7;
      
      // Agrupar por tipo e prioridade
      const byType = {};
      const byPriority = {};
      const byProject = {};
      
      resolvedTickets.forEach(ticket => {
        const type = ticket.fields.issuetype?.name || 'Desconhecido';
        const priority = ticket.fields.priority?.name || 'Sem Prioridade';
        const project = ticket.fields.project?.key || 'Desconhecido';
        
        byType[type] = (byType[type] || 0) + 1;
        byPriority[priority] = (byPriority[priority] || 0) + 1;
        byProject[project] = (byProject[project] || 0) + 1;
      });
      
      // Heatmap de atividade (horários)
      const activityByHour = new Array(24).fill(0);
      const activityByDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      resolvedTickets.forEach(ticket => {
        const resolved = new Date(ticket.fields.resolutiondate || ticket.fields.resolved);
        const hour = resolved.getHours();
        const day = dayNames[resolved.getDay()];
        
        activityByHour[hour]++;
        activityByDay[day]++;
      });
      
      return {
        period: days,
        avgResolutionHours: Math.round(avgResolutionHours * 10) / 10,
        avgResolutionDays: Math.round((avgResolutionHours / 24) * 10) / 10,
        ticketsResolved: resolvedTickets.length,
        ticketsCreated: createdTickets.length,
        ticketsPerDay: Math.round(ticketsPerDay * 10) / 10,
        ticketsPerWeek: Math.round(ticketsPerWeek * 10) / 10,
        byType,
        byPriority,
        byProject,
        activityByHour,
        activityByDay,
        recentResolved: resolvedTickets.slice(0, 10).map(t => ({
          key: t.key,
          summary: t.fields.summary,
          resolved: t.fields.resolutiondate || t.fields.resolved,
          priority: t.fields.priority?.name
        }))
      };
    } catch (error) {
      console.error('Erro ao calcular métricas de performance:', error);
      return null;
    }
  }
  
  // ============================================
  // ⏱️ WORKLOG - REGISTRO DE TEMPO
  // ============================================
  
  // Adicionar worklog a um ticket
  async addWorklog(ticketKey, timeSpentSeconds, comment = '', startedDate = null) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}/worklog`;
      
      const body = {
        timeSpentSeconds: timeSpentSeconds,
        comment: comment ? {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: comment }
              ]
            }
          ]
        } : undefined,
        started: startedDate || new Date().toISOString()
      };
      
      const result = await this._makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      
      safeLog('✅ Worklog adicionado:', ticketKey, timeSpentSeconds, 'segundos');
      return result;
    } catch (error) {
      console.error('Erro ao adicionar worklog:', error);
      throw error;
    }
  }
  
  // Buscar worklogs de um ticket
  async getWorklogs(ticketKey) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}/worklog`;
      const result = await this._makeRequest(endpoint);
      return result.worklogs || [];
    } catch (error) {
      console.error('Erro ao buscar worklogs:', error);
      return [];
    }
  }
  
  // ============================================
  // 🔔 ALERTAS PROATIVOS
  // ============================================
  
  // Verificar tickets sem resposta há X horas
  async getTicketsWithoutResponseSince(hours = 4) {
    try {
      const assignee = this._getAssignee();
      const userEmail = this.monitorOtherUser && this.otherUserEmail ? this.otherUserEmail : this.email;
      const dateThreshold = new Date();
      dateThreshold.setHours(dateThreshold.getHours() - hours);
      const dateStr = dateThreshold.toISOString().replace('Z', '+0000');
      
      const jql = `assignee = ${assignee} AND status in ("Waiting for Support", "In Progress") AND updated <= "${dateStr}" ORDER BY updated ASC`;
      
      const data = await this._searchJql(jql, ['key', 'summary', 'updated', 'status', 'priority', 'comment', 'customfield_10123', 'customfield_10124']);
      
      const tickets = data.issues || [];
      
      // Verificar se o último comentário foi do assignee (nesse caso não precisa alerta)
      const ticketsNeedingResponse = tickets.filter(ticket => {
        const comments = ticket.fields.comment?.comments || [];
        if (comments.length === 0) return true;
        
        const lastComment = comments[comments.length - 1];
        const lastCommentAuthor = lastComment.author?.emailAddress || lastComment.author?.displayName;
        
        // Se o último comentário não foi do usuário (monitorado ou logado), precisa de resposta
        return lastCommentAuthor !== userEmail;
      });
      
      return ticketsNeedingResponse.map(t => ({
        key: t.key,
        summary: t.fields.summary,
        updated: t.fields.updated,
        status: t.fields.status?.name,
        priority: t.fields.priority?.name,
        hoursSinceUpdate: Math.floor((new Date() - new Date(t.fields.updated)) / (1000 * 60 * 60))
      }));
    } catch (error) {
      console.error('Erro ao buscar tickets sem resposta:', error);
      return [];
    }
  }
  
  // Verificar tickets com SLA crítico (próximo do vencimento)
  async getTicketsWithCriticalSLA(minutesBefore = 15) {
    try {
      const assignee = this._getAssignee();
      const now = new Date();
      const futureThreshold = new Date(now.getTime() + minutesBefore * 60000);
      const futureStr = futureThreshold.toISOString().replace('Z', '+0000');
      
      // Buscar tickets com SLA próximo do vencimento
      const jql = `assignee = ${assignee} AND resolution = Unresolved AND duedate <= "${futureStr}" ORDER BY duedate ASC`;
      
      const data = await this._searchJql(jql, ['key', 'summary', 'duedate', 'status', 'priority', 'customfield_10123', 'customfield_10124']);
      
      const tickets = data.issues || [];
      
      return tickets.map(t => ({
        key: t.key,
        summary: t.fields.summary,
        duedate: t.fields.duedate,
        status: t.fields.status?.name,
        priority: t.fields.priority?.name,
        minutesUntilDue: Math.floor((new Date(t.fields.duedate) - now) / (1000 * 60))
      })).filter(t => t.minutesUntilDue > 0); // Apenas futuros
    } catch (error) {
      console.error('Erro ao buscar tickets com SLA crítico:', error);
      return [];
    }
  }

  // Encontrar menções no formato ADF (Atlassian Document Format)
  _findMentionsInADF(adf, userEmail) {
    const mentions = [];
    
    const traverse = (node) => {
      if (!node) return;
      
      // Verificar se é um nó de menção
      if (node.type === 'mention' && node.attrs) {
        const mentionId = node.attrs.id || '';
        const mentionText = node.attrs.text || '';
        
        // Verificar se a menção corresponde ao email do usuário
        if (mentionId.includes(userEmail) || mentionText.includes(userEmail)) {
          mentions.push({
            id: mentionId,
            text: mentionText
          });
        }
      }
      
      // Traversar filhos
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(child => traverse(child));
      }
    };
    
    traverse(adf);
    return mentions;
  }

  async fetchStats() {
    safeLog('🔥🔥🔥 fetchStats() INICIANDO - VERSÃO COM _getEvaluatedTickets() BLINDADA 🔥🔥🔥');
    const assignee = this._getAssignee();
    
    // Query para Total de Tickets - 🔥 APENAS PROJETO IT
    const totalJql = `assignee = ${assignee} AND resolution = Unresolved AND status NOT IN ("Cancelled", "Canceled", "Cancelado", "Closed") AND project = IT ORDER BY updated DESC`;
    
    // Query para Waiting for Support - 🔥 APENAS PROJETO IT
    const supportJql = `assignee = ${assignee} AND resolution = Unresolved AND status in ("Waiting for Support", "Aguardando Suporte") AND project = IT`;
    
    // Query para Waiting for Customer - 🔥 APENAS PROJETO IT
    const customerJql = `assignee = ${assignee} AND resolution = Unresolved AND status in ("Waiting for Customer", "Aguardando Cliente") AND project = IT`;
    
    // Query para Tickets Pending - 🔥 APENAS PROJETO IT
    const pendingJql = `assignee = ${assignee} AND resolution = Unresolved AND status in ("Pending", "Pendente") AND project = IT`;
    
    // Query adicional para tickets criados hoje (inclusive os já fechados, para atividade diária)
    // Usar data específica ao invés de startOfDay() para garantir fuso horário correto
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const todayCreatedJql = `assignee = ${assignee} AND created >= "${todayStr}" ORDER BY created DESC`;
    
    // 🎯 Query para tickets RESOLVIDOS hoje (independente de quando foram criados)
    const todayResolvedJql = `assignee = ${assignee} AND resolved >= "${todayStr}" ORDER BY resolved DESC`;
    
    // 🔥 Query para agrupar TODOS os projetos (não apenas IT)
    const allProjectsJql = `assignee = ${assignee} AND resolution = Unresolved AND status NOT IN ("Cancelled", "Canceled", "Cancelado", "Closed") ORDER BY updated DESC`;

    try {
      // 🎯 Campos de SLA do Jira Service Management
      const slaFields = ['customfield_10123', 'customfield_10124', 'customfield_10001', 'customfield_10002'];
      const baseFields = ['status', 'summary', 'key', 'updated', 'created', 'project', 'duedate', 'resolutiondate', 'assignee'];
      const allFields = [...baseFields, ...slaFields];
      
      const [totalData, supportData, customerData, pendingData, todayCreatedData, todayResolvedData, allProjectsData] = await Promise.all([
        this._searchJql(totalJql, allFields),
        this._searchJql(supportJql, [...baseFields, ...slaFields]),
        this._searchJql(customerJql, [...baseFields, ...slaFields]),
        this._searchJql(pendingJql, [...baseFields, ...slaFields]),
        this._searchJql(todayCreatedJql, ['status', 'summary', 'key', 'created', 'resolutiondate', 'resolved', 'customfield_10123', 'customfield_10124']),
        this._searchJql(todayResolvedJql, ['status', 'summary', 'key', 'created', 'resolutiondate', 'resolved', 'customfield_10123', 'customfield_10124']),
        this._searchJql(allProjectsJql, [...baseFields, ...slaFields])
      ]);

      safeLog('📦 Dados recebidos das queries:', {
        totalData: { total: totalData.issues?.length },
        supportData: { total: supportData.issues?.length },
        customerData: { total: customerData.issues?.length },
        pendingData: { total: pendingData.issues?.length },
        todayCreatedData: { total: todayCreatedData.issues?.length },
        todayResolvedData: { total: todayResolvedData.issues?.length },
        allProjectsData: { total: allProjectsData.issues?.length }
      });

      // 🔥 FILTRO DO LADO DO CLIENTE: Garantir que apenas tickets com status correto sejam contados
      // (bug da API Jira que retorna tickets com status diferentes)
      
      const supportTicketsFiltered = (supportData.issues || []).filter(issue => {
        const status = issue.fields.status?.name || '';
        const isCorrectStatus = ['Waiting for Support', 'Aguardando Suporte'].includes(status);
        if (!isCorrectStatus) {
          console.warn(`⚠️ Ticket ${issue.key} tem status "${status}" mas foi retornado na query de Support`);
        }
        return isCorrectStatus;
      });
      
      const customerTicketsFiltered = (customerData.issues || []).filter(issue => {
        const status = issue.fields.status?.name || '';
        const isCorrectStatus = ['Waiting for Customer', 'Aguardando Cliente'].includes(status);
        if (!isCorrectStatus) {
          console.warn(`⚠️ Ticket ${issue.key} tem status "${status}" mas foi retornado na query de Customer`);
        }
        return isCorrectStatus;
      });
      
      const pendingTicketsFiltered = (pendingData.issues || []).filter(issue => {
        const status = issue.fields.status?.name || '';
        const isCorrectStatus = ['Pending', 'Pendente'].includes(status);
        if (!isCorrectStatus) {
          console.warn(`⚠️ Ticket ${issue.key} tem status "${status}" mas foi retornado na query de Pending`);
        }
        return isCorrectStatus;
      });
      
      // A API /search/jql não retorna 'total', então usamos issues.length
      const total = totalData.issues?.length || 0;
      const waitingForSupport = supportTicketsFiltered.length;
      const waitingForCustomer = customerTicketsFiltered.length;
      const pending = pendingTicketsFiltered.length;
      
      console.log('🔍 Filtros aplicados:', {
        support: { original: supportData.issues?.length || 0, filtrado: waitingForSupport },
        customer: { original: customerData.issues?.length || 0, filtrado: waitingForCustomer },
        pending: { original: pendingData.issues?.length || 0, filtrado: pending }
      });

      // Calcular alertas de SLA e tickets antigos (apenas para IT)
      const slaAlerts = this._calculateSlaAlerts(totalData.issues);
      const oldTickets = this._calculateOldTickets(totalData.issues);

      // 🔥 Estatísticas por projeto - usa TODOS os projetos
      const byProject = this._groupByProject(allProjectsData.issues);

      // Tickets recentes (últimos 5 atualizados)
      const recentTickets = totalData.issues.slice(0, 5).map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        updated: issue.fields.updated,
        assignee: issue.fields.assignee
      }));

      // Calcular atividade diária
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      // Tickets recebidos hoje = todos os tickets criados hoje (da query específica)
      const todayReceived = todayCreatedData.issues || [];
      
      // ✅ Tickets fechados hoje = usar query específica de resolvidos
      // Filtrar apenas tickets realmente fechados com validação dupla
      const todayResolvedFiltered = (todayResolvedData.issues || []).filter(issue => {
        const resolutionDate = issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : null;
        const resolvedDate = issue.fields.resolved ? new Date(issue.fields.resolved) : null;
        const status = issue.fields.status?.name || '';
        const closedStatuses = ['Fechado', 'Closed', 'Resolvido', 'Resolved', 'Concluído', 'Concluido', 'Done'];
        
        // Verificar se foi resolvido hoje E status está fechado
        const wasResolvedToday = (resolutionDate && resolutionDate >= startOfDay) || 
                                (resolvedDate && resolvedDate >= startOfDay);
        return wasResolvedToday && closedStatuses.includes(status);
      });
      
      safeLog('📊 Atividade diária calculada:', {
        recebidos: todayReceived.length,
        fechados: todayResolvedFiltered.length,
        ticketsRecebidos: todayReceived.map(t => ({ key: t.key, created: t.fields.created })),
        ticketsFechados: todayResolvedFiltered.map(t => ({ 
          key: t.key, 
          resolved: t.fields.resolutiondate || t.fields.resolved,
          status: t.fields.status?.name
        }))
      });

      // Dados de tendência (implementaremos histórico real)
      safeLog('🔍 [DEBUG] Buscando trend data...');
      const trend = await this._getTrendData();
      safeLog('✅ [DEBUG] Trend data OK');

      // Tickets de Telefonia SIM cards (Modo Pro)
      safeLog('🔍 [DEBUG] Buscando SIM cards tickets...');
      const simcardPendingTickets = await this._getSimCardsTickets();
      safeLog('✅ [DEBUG] SIM cards OK');

      // 🤖 Tickets L0 Jira Bot (Modo Pro)
      safeLog('🔍 [DEBUG] Buscando L0 Jira Bot tickets...');
      const l0BotTickets = await this._getL0BotTickets();
      safeLog('✅ [DEBUG] L0 Jira Bot OK');

      // 🎯 Tickets All L1 Open (Modo Pro)
      safeLog('🔍 [DEBUG] Buscando All L1 Open tickets...');
      const l1OpenTickets = await this._getL1OpenTickets();
      safeLog('✅ [DEBUG] All L1 Open OK');

      // Tickets Avaliados (Modo Pro)
      safeLog('🔍 CHAMANDO _getEvaluatedTickets()...');
      let evaluatedTickets = { count: 0, tickets: [], jql: '', ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
      try {
        evaluatedTickets = await this._getEvaluatedTickets();
        safeLog('\n✅ _getEvaluatedTickets() retornou SUCESSO:');
        safeLog(`   📦 count: ${evaluatedTickets.count}`);
        safeLog(`   📋 tickets.length: ${evaluatedTickets.tickets?.length || 0}`);
        safeLog(`   📊 ratingDistribution:`, evaluatedTickets.ratingDistribution);
        safeLog(`   🔍 Primeiro ticket:`, evaluatedTickets.tickets?.[0]);
        safeLog(`   🔑 Primeiras 5 chaves:`, evaluatedTickets.tickets?.slice(0, 5).map(t => t.key));
      } catch (error) {
        console.error('\n❌ ERRO em _getEvaluatedTickets():', error.message);
        console.error(error.stack);
      }

      // 🔍 BUSCA FORENSE (Histórico de Avaliações)
      // Após análise exaustiva, confirmamos que customfield_10120 contém as avaliações reais.
      // O filtro JQL agora cobre os últimos 730 dias para capturar todo o histórico solicitado.

      // Contar comentários feitos hoje pelo usuário
      const todayComments = await this._getTodayUserComments();

      safeLog('\n🎯 fetchStats() RETORNANDO PARA RENDERER:');
      safeLog(`   📦 evaluatedTickets.count: ${evaluatedTickets.count}`);
      safeLog(`   📋 evaluatedTickets.tickets.length: ${evaluatedTickets.tickets?.length || 0}`);
      safeLog(`   🔍 evaluatedTickets é array? ${Array.isArray(evaluatedTickets.tickets)}`);
      safeLog(`   🔑 Primeiras chaves no return:`, evaluatedTickets.tickets?.slice(0, 3).map(t => t?.key));

      return {
        total,
        waitingForSupport,
        waitingForCustomer,
        pending,
        slaAlerts: slaAlerts.length,
        oldTickets: oldTickets.length,
        slaTickets: slaAlerts,
        oldTicketsList: oldTickets,
        allTickets: totalData.issues,
        supportTickets: supportTicketsFiltered.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          fields: issue.fields  // 🎨 Incluir fields completo para SLA
        })),
        customerTickets: customerTicketsFiltered.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          fields: issue.fields  // 🎨 Incluir fields completo para SLA
        })),
        pendingTickets: pendingTicketsFiltered.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          fields: issue.fields  // 🎨 Incluir fields completo para SLA
        })),
        byProject,
        recentTickets,
        trend,
        simcardPendingTickets,
        l0BotTickets,
        l1OpenTickets,
        evaluatedTickets,
        // Dados de atividade diária (calculados dos tickets existentes)
        todayReceived: todayReceived,
        todayResolved: todayResolvedFiltered,
        todayComments: todayComments
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  async _searchJql(jql, fields = ['status', 'summary', 'key']) {
    // ✅ USANDO API v3 /search/jql (NOVO ENDPOINT OBRIGATÓRIO)
    const endpoint = `/rest/api/3/search/jql`;
    
    // Garantir que fields é um array
    if (!fields || !Array.isArray(fields)) {
      fields = ['status', 'summary', 'key'];
    }

    const slaFields = fields.filter(f => f && f.includes('customfield_10'));
    if (slaFields.length > 0) {
      safeLog('📤 Solicitando campos à API Jira:', slaFields);
    }
    
    const body = {
      jql,
      fields,
      maxResults: 1000
    };
    
    safeLog('🔍 _searchJql usando POST /rest/api/3/search/jql (novo endpoint)');

    const data = await this._makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });

    // Debug: verificar se customfield_10123 veio na resposta
    if (data.issues && data.issues.length > 0) {
      const firstIssue = data.issues[0];
      if (firstIssue.fields) {
        const hasCustom10123 = 'customfield_10123' in firstIssue.fields;
        const hasCustom10124 = 'customfield_10124' in firstIssue.fields;
        safeLog('📥 API Jira retornou customfield_10123?', hasCustom10123);
        safeLog('📥 API Jira retornou customfield_10124?', hasCustom10124);
      }
    }

    return data;
  }

  // 🔄 Buscar TODOS os resultados com paginação completa usando API v3
  async _searchJqlWithPagination(jql, fields = ['status', 'summary', 'key'], maxResults = 50, hardLimit = 50000) {
    // ✅ API v3 /search/jql usa nextPageToken (NÃO usa startAt/total)
    const endpoint = `/rest/api/3/search/jql`;

    if (!fields || !Array.isArray(fields)) {
      fields = ['status', 'summary', 'key'];
    }

    let allIssues = [];
    let nextPageToken = null;
    let page = 0;

    safeLog(`🔄 Iniciando paginação (nextPageToken) em /rest/api/3/search/jql: ${jql.substring(0, 120)}...`);

    while (true) {
      page++;

      const qs = new URLSearchParams();
      // Alguns tenants ignoram maxResults aqui, mas não atrapalha.
      if (maxResults) qs.set('maxResults', String(maxResults));
      if (nextPageToken) qs.set('nextPageToken', nextPageToken);

      const endpointWithToken = `${endpoint}?${qs.toString()}`;
      const body = { jql, fields };

      // Log reduzido
      if (page === 1 || page % 10 === 0) {
        safeLog(`📥 Página ${page} (token): ${nextPageToken ? 'continuando' : 'início'} | acumulado=${allIssues.length}`);
      }

      const data = await this._makeRequest(endpointWithToken, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const issues = Array.isArray(data?.issues) ? data.issues : [];
      allIssues.push(...issues);

      if (hardLimit && allIssues.length >= hardLimit) {
        safeLog(`⚠️ hardLimit atingido (${hardLimit}). Parando paginação.`);
        break;
      }

      // /search/jql retorna { issues, nextPageToken, isLast }
      if (data?.isLast === true) break;
      if (!data?.nextPageToken) break;

      nextPageToken = data.nextPageToken;

      // Segurança adicional: evitar loops infinitos
      if (page >= 2000) {
        safeLog('⚠️ Limite de páginas (2000) atingido. Parando paginação.');
        break;
      }
    }

    safeLog(`✅ Paginação concluída: ${allIssues.length} tickets (páginas=${page})`);

    return {
      issues: allIssues,
      total: allIssues.length,
    };
  }

  _calculateSlaAlerts(issues) {
    const now = new Date();
    const oneHourInMs = 60 * 60 * 1000;
    const fourHoursInMs = 4 * 60 * 60 * 1000; // Aumentado para 4 horas para ser mais útil
    
    return issues.filter(issue => {
      if (!issue.fields.duedate) return false;
      
      const dueDate = new Date(issue.fields.duedate);
      const timeDiff = dueDate - now;
      
      // Incluir tickets que vencem em até 4 horas (mais útil que apenas 1 hora)
      // ou tickets que já venceram (SLA estourado)
      return timeDiff <= fourHoursInMs;
    }).map(issue => {
      const slaDueDate = this._getSlaDueDate(issue);
      return {
        ...issue,
        slaStatus: this._getSlaStatus(slaDueDate)
      };
    });
  }
  
  // 🎯 Buscar data de SLA de vários campos possíveis do Jira
  _getSlaDueDate(issue) {
    // 1. Tentar campo customfield_10123 (Time to resolution - JSM)
    const timeToResolution = issue.fields.customfield_10123;
    if (timeToResolution && timeToResolution.ongoingCycle && timeToResolution.ongoingCycle.breachTime) {
      return timeToResolution.ongoingCycle.breachTime.iso8601;
    }

    // 2. Tentar campo duedate padrão
    if (issue.fields.duedate) {
      return issue.fields.duedate;
    }

    // 3. Tentar outros campos de SLA comuns no JSM
    const slaFields = [
      'customfield_10124', // Time to first response
      'customfield_10001',
      'customfield_10002',
      'customfield_10003',
      'customfield_10004',
      'customfield_10005'
    ];

    for (const fieldId of slaFields) {
      const field = issue.fields[fieldId];
      if (field) {
        // Se for um objeto com ongoingCycle (formato JSM)
        if (field.ongoingCycle && field.ongoingCycle.breachTime) {
          return field.ongoingCycle.breachTime.iso8601;
        }
        // Se for uma string de data diretamente
        if (typeof field === 'string' && !isNaN(new Date(field).getTime())) {
          return field;
        }
      }
    }

    return null;
  }

  _getSlaStatus(duedate) {
    if (!duedate) return 'unknown';
    
    const now = new Date();
    const dueDate = new Date(duedate);
    const timeDiff = dueDate - now;
    const diffMinutes = Math.floor(timeDiff / 60000);
    
    // 🟢 Verde: > 3 horas (180 minutos)
    // 🟡 Amarelo: 1-3 horas (60-180 minutos)
    // 🔴 Vermelho: < 0 (estourado)
    
    if (diffMinutes < 0) return 'overdue'; // 🔴 Estourado
    if (diffMinutes <= 60) return 'critical'; // 🔴 Crítico (< 1h, próximo de estourar)
    if (diffMinutes <= 180) return 'warning'; // 🟡 Atenção (1-3h)
    return 'safe'; // 🟢 Seguro (> 3h)
  }

  _calculateOldTickets(issues, daysThreshold = 7) {
    const now = new Date();
    const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;
    
    return issues.filter(issue => {
      if (!issue.fields.updated) return false;
      
      const updated = new Date(issue.fields.updated);
      const timeDiff = now - updated;
      
      return timeDiff >= thresholdMs;
    });
  }

  _groupByProject(issues) {
    const grouped = {};
    
    issues.forEach(issue => {
      const projectKey = issue.fields.project.key;
      if (!grouped[projectKey]) {
        grouped[projectKey] = {
          name: projectKey,
          count: 0,
          tickets: []
        };
      }
      grouped[projectKey].count++;
      grouped[projectKey].tickets.push({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name
      });
    });
    
    return grouped;
  }

  async _getTrendData() {
    const assignee = this._getAssignee();
    const days = 7;
    const trend = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const startDate = date.toISOString().split('T')[0];
      const endDate = date.toISOString().split('T')[0];
      
      const jql = `assignee = ${assignee} AND resolution = Unresolved AND status NOT IN ("Cancelled", "Canceled", "Cancelado", "Closed") AND updated >= "${startDate} 00:00" AND updated <= "${endDate} 23:59" ORDER BY updated DESC`;
      
      try {
        const data = await this._searchJql(jql, ['key']);
        trend.push({
          date: startDate,
          count: data.issues?.length || 0,
          jql: jql
        });
      } catch (error) {
        console.error(`Erro ao buscar tendência para ${startDate}:`, error);
        trend.push({
          date: startDate,
          count: 0,
          jql: jql
        });
      }
    }
    
    return trend;
  }

  async _getSimCardsTickets() {
    try {
      // Buscar JQL do filtro 52128
      const filterData = await this._makeRequest('/rest/api/3/filter/52128');
      let jql = filterData.jql;
      
      // Adicionar "Waiting for Customer" e "Aguardando Cliente" se não estiverem incluídos
      if (!jql.includes('Waiting for Customer') && !jql.includes('Aguardando Cliente')) {
        // Encontrar a parte do status e adicionar os novos status
        jql = jql.replace(
          /status\s+in\s*\([^)]+\)/i,
          match => {
            const newStatuses = '"Waiting for Customer", "Aguardando Cliente"';
            return match.replace(')', `, ${newStatuses})`);
          }
        );
      }
      
      const data = await this._searchJql(jql, ['status', 'summary', 'key', 'duedate', 'updated', 'project', 'assignee', 'customfield_10123', 'customfield_10124']);
      
      // 🔥 FILTRO: Garantir que apenas tickets com status válido sejam contados
      // (similar ao filtro aplicado em fetchStats)
      const validStatuses = [
        'Waiting for Support', 'Aguardando Suporte',
        'Waiting for Customer', 'Aguardando Cliente',
        'Pending', 'Pendente',
        'In Progress', 'Em Progresso',
        'Open', 'Aberto',
        'Waiting for approval', 'Aguardando Aprovação'
      ];
      
      const filteredIssues = (data.issues || []).filter(issue => {
        const status = issue.fields.status?.name || '';
        const isValid = validStatuses.includes(status);
        if (!isValid && status !== 'Resolved' && status !== 'Closed' && status !== 'Canceled') {
          console.warn(`⚠️ [SIM Cards] Ticket ${issue.key} tem status incomum: "${status}"`);
        }
        return isValid;
      });
      
      return {
        count: filteredIssues.length,
        tickets: filteredIssues.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          duedate: issue.fields.duedate,
          updated: issue.fields.updated,
          assignee: issue.fields.assignee
        })),
        jql: jql,
        originalCount: data.issues?.length || 0
      };
    } catch (error) {
      console.error('Erro ao buscar tickets de SIM cards:', error);
      return { count: 0, tickets: [], jql: '' };
    }
  }

  /**
   * 🤖 Buscar tickets da fila L0 Jira Bot (Service Queue 7631)
   */
  async _getL0BotTickets() {
    try {
      // Tentar buscar JQL do filtro/queue se possível, senão usar JQL direta
      let jql = 'project = "IT" AND statusCategory != "Done" AND (queue = 7631 OR "Service Desk Queue" = 7631) ORDER BY created DESC';
      
      // Tentar buscar via endpoint de queue se disponível (API Service Desk)
      try {
        const queueData = await this._makeRequest('/rest/servicedeskapi/servicedesk/IT/queue/7631');
        if (queueData && queueData.jql) {
          jql = queueData.jql;
          safeLog(`✅ JQL da Fila L0 Bot obtida via API: ${jql}`);
        }
      } catch (e) {
        safeLog(`ℹ️ Não foi possível obter JQL da fila via API Service Desk, usando JQL manual.`);
      }

      safeLog(`🔍 Buscando L0 Bot com JQL: ${jql}`);
      const data = await this._searchJql(jql, ['status', 'summary', 'key', 'updated', 'assignee']);
      
      safeLog(`✅ L0 Bot retornou ${data.issues?.length || 0} tickets`);
      
      return {
        count: data.issues?.length || 0,
        tickets: (data.issues || []).map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          updated: issue.fields.updated,
          assignee: issue.fields.assignee
        })),
        jql: jql
      };
    } catch (error) {
      safeLog(`⚠️ Erro ao buscar L0 Bot: ${error.message}`);
      return { count: 0, tickets: [], jql: '' };
    }
  }

  /**
   * 🎯 Buscar tickets da fila All L1 Open (Service Queue 3015)
   */
  async _getL1OpenTickets() {
    try {
      // Tentar buscar JQL do filtro/queue se possível, senão usar JQL direta
      let jql = 'project = "IT" AND statusCategory != "Done" AND (queue = 3015 OR "Service Desk Queue" = 3015) ORDER BY created DESC';
      
      // Tentar buscar via endpoint de queue se disponível (API Service Desk)
      try {
        const queueData = await this._makeRequest('/rest/servicedeskapi/servicedesk/IT/queue/3015');
        if (queueData && queueData.jql) {
          jql = queueData.jql;
          safeLog(`✅ JQL da Fila All L1 Open obtida via API: ${jql}`);
        }
      } catch (e) {
        safeLog(`ℹ️ Não foi possível obter JQL da fila via API Service Desk, usando JQL manual.`);
      }

      safeLog(`🔍 Buscando All L1 Open com JQL: ${jql}`);
      const data = await this._searchJql(jql, ['status', 'summary', 'key', 'updated', 'assignee']);
      
      safeLog(`✅ All L1 Open retornou ${data.issues?.length || 0} tickets`);

      return {
        count: data.issues?.length || 0,
        tickets: (data.issues || []).map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          updated: issue.fields.updated,
          assignee: issue.fields.assignee
        })),
        jql: jql
      };
    } catch (error) {
      safeLog(`⚠️ Erro ao buscar All L1 Open: ${error.message}`);
      return { count: 0, tickets: [], jql: '' };
    }
  }

  /**
   * 🌟 BUSCA COMPLETA DE TICKETS AVALIADOS (Algoritmo de Paginação Tradicional)
   * 
   * Usa paginação startAt/maxResults para buscar TODOS os tickets sem limites.
   * 
   * Algoritmo:
   * 1. allIssues = []
   * 2. startAt = 0
   * 3. Loop: fetch API com startAt/maxResults
   * 4. Adiciona issues ao allIssues
   * 5. Incrementa startAt
   * 6. Continua enquanto startAt < total
   * 
   * @returns {Object} { count, tickets[], jql, ratingDistribution }
   */
  
  
  async _getEvaluatedTickets() {
    if (this._isFetchingEvaluated) return this._evaluatedTicketsCache;
    this._isFetchingEvaluated = true;

    try {
      // 1. JQL HARDCODED (Para teste definitivo)
      const jql = "status IN (Resolved, Cancelado) AND assignee = currentUser() ORDER BY created DESC";
      
      const SATISFACTION_FIELD_ID = (this.evaluatedTicketsSatisfactionField && this.evaluatedTicketsSatisfactionField[0]) || 'customfield_10120';
      const fields = ['summary', 'status', 'resolutiondate', 'created', 'assignee', 'updated', SATISFACTION_FIELD_ID].join(',');

      safeLog('\n════════════════════════════════════════════════════════');
      safeLog('🚨 MODO DE EMERGÊNCIA: BUSCA COM JQL BLINDADA');
      safeLog('════════════════════════════════════════════════════════\n');

      const allIssues = [];
      let nextPageToken = null;
      let isLast = false;
      let page = 0;

      do {
        page++;
        
        // 2. CONSTRUÇÃO DA URL COM JQL CODIFICADA
        let endpoint = `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=100&fields=${encodeURIComponent(fields)}`;
        
        if (nextPageToken) {
          endpoint += `&nextPageToken=${encodeURIComponent(nextPageToken)}`;
        }

        // 3. LOG DE SEGURANÇA (Para você conferir no terminal)
        safeLog(`🚨 URL SENDO CHAMADA: ${this.baseUrl}${endpoint}`);

        const response = await this._makeRequest(endpoint, {
          method: 'GET' // Mudado para GET para garantir leitura dos Query Params
        });

        const issues = response.issues || [];
        allIssues.push(...issues);
        
        nextPageToken = response.nextPageToken;
        isLast = response.isLast === true || !nextPageToken;

        safeLog(`📥 Página ${page}: +${issues.length} tickets | Acumulado: ${allIssues.length}`);

        // Segurança: Se passar de 5000 tickets com esse filtro, algo ainda está errado no Jira
        if (allIssues.length > 5000) {
          safeLog('🛑 ERRO: O filtro JQL parece estar sendo ignorado pelo Jira (5000+ tickets). ABORTANDO.');
          break;
        }

      } while (!isLast);

      safeLog(`\n✅ BUSCA FINALIZADA: ${allIssues.length} TICKETS PROCESSADOS`);

      // PROCESSAMENTO DE ESTRELAS
      const processedTickets = [];
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      allIssues.forEach(issue => {
        const rawField = issue.fields[SATISFACTION_FIELD_ID];
        let rating = null;

        if (rawField) {
          const rawValue = rawField.value ? rawField.value : (rawField.rating ? rawField.rating : rawField);
          const stringValue = String(rawValue).trim().charAt(0);
          if (['1', '2', '3', '4', '5'].includes(stringValue)) {
            rating = parseInt(stringValue);
          }
        }

        if (rating) {
          ratingDistribution[rating]++;
          processedTickets.push({
            key: issue.key,
            summary: issue.fields.summary,
            status: issue.fields.status?.name,
            ratingNumber: rating,
            satisfaction: rating,
            ratingEmoji: '⭐'.repeat(rating)
          });
        }
      });

      this._evaluatedTicketsCache = {
        count: processedTickets.length,
        tickets: processedTickets,
        ratingDistribution
      };

      return this._evaluatedTicketsCache;

    } catch (error) {
      safeLog(`❌ ERRO NO FETCH: ${error.message}`);
      throw error;
    } finally {
      this._isFetchingEvaluated = false;
    }
  }




  async _forensicSearchMissingRatings() {
    safeLog('\n════════════════════════════════════════════════════════');
    safeLog('🔍 BUSCA FORENSE ILIMITADA: CAÇANDO NOTAS 2, 3 e 4 PERDIDAS');
    safeLog('════════════════════════════════════════════════════════\n');
    
    // Blacklist: APENAS campos que são DEFINITIVAMENTE não-avaliações
    const BLACKLIST = [
      'customfield_20061'  // SLA/Prazo ({"value": "3 work days"}) - CONFIRMADO como falso positivo
      // customfield_30195 REMOVIDO - pode ser avaliação real de 1 estrela!
    ];
    
    safeLog('🚫 BLACKLIST (apenas campos 100% confirmados como não-avaliação):');
    BLACKLIST.forEach(field => safeLog(`   ❌ ${field}`));
    safeLog(`\n💡 ATENÇÃO: Busca ILIMITADA - vai processar TODO o histórico!\n`);
    
    try {
      // Buscar TODOS os tickets - sem limite de páginas
      safeLog('📥 Iniciando busca ILIMITADA de tickets resolvidos...');
      const jql = 'status IN (Resolved, Cancelado) AND assignee WAS currentUser() ORDER BY created DESC';
      
      const allIssues = [];
      let startAt = 0;
      const maxResults = 100;
      let page = 0;
      let totalFromApi = null;
      
      // Buscar TODAS as páginas (sem limite)
      while (true) {
        page++;
        const endpoint = `/rest/api/3/search/jql?startAt=${startAt}&maxResults=${maxResults}`;
        
        safeLog(`📄 Buscando página ${page}...`);
        
        const data = await this._makeRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify({
            jql: jql,
            fields: ['key', 'summary', 'created', 'assignee'] // Vamos buscar TODOS os campos depois
          })
        });
        
        if (!data || !data.issues || data.issues.length === 0) {
          safeLog(`✅ Fim da busca (página ${page} vazia)\n`);
          break;
        }
        
        // Guardar total na primeira página
        if (totalFromApi === null && data.total !== undefined) {
          totalFromApi = data.total;
          safeLog(`   🎯 Total de tickets no Jira: ${totalFromApi}`);
        }
        
        allIssues.push(...data.issues);
        startAt += data.issues.length;
        
        safeLog(`   ✓ ${data.issues.length} tickets recebidos (total acumulado: ${allIssues.length})`);
        
        // Parar se chegamos ao fim
        if (totalFromApi && allIssues.length >= totalFromApi) {
          safeLog(`✅ Todos os ${totalFromApi} tickets foram carregados!\n`);
          break;
        }
        
        // Segurança: Limite absoluto de 10.000 tickets para evitar loops infinitos
        if (allIssues.length >= 10000) {
          safeLog(`⚠️ Limite de segurança atingido: 10.000 tickets`);
          safeLog(`   Se precisar analisar mais, aumente este limite no código\n`);
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay para não sobrecarregar
      }
      
      safeLog(`\n📦 Total de tickets para análise: ${allIssues.length}`);
      safeLog(`🎯 Procurando por valores EXATAMENTE iguais a 1, 2, 3 ou 4...\n`);
      safeLog(`💡 Vamos buscar nota 1 também para validar customfield_30195\n`);
      
      const findings = {
        1: [],
        2: [],
        3: [],
        4: []
      };
      
      let ticketsAnalyzed = 0;
      const TARGET_RATINGS = [1, 2, 3, 4]; // Incluir nota 1 para validação
      
      // Analisar cada ticket individualmente (buscar campos completos)
      for (const issue of allIssues) {
        ticketsAnalyzed++;
        
        if (ticketsAnalyzed % 100 === 0) {
          safeLog(`⏳ Analisados ${ticketsAnalyzed}/${allIssues.length} tickets...`);
        }
        
        // Buscar detalhes completos do ticket
        let ticketDetails;
        try {
          ticketDetails = await this._makeRequest(`/rest/api/3/issue/${issue.key}`);
        } catch (error) {
          console.warn(`   ⚠️ Erro ao buscar ${issue.key}: ${error.message}`);
          continue;
        }
        
        if (!ticketDetails || !ticketDetails.fields) continue;
        
        const assigneeEmail = ticketDetails.fields.assignee?.emailAddress || 
                             ticketDetails.fields.assignee?.name;
        const currentUserEmail = this.monitorOtherUser && this.otherUserEmail ? 
                                this.otherUserEmail : this.email;
        
        // Pular se não for do usuário atual
        if (!assigneeEmail || assigneeEmail.toLowerCase() !== currentUserEmail.toLowerCase()) {
          continue;
        }
        
        // Examinar TODOS os customfields
        const allFields = Object.keys(ticketDetails.fields);
        const customFields = allFields.filter(f => f.startsWith('customfield_'));
        
        for (const fieldId of customFields) {
          // Pular se estiver na blacklist
          if (BLACKLIST.includes(fieldId)) {
            continue;
          }
          
          const fieldValue = ticketDetails.fields[fieldId];
          
          // Pular se vazio
          if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
            continue;
          }
          
          let extractedRating = null;
          let rawValueDescription = '';
          
          // Tentar extrair valor - VALIDAÇÃO ULTRA-RIGOROSA
          if (typeof fieldValue === 'number') {
            extractedRating = fieldValue;
            rawValueDescription = `number: ${fieldValue}`;
          } else if (typeof fieldValue === 'string') {
            // Aceitar APENAS strings numéricas puras ("1", "2", "3", "4", "5")
            // Rejeitar "3 work days", "level 1", etc.
            const trimmed = fieldValue.trim();
            if (/^[1-5]$/.test(trimmed)) {
              extractedRating = parseInt(trimmed);
              rawValueDescription = `string: "${fieldValue}"`;
            }
          } else if (typeof fieldValue === 'object') {
            // Tentar diferentes formatos de objeto
            if (fieldValue.rating !== undefined) {
              const rating = fieldValue.rating;
              if (typeof rating === 'number') {
                extractedRating = rating;
                rawValueDescription = `object.rating: ${JSON.stringify(fieldValue)}`;
              } else if (typeof rating === 'string' && /^[1-5]$/.test(rating.trim())) {
                extractedRating = parseInt(rating);
                rawValueDescription = `object.rating: ${JSON.stringify(fieldValue)}`;
              }
            } else if (fieldValue.value !== undefined) {
              const val = fieldValue.value;
              // Rejeitar "0" e valores com texto
              if (val !== "0" && val !== 0) {
                if (typeof val === 'number') {
                  extractedRating = val;
                  rawValueDescription = `object.value: ${JSON.stringify(fieldValue)}`;
                } else if (typeof val === 'string' && /^[1-5]$/.test(val.trim())) {
                  // Aceitar APENAS strings numéricas puras
                  extractedRating = parseInt(val);
                  rawValueDescription = `object.value: ${JSON.stringify(fieldValue)}`;
                }
                // Se tiver texto (ex: "3 work days"), será null e rejeitado
              }
            }
          }
          
          // 🎯 ACHAMOS UMA NOTA ALVO?
          if (extractedRating && TARGET_RATINGS.includes(extractedRating)) {
            const finding = {
              ticket: issue.key,
              fieldId: fieldId,
              rating: extractedRating,
              rawValue: rawValueDescription,
              created: ticketDetails.fields.created,
              summary: ticketDetails.fields.summary?.substring(0, 60) || 'N/A'
            };
            
            findings[extractedRating].push(finding);
            
            // 🚨 ALERTA ESPECIAL PARA NOTAS RARAS
            safeLog(`\n${'🚨'.repeat(30)}`);
            safeLog(`🎯 AGULHA NO PALHEIRO ENCONTRADA!`);
            safeLog(`${'🚨'.repeat(30)}`);
            safeLog(`   ⭐ NOTA: ${extractedRating} estrelas`);
            safeLog(`   🎫 TICKET: ${issue.key}`);
            safeLog(`   📅 CRIADO EM: ${ticketDetails.fields.created}`);
            safeLog(`   📋 CAMPO ID: ${fieldId}`);
            safeLog(`   📦 VALOR RAW: ${rawValueDescription}`);
            safeLog(`   📝 RESUMO: ${ticketDetails.fields.summary?.substring(0, 100)}...`);
            safeLog(`   🔍 JSON COMPLETO DO CAMPO:`);
            safeLog(`      ${JSON.stringify(fieldValue, null, 2).split('\n').join('\n      ')}`);
            safeLog(`${'🚨'.repeat(30)}\n`);
          }
        }
        
        // Pequeno delay para não sobrecarregar
        if (ticketsAnalyzed % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // Relatório final
      safeLog('\n════════════════════════════════════════════════════════');
      safeLog('📊 RELATÓRIO DA BUSCA FORENSE');
      safeLog('════════════════════════════════════════════════════════\n');
      
      safeLog(`✅ Tickets analisados: ${ticketsAnalyzed}`);
      safeLog(`\n🎯 NOTAS ENCONTRADAS (incluindo nota 1 para validação):\n`);
      
      for (const rating of TARGET_RATINGS) {
        const count = findings[rating].length;
        const emoji = rating === 1 ? '⭐' : `${'⭐'.repeat(rating)}`;
        safeLog(`${emoji} Nota ${rating}: ${count} ticket(s) encontrado(s)`);
        
        if (count > 0) {
          // Agrupar por campo
          const byField = {};
          findings[rating].forEach(f => {
            if (!byField[f.fieldId]) {
              byField[f.fieldId] = [];
            }
            byField[f.fieldId].push(f);
          });
          
          safeLog(`   📋 Campos que contêm nota ${rating}:`);
          Object.entries(byField).forEach(([fieldId, tickets]) => {
            safeLog(`      ✅ ${fieldId}: ${tickets.length} ticket(s)`);
            // Mostrar primeiros 3 tickets como exemplo
            tickets.slice(0, 3).forEach(t => {
              safeLog(`         - ${t.ticket} (${t.created?.substring(0, 10)}): ${t.summary}`);
            });
          });
          safeLog('');
        }
      }
      
      // Sugestão de configuração
      safeLog('\n💡 PRÓXIMOS PASSOS:\n');
      const allFieldsFound = new Set();
      Object.values(findings).forEach(ratingFindings => {
        ratingFindings.forEach(f => allFieldsFound.add(f.fieldId));
      });
      
      if (allFieldsFound.size > 0) {
        safeLog('✅ Campos de avaliação identificados:');
        allFieldsFound.forEach(fieldId => {
          const ratingsInField = [];
          TARGET_RATINGS.forEach(rating => {
            if (findings[rating].some(f => f.fieldId === fieldId)) {
              ratingsInField.push(rating);
            }
          });
          safeLog(`   📌 ${fieldId} (contém notas: ${ratingsInField.join(', ')})`);
        });
        
        safeLog('\n📝 Adicione estes campos no config.json:');
        safeLog('   "evaluatedTicketsSatisfactionField": [');
        Array.from(allFieldsFound).forEach((fieldId, index) => {
          const comma = index < allFieldsFound.size - 1 ? ',' : '';
          safeLog(`     "${fieldId}"${comma}`);
        });
        safeLog('   ]');
        
        // Validação especial para customfield_30195
        if (allFieldsFound.has('customfield_30195')) {
          const count = findings[1].filter(f => f.fieldId === 'customfield_30195').length;
          safeLog(`\n✅ customfield_30195 CONFIRMADO como campo de avaliação!`);
          safeLog(`   Encontradas ${count} avaliações de 1 estrela neste campo.`);
        }
      } else {
        safeLog('❌ Nenhuma nota 1, 2, 3 ou 4 foi encontrada nos tickets analisados');
        safeLog('💡 Possibilidades:');
        safeLog('   - Todos os seus tickets avaliados realmente têm apenas nota 5');
        safeLog('   - As notas estão em campos com formato diferente');
        safeLog('   - As notas estão em tickets com outros status além de Resolved/Cancelado');
      }
      
      safeLog('\n════════════════════════════════════════════════════════\n');
      
      return findings;
      
    } catch (error) {
      console.error('❌ Erro na busca forense:', error);
      console.error(error.stack);
      return null;
    }
  }

  async _getTodayUserComments() {
    try {
      const assignee = this._getAssignee();
      const userEmail = this.monitorOtherUser && this.otherUserEmail ? this.otherUserEmail : this.email;
      
      // Buscar tickets atualizados hoje onde o usuário é assignee
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
      const jql = `assignee = ${assignee} AND updated >= "${todayStr}" ORDER BY updated DESC`;
      
      const data = await this._searchJql(jql, ['key', 'summary', 'comment', 'project', 'customfield_10123', 'customfield_10124']);
      
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const commentsToday = [];
      
      // Verificar comentários em cada ticket
      for (const issue of (data.issues || [])) {
        const comments = issue.fields.comment?.comments || [];
        
        // Filtrar comentários feitos pelo usuário hoje
        const userCommentsToday = comments.filter(comment => {
          const commentDate = new Date(comment.created);
          const authorEmail = comment.author.emailAddress || comment.author.name;
          
          return commentDate >= startOfDay && authorEmail === userEmail;
        });
        
        // Adicionar à lista
        userCommentsToday.forEach(comment => {
          commentsToday.push({
            ticketKey: issue.key,
            ticketSummary: issue.fields.summary,
            commentCreated: comment.created,
            commentBody: this._convertADFToHTML(comment.body)
          });
        });
      }
      
      safeLog(`💬 Comentários feitos hoje: ${commentsToday.length}`, {
        ticketsVerificados: data.issues?.length || 0,
        comentariosEncontrados: commentsToday.map(c => ({ ticket: c.ticketKey, data: c.commentCreated }))
      });
      
      return commentsToday;
    } catch (error) {
      console.error('❌ Erro ao buscar comentários de hoje:', error);
      return [];
    }
  }


  async getTicketSla(ticketKey) {
    try {
      const slaResponse = await this._makeRequest(`/rest/servicedeskapi/request/${ticketKey}/sla`);
      const slaData = slaResponse?.values || [];
      
      if (slaData.length === 0) {
        return null;
      }
      
      const slaInfo = {};
      
      slaData.forEach(sla => {
        const slaName = sla.name.toLowerCase();
        
        if (slaName.includes('time to resolution')) {
          slaInfo.timeToResolution = {
            name: sla.name,
            ongoingCycle: sla.ongoingCycle || null,
            completedCycles: sla.completedCycles || [],
            _links: sla._links
          };
        }
        
        if (slaName.includes('time to first response')) {
          slaInfo.timeToFirstResponse = {
            name: sla.name,
            ongoingCycle: sla.ongoingCycle || null,
            completedCycles: sla.completedCycles || [],
            _links: sla._links
          };
        }
      });
      
      return Object.keys(slaInfo).length > 0 ? slaInfo : null;
    } catch (error) {
      safeLog(`⚠️ Erro ao buscar SLA para ${ticketKey}:`, error.message);
      return null;
    }
  }

  async getTicketDetails(ticketKey) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}`;
      const fields = 'status,summary,description,assignee,reporter,priority,created,updated,duedate,comment,attachment,project,customfield_*';
      
      const [ticketData, editMetaData, transitionsData] = await Promise.all([
        this._makeRequest(`${endpoint}?fields=${fields}`),
        this._makeRequest(`${endpoint}/editmeta`),
        this._makeRequest(`${endpoint}/transitions`)
      ]);
      
      // Buscar dados de SLA (Service Level Agreement)
      let slaData = null;
      try {
        const slaResponse = await this._makeRequest(`${this.baseUrl}/rest/servicedeskapi/request/${ticketKey}/sla`);
        slaData = slaResponse?.values || [];
        safeLog(`📊 SLA data for ${ticketKey}:`, slaData);
      } catch (slaError) {
        safeLog(`⚠️ Não foi possível buscar SLA para ${ticketKey}:`, slaError.message);
      }

      const issue = ticketData.fields;
      
      // Processar descrição
      const description = issue.description ? this._convertADFToHTML(issue.description) : '<p>Sem descrição</p>';
      
      // Processar comentários
      const comments = issue.comment?.comments || [];
      safeLog(`💬 Processando ${comments.length} comentários para ${ticketKey}`);
      
      const processedComments = comments.map(comment => {
        try {
          return {
            id: comment.id,
            author: comment.author?.displayName || 'Desconhecido',
            authorAccountId: comment.author?.accountId || '',
            created: comment.created,
            body: this._convertADFToHTML(comment.body),
            isInternal: comment.jsdPublic === false || comment.properties?.some(p => p.key === 'sd.public.comment' && p.value?.internal === true)
          };
        } catch (err) {
          console.error('❌ Erro ao processar comentário:', err);
          return {
            id: comment.id || 'unknown',
            author: 'Erro',
            authorAccountId: '',
            created: new Date().toISOString(),
            body: '<p>Erro ao processar comentário</p>',
            isInternal: false
          };
        }
      });
      
      // Processar anexos
      const attachments = issue.attachment || [];
      const processedAttachments = attachments.map(att => ({
        id: att.id,
        filename: att.filename,
        size: att.size,
        mimeType: att.mimeType,
        created: att.created,
        author: att.author.displayName,
        content: att.content,
        thumbnail: att.thumbnail
      }));
      
      // Processar campos customizados
      const customFields = {};
      const editMeta = editMetaData.fields || {};
      let supportLevel = null;
      let team = null;
      
      Object.keys(editMeta).forEach(fieldId => {
        const field = editMeta[fieldId];
        if (fieldId.startsWith('customfield_')) {
          const value = issue[fieldId];
          let displayValue = '';
          
          if (value) {
            if (typeof value === 'object' && value.value) {
              displayValue = value.value;
            } else if (typeof value === 'string') {
              displayValue = value;
            } else if (Array.isArray(value)) {
              displayValue = value.map(v => v.value || v).join(', ');
            }
          }
          
          customFields[fieldId] = {
            id: fieldId,
            name: field.name,
            value: displayValue,
            schema: field.schema
          };
          
          // Identificar campos específicos
          if (field.name && field.name.toLowerCase().includes('support level')) {
            supportLevel = displayValue;
          }
          if (field.name && field.name.toLowerCase().includes('itops team')) {
            team = displayValue;
          }
        }
      });
      
      // Processar transições disponíveis
      const availableTransitions = transitionsData.transitions.map(t => ({
        id: t.id,
        name: t.name,
        to: t.to
      }));
      
      // Processar dados de SLA
      let slaInfo = null;
      if (slaData && slaData.length > 0) {
        slaInfo = {};
        
        slaData.forEach(sla => {
          const slaName = sla.name.toLowerCase();
          
          if (slaName.includes('time to resolution')) {
            slaInfo.timeToResolution = {
              name: sla.name,
              ongoingCycle: sla.ongoingCycle || null,
              completedCycles: sla.completedCycles || [],
              _links: sla._links
            };
          }
          
          if (slaName.includes('time to first response')) {
            slaInfo.timeToFirstResponse = {
              name: sla.name,
              ongoingCycle: sla.ongoingCycle || null,
              completedCycles: sla.completedCycles || [],
              _links: sla._links
            };
          }
        });
        
        safeLog(`📊 SLA processado:`, slaInfo);
      }
      
      const ticketDetails = {
        key: ticketKey,
        summary: issue.summary,
        description,
        status: {
          name: issue.status.name,
          id: issue.status.id
        },
        assignee: issue.assignee ? {
          displayName: issue.assignee.displayName,
          accountId: issue.assignee.accountId,
          emailAddress: issue.assignee.emailAddress
        } : null,
        reporter: issue.reporter ? {
          displayName: issue.reporter.displayName,
          accountId: issue.reporter.accountId,
          emailAddress: issue.reporter.emailAddress
        } : null,
        priority: issue.priority ? issue.priority.name : 'N/A',
        created: issue.created,
        updated: issue.updated,
        duedate: issue.duedate,
        comments: processedComments,
        attachments: processedAttachments,
        customFields,
        availableTransitions,
        project: issue.project.key,
        supportLevel: supportLevel,
        team: team,
        sla: slaInfo
      };
      
      safeLog(`✅ Ticket ${ticketKey} processado:`, {
        key: ticketDetails.key,
        summary: ticketDetails.summary,
        commentsCount: ticketDetails.comments?.length || 0,
        attachmentsCount: ticketDetails.attachments?.length || 0
      });
      
      return ticketDetails;
    } catch (error) {
      console.error(`❌ Erro ao buscar detalhes do ticket ${ticketKey}:`, error);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  _convertADFToHTML(content) {
    if (!content) return '';
    
    if (typeof content === 'string') {
      return `<p>${content}</p>`;
    }
    
    // Log para debug
    safeLog('🔍 Convertendo ADF para HTML:', JSON.stringify(content, null, 2));
    
    if (content.type === 'doc') {
      return content.content.map(node => this._convertNodeToHTML(node)).join('');
    }
    
    return this._convertNodeToHTML(content);
  }

  _autoLinkUrls(text) {
    // Regex para detectar URLs (http, https, www)
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
    
    return text.replace(urlRegex, (url) => {
      let href = url;
      // Se começa com www, adicionar http://
      if (url.startsWith('www.')) {
        href = 'http://' + url;
      }
      return `<a href="${href}" target="_blank" class="jira-link auto-link">${url}</a>`;
    });
  }

  _convertNodeToHTML(node) {
    if (!node) return '';
    
    switch (node.type) {
      case 'paragraph':
        const pContent = node.content ? node.content.map(n => this._convertNodeToHTML(n)).join('') : '';
        return `<p>${pContent}</p>`;
        
      case 'text':
        let text = node.text || '';
        
        // Aplicar marcações (negrito, itálico, link, etc)
        if (node.marks) {
          node.marks.forEach(mark => {
            switch (mark.type) {
              case 'strong':
                text = `<strong>${text}</strong>`;
                break;
              case 'em':
                text = `<em>${text}</em>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
              case 'link':
                text = `<a href="${mark.attrs.href}" target="_blank" class="jira-link">${text}</a>`;
                break;
            }
          });
        } else {
          // Se não tem marcação de link, detectar URLs automaticamente
          text = this._autoLinkUrls(text);
        }
        return text;
        
      case 'mention':
        // Garantir que a menção tenha @ no início
        const mentionText = node.attrs.text || node.attrs.displayName || 'Unknown';
        const displayText = mentionText.startsWith('@') ? mentionText : `@${mentionText}`;
        return `<span class="mention" data-account-id="${node.attrs.id || ''}">${displayText}</span>`;
        
      case 'hardBreak':
        return '<br>';
        
      case 'bulletList':
        const bulletItems = node.content.map(n => this._convertNodeToHTML(n)).join('');
        return `<ul>${bulletItems}</ul>`;
        
      case 'orderedList':
        const orderedItems = node.content.map(n => this._convertNodeToHTML(n)).join('');
        return `<ol>${orderedItems}</ol>`;
        
      case 'listItem':
        const listContent = node.content.map(n => this._convertNodeToHTML(n)).join('');
        return `<li>${listContent}</li>`;
        
      case 'heading':
        const level = node.attrs?.level || 1;
        const headingContent = node.content.map(n => this._convertNodeToHTML(n)).join('');
        return `<h${level}>${headingContent}</h${level}>`;
        
      case 'codeBlock':
        const code = node.content.map(n => n.text).join('');
        return `<pre><code>${code}</code></pre>`;
        
      case 'inlineCard':
      case 'blockCard':
        // Cards do Jira (links para Confluence, etc)
        const cardUrl = node.attrs?.url || '';
        const cardTitle = node.attrs?.data?.title || node.attrs?.title || cardUrl;
        if (cardUrl) {
          return `<a href="${cardUrl}" target="_blank" class="jira-link jira-card">🔗 ${cardTitle}</a>`;
        }
        return '';
        
      case 'mediaSingle':
        // Imagens/mídia
        if (node.content && node.content[0] && node.content[0].type === 'media') {
          const mediaNode = node.content[0];
          const mediaUrl = mediaNode.attrs?.url || '';
          const mediaAlt = mediaNode.attrs?.alt || 'Image';
          if (mediaUrl) {
            return `<img src="${mediaUrl}" alt="${mediaAlt}" style="max-width: 100%; height: auto;">`;
          }
        }
        return '';
        
      case 'emoji':
        // Emojis
        const emojiText = node.attrs?.text || node.attrs?.shortName || '';
        return emojiText;
        
      default:
        safeLog(`⚠️ Tipo de nó ADF não suportado: ${node.type}`, node);
        if (node.content) {
          return node.content.map(n => this._convertNodeToHTML(n)).join('');
        }
        return '';
    }
  }

  async addComment(ticketKey, commentBody, isInternal = false, mentions = {}) {
    try {
      safeLog(`💬 Adicionando comentário ao ticket ${ticketKey}`);
      safeLog('📝 Menções:', mentions);
      
      const endpoint = `/rest/api/3/issue/${ticketKey}/comment`;
      
      // Construir conteúdo ADF com menções inline
      const paragraphContent = [];
      let currentText = commentBody;
      
      // Converter objeto de menções em array e ordenar por posição no texto
      const mentionsArray = Object.entries(mentions).map(([displayName, accountId]) => ({
        displayName,
        accountId,
        index: currentText.indexOf(`@${displayName}`)
      })).filter(m => m.index !== -1).sort((a, b) => a.index - b.index);
      
      let lastIndex = 0;
      
      // Processar cada menção em ordem
      mentionsArray.forEach(mention => {
        const mentionText = `@${mention.displayName}`;
        const mentionIndex = currentText.indexOf(mentionText, lastIndex);
        
        if (mentionIndex !== -1) {
          // Adicionar texto antes da menção
          if (mentionIndex > lastIndex) {
            paragraphContent.push({
              type: 'text',
              text: currentText.substring(lastIndex, mentionIndex)
            });
          }
          
          // Adicionar nó de menção
          paragraphContent.push({
            type: 'mention',
            attrs: {
              id: mention.accountId,
              text: `@${mention.displayName}`
            }
          });
          
          lastIndex = mentionIndex + mentionText.length;
        }
      });
      
      // Adicionar texto restante após última menção
      if (lastIndex < currentText.length) {
        paragraphContent.push({
          type: 'text',
          text: currentText.substring(lastIndex)
        });
      }
      
      // Se não houver menções, usar texto simples
      if (paragraphContent.length === 0) {
        paragraphContent.push({
          type: 'text',
          text: commentBody
        });
      }
      
      const payload = {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: paragraphContent
            }
          ]
        }
      };
      
      // Adicionar propriedades para comentários internos
      if (isInternal) {
        payload.properties = [
          {
            key: 'sd.public.comment',
            value: { internal: true }
          }
        ];
      }
      
      safeLog('📤 Payload do comentário:', JSON.stringify(payload, null, 2));
      
      const result = await this._makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      safeLog('✅ Comentário adicionado com sucesso!');
      return result;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  }

  async updateComment(ticketKey, commentId, commentBody, isInternal = false) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}/comment/${commentId}`;
      
      // Construir payload em formato ADF
      const payload = {
        body: {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: commentBody }]
          }]
        }
      };
      
      // Adicionar propriedades para comentários internos
      if (isInternal) {
        payload.properties = [
          {
            key: 'sd.public.comment',
            value: { internal: true }
          }
        ];
      }
      
      const result = await this._makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      return result;
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      throw error;
    }
  }

  async deleteComment(ticketKey, commentId) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}/comment/${commentId}`;
      
      await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json'
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      throw error;
    }
  }

  async addAttachment(ticketKey, filePath) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}/attachments`;
      
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'X-Atlassian-Token': 'no-check',
          ...form.getHeaders()
        },
        body: form
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao adicionar anexo (${response.status}): ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar anexo:', error);
      throw error;
    }
  }

  async downloadAttachment(attachmentId, filename, savePath) {
    try {
      const url = `${this.baseUrl}/rest/api/3/attachment/content/${attachmentId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${this.auth}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao baixar anexo (${response.status})`);
      }
      
      const buffer = await response.buffer();
      fs.writeFileSync(savePath, buffer);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
      throw error;
    }
  }

  getAttachmentUrl(attachmentId) {
    return `${this.baseUrl}/rest/api/3/attachment/content/${attachmentId}`;
  }

  async searchUsers(query, maxResults = 10) {
    try {
      const endpoint = `/rest/api/3/user/search?query=${encodeURIComponent(query)}&maxResults=${maxResults}`;
      const users = await this._makeRequest(endpoint);
      
      return users.map(user => ({
        accountId: user.accountId,
        displayName: user.displayName,
        emailAddress: user.emailAddress
      }));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async getCurrentUserAccountId() {
    try {
      const endpoint = '/rest/api/3/myself';
      const user = await this._makeRequest(endpoint);
      return user.accountId;
    } catch (error) {
      console.error('Erro ao obter accountId do usuário:', error);
      throw error;
    }
  }

  async getMonitoredUserAccountId() {
    try {
      // Se estiver monitorando outro usuário, buscar o accountId dele
      if (this.monitorOtherUser && this.otherUserEmail) {
        const endpoint = `/rest/api/3/user/search?query=${encodeURIComponent(this.otherUserEmail)}`;
        const users = await this._makeRequest(endpoint);
        if (users && users.length > 0) {
          return users[0].accountId;
        }
      }
      // Caso contrário, retornar o accountId do usuário logado
      return await this.getCurrentUserAccountId();
    } catch (error) {
      console.error('Erro ao obter accountId do usuário monitorado:', error);
      return await this.getCurrentUserAccountId();
    }
  }

  async updateTicketFields(ticketKey, fields) {
    try {
      // Se houver mudança de status, fazer transição primeiro
      if (fields.statusId) {
        const transitionEndpoint = `/rest/api/3/issue/${ticketKey}/transitions`;
        await this._makeRequest(transitionEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            transition: { id: fields.statusId }
          })
        });
      }
      
      // Atualizar outros campos
      const updateFields = {};
      
      if (fields.assignee) {
        updateFields.assignee = { accountId: fields.assignee };
      }
      
      if (fields.reporter) {
        updateFields.reporter = { accountId: fields.reporter };
      }
      
      if (fields.customFields) {
        Object.keys(fields.customFields).forEach(fieldId => {
          updateFields[fieldId] = { value: fields.customFields[fieldId] };
        });
      }
      
      if (Object.keys(updateFields).length > 0) {
        const endpoint = `/rest/api/3/issue/${ticketKey}`;
        await this._makeRequest(endpoint, {
          method: 'PUT',
          body: JSON.stringify({ fields: updateFields })
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar campos do ticket:', error);
      throw error;
    }
  }

  async getCustomFieldOptions(ticketKey, fieldId) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}/editmeta`;
      const data = await this._makeRequest(endpoint);
      
      const field = data.fields[fieldId];
      if (!field) {
        return [];
      }
      
      const allowedValues = field.allowedValues || [];
      
      return allowedValues.map(value => {
        if (typeof value === 'string') {
          return { id: value, name: value, value: value };
        }
        return {
          id: value.id || value.value,
          name: value.name || value.value,
          value: value.value
        };
      });
    } catch (error) {
      console.error('Erro ao obter opções do campo customizado:', error);
      throw error;
    }
  }

  async getRecentNotifications(maxResults = 15) {
    try {
      const assignee = this._getAssignee();
      const userEmail = this.monitorOtherUser && this.otherUserEmail ? this.otherUserEmail : this.email;
      
      safeLog('🔔 Buscando notificações para:', {
        monitorOtherUser: this.monitorOtherUser,
        otherUserEmail: this.otherUserEmail,
        userEmail: userEmail,
        assignee: assignee
      });
      
      // Buscar tickets onde o usuário é assignee, watcher ou reporter (últimos 7 dias)
      const jql = `(assignee = ${assignee} OR watcher = ${assignee} OR reporter = ${assignee}) AND updated >= -7d ORDER BY updated DESC`;
      
      const data = await this._searchJql(jql, ['key', 'summary', 'priority', 'updated', 'comment', 'assignee', 'project', 'customfield_10123', 'customfield_10124']);
      
      const notifications = [];
      // Usar o accountId do usuário monitorado (ou do usuário logado se não estiver monitorando)
      const monitoredUserAccountId = await this.getMonitoredUserAccountId();
      const currentUserAccountId = monitoredUserAccountId;
      
      safeLog('🔔 AccountId usado para filtrar notificações:', currentUserAccountId);
      
      // Iterar pelos tickets e buscar comentários/atividades
      for (const issue of data.issues) {
        const comments = issue.fields.comment?.comments || [];
        
        // Buscar menções e comentários relevantes
        comments.forEach(comment => {
          // Verificar se o usuário foi mencionado
          const isMention = comment.body?.content?.some(node => 
            node.content?.some(n => 
              n.type === 'mention' && (n.attrs?.id === currentUserAccountId || n.attrs?.text === userEmail)
            )
          );
          
          const isInternal = comment.jsdPublic === false;
          const isFromCurrentUser = comment.author.emailAddress === userEmail || 
                                   comment.author.accountId === currentUserAccountId;
          
          // Mostrar apenas se:
          // 1. Foi mencionado OU
          // 2. É um comentário público de OUTRA pessoa (não do próprio usuário)
          if (isMention || (!isInternal && !isFromCurrentUser)) {
            notifications.push({
              ticketKey: issue.key,
              ticketSummary: issue.fields.summary,
              priority: issue.fields.priority?.name || 'N/A',
              type: isMention ? 'mention' : 'comment',
              author: comment.author.displayName,
              created: comment.created,
              body: this._convertADFToHTML(comment.body),
              isInternal,
              commentId: comment.id // ✅ ID único do comentário para persistência
            });
          }
        });
      }
      
      // Ordenar por data (mais recente primeiro) e limitar
      notifications.sort((a, b) => new Date(b.created) - new Date(a.created));
      
      const result = notifications.slice(0, maxResults);
      safeLog('✅ Notificações encontradas:', result.length, 'de', notifications.length, 'total');
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  // Atualizar campo do ticket
  async updateTicketField(ticketKey, fieldName, value) {
    try {
      safeLog(`🔄 Atualizando ${fieldName} do ticket ${ticketKey} para: ${value}`);
      
      // Para STATUS, fazer transição
      if (fieldName === 'status') {
        const transitionEndpoint = `/rest/api/3/issue/${ticketKey}/transitions`;
        await this._makeRequest(transitionEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            transition: { id: value }
          })
        });
        safeLog(`✅ Status atualizado com sucesso!`);
        return;
      }
      
      // Para PRIORIDADE, atualizar o campo
      if (fieldName === 'priority') {
        const endpoint = `/rest/api/3/issue/${ticketKey}`;
        await this._makeRequest(endpoint, {
          method: 'PUT',
          body: JSON.stringify({
            fields: {
              priority: { name: value }
            }
          })
        });
        safeLog(`✅ Prioridade atualizada com sucesso!`);
        return;
      }
      
      let payload = { fields: {} };
      
      // Mapear o nome do campo para o ID correto no Jira
      switch (fieldName) {
        case 'assignee':
          // Se já é um accountId (começa com números/letras do formato Jira)
          if (value.length > 20 && !value.includes('@')) {
            payload.fields.assignee = { accountId: value };
          } else {
            // Buscar usuário por nome ou email
            const assigneeResult = await this._searchUser(value);
            payload.fields.assignee = { accountId: assigneeResult.accountId };
          }
          break;
          
        case 'reporter':
          // Se já é um accountId
          if (value.length > 20 && !value.includes('@')) {
            payload.fields.reporter = { accountId: value };
          } else {
            // Buscar usuário por nome ou email
            const reporterResult = await this._searchUser(value);
            payload.fields.reporter = { accountId: reporterResult.accountId };
          }
          break;
          
        case 'supportLevel':
          // Campo customizado Support Level - ITOPS
          // Ajuste o ID do campo conforme seu Jira
          payload.fields.customfield_10050 = { value: value };
          break;
          
        case 'team':
          // Campo customizado ITOps Team - identificar ID dinamicamente
          const teamFieldId = await this._identifyITOpsTeamField();
          safeLog(`📝 Atualizando ITOps Team usando campo: ${teamFieldId} = ${value}`);
          // O campo ITOps Team espera um array de valores
          payload.fields[teamFieldId] = [{ value: value }];
          break;
          
        default:
          throw new Error(`Campo ${fieldName} não suportado`);
      }
      
      const endpoint = `/rest/api/3/issue/${ticketKey}`;
      await this._makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      safeLog(`✅ Campo ${fieldName} atualizado com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar campo:', error);
      throw error;
    }
  }
  
  // Buscar prioridades disponíveis do Jira
  async getJiraPriorities() {
    try {
      const endpoint = '/rest/api/3/priority';
      const priorities = await this._makeRequest(endpoint);
      
      safeLog(`✅ ${priorities.length} prioridades encontradas`);
      
      return priorities.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description
      }));
    } catch (error) {
      console.error('Erro ao buscar prioridades:', error);
      // Retornar prioridades padrão como fallback
      return [
        { id: '1', name: 'Highest' },
        { id: '2', name: 'High' },
        { id: '3', name: 'Medium' },
        { id: '4', name: 'Low' },
        { id: '5', name: 'Lowest' }
      ];
    }
  }

  // Buscar usuário por nome ou email
  async _searchUser(query) {
    try {
      const endpoint = `/rest/api/3/user/search?query=${encodeURIComponent(query)}`;
      const users = await this._makeRequest(endpoint);
      
      if (!users || users.length === 0) {
        throw new Error(`Usuário "${query}" não encontrado`);
      }
      
      return users[0]; // Retorna o primeiro resultado
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Buscar usuários assignáveis para um projeto
  async getAssignableUsers(projectKey) {
    try {
      const endpoint = `/rest/api/3/user/assignable/search?project=${projectKey}&maxResults=100`;
      const users = await this._makeRequest(endpoint);
      
      return users.map(user => ({
        accountId: user.accountId,
        displayName: user.displayName,
        emailAddress: user.emailAddress,
        avatarUrl: user.avatarUrls?.['48x48']
      }));
    } catch (error) {
      console.error('Erro ao buscar usuários assignáveis:', error);
      throw error;
    }
  }

  // Identificar o ID do campo ITOps Team
  async _identifyITOpsTeamField() {
    if (this._cachedFieldIds.itopsTeam) {
      return this._cachedFieldIds.itopsTeam;
    }
    
    // Se não está em cache, tentar identificar
    try {
      const fieldsEndpoint = '/rest/api/3/field';
      const allFields = await this._makeRequest(fieldsEndpoint);
      
      const possibleFields = allFields.filter(f => 
        f.name && (
          f.name.toLowerCase().includes('itops team') ||
          f.name.toLowerCase() === 'team' ||
          f.name === 'ITOps Team' ||
          f.name === 'ITOPS TEAM'
        )
      );
      
      for (const field of possibleFields) {
        if (field.id.startsWith('customfield_')) {
          this._cachedFieldIds.itopsTeam = field.id;
          safeLog(`✅ Campo ITOps Team identificado: ${field.name} (${field.id})`);
          return field.id;
        }
      }
    } catch (err) {
      safeLog('⚠️ Erro ao identificar campo ITOps Team:', err.message);
    }
    
    // Fallback para ID padrão
    this._cachedFieldIds.itopsTeam = 'customfield_10051';
    return 'customfield_10051';
  }

  // Buscar opções de campo customizado (ITOps Team)
  async getITOpsTeamOptions() {
    try {
      safeLog('🔍 Buscando opções de ITOps Team do Jira...');
      
      // 1. Primeiro, buscar todos os campos para encontrar o campo ITOps Team
      let itopsTeamFieldId = null;
      let itopsTeamField = null;
      
      try {
        const fieldsEndpoint = '/rest/api/3/field';
        const allFields = await this._makeRequest(fieldsEndpoint);
        
        // Procurar por campos que contenham "itops team" no nome
        itopsTeamField = allFields.find(f => 
          f.name && f.name.toLowerCase().includes('itops team')
        );
        
        if (!itopsTeamField) {
          // Buscar por "team" genérico
          const teamFields = allFields.filter(f => 
            f.name && f.name.toLowerCase().includes('team') && f.id.startsWith('customfield_')
          );
          safeLog('🔍 Campos com "team" encontrados:', teamFields.map(f => ({ id: f.id, name: f.name })));
          
          // Pegar o primeiro que parece ser ITOps Team
          itopsTeamField = teamFields[0];
        }
        
        if (itopsTeamField) {
          itopsTeamFieldId = itopsTeamField.id;
          this._cachedFieldIds.itopsTeam = itopsTeamFieldId;
          safeLog(`✅ Campo encontrado: ${itopsTeamField.name} (${itopsTeamFieldId})`);
        }
      } catch (err) {
        safeLog('⚠️ Erro ao buscar campos do Jira:', err.message);
      }
      
      // Se não encontrou, tentar IDs comuns
      if (!itopsTeamFieldId) {
        safeLog('⚠️ Campo ITOps Team não encontrado, testando IDs comuns...');
        const commonFieldIds = ['customfield_10010', 'customfield_10051', 'customfield_10020', 'customfield_10030'];
        
        for (const fieldId of commonFieldIds) {
          try {
            const jqlQuery = 'project=IT';
            const fieldsArray = [fieldId];
            const result = await this._searchJql(jqlQuery, fieldsArray);
            if (result.issues && result.issues.length > 0) {
              itopsTeamFieldId = fieldId;
              this._cachedFieldIds.itopsTeam = fieldId;
              safeLog(`✅ Usando campo: ${fieldId}`);
              break;
            }
          } catch (err) {
            continue;
          }
        }
      }
      
      if (!itopsTeamFieldId) {
        safeLog('❌ Não foi possível identificar o campo ITOps Team');
        return this._getDefaultTeams();
      }
      
      // 2. Tentar buscar as opções do campo via API de contexts
      try {
        safeLog(`🔍 Buscando opções do campo ${itopsTeamFieldId} via contexts...`);
        const contextsEndpoint = `/rest/api/3/field/${itopsTeamFieldId}/context`;
        const contexts = await this._makeRequest(contextsEndpoint);
        
        if (contexts.values && contexts.values.length > 0) {
          const contextId = contexts.values[0].id;
          safeLog(`📋 Context ID encontrado: ${contextId}`);
          
          // Buscar opções do contexto
          const optionsEndpoint = `/rest/api/3/field/${itopsTeamFieldId}/context/${contextId}/option`;
          const optionsResult = await this._makeRequest(optionsEndpoint);
          
          if (optionsResult.values && optionsResult.values.length > 0) {
            const teams = optionsResult.values.map(opt => opt.value).sort();
            safeLog(`✅ ${teams.length} times encontrados via API:`, teams);
            return teams;
          }
        }
      } catch (err) {
        safeLog('⚠️ Erro ao buscar opções via contexts:', err.message);
      }
      
      // 3. Fallback: Buscar valores únicos de tickets existentes
      try {
        safeLog(`🔍 Buscando times de tickets existentes...`);
        const jqlQuery = 'project=IT';
        const fieldsArray = [itopsTeamFieldId];
        const searchResult = await this._searchJql(jqlQuery, fieldsArray);
        
        const teamsSet = new Set();
        searchResult.issues?.forEach(issue => {
          const team = issue.fields?.[itopsTeamFieldId];
          if (team) {
            if (typeof team === 'string') {
              teamsSet.add(team);
            } else if (team.value) {
              teamsSet.add(team.value);
            } else if (team.name) {
              teamsSet.add(team.name);
            }
          }
        });
        
        const teams = Array.from(teamsSet).sort();
        safeLog(`✅ ${teams.length} times únicos encontrados em tickets:`, teams);
        
        if (teams.length > 0) {
          return teams;
        }
      } catch (err) {
        safeLog('⚠️ Erro ao buscar times via JQL:', err.message);
      }
      
      // Fallback final para valores padrão
      return this._getDefaultTeams();
    } catch (error) {
      console.error('Erro ao buscar opções de ITOps Team:', error);
      return this._getDefaultTeams();
    }
  }

  _getDefaultTeams() {
    safeLog('⚠️ Usando valores padrão de ITOps Team');
    return [
      'TechCenter',
      'Infrastructure',
      'Security',
      'DevOps',
      'Network',
      'Database',
      'CloudOps',
      'SRE',
      'Platform',
      'Support',
      'Operations',
      'Monitoring',
      'PSDM'
    ];
  }

  // Buscar metadados de edição do ticket (campos disponíveis)
  async getTicketEditMetadata(ticketKey) {
    try {
      const endpoint = `/rest/api/3/issue/${ticketKey}/editmeta`;
      const metadata = await this._makeRequest(endpoint);
      
      const fields = {};
      
      // Processar cada campo disponível
      Object.keys(metadata.fields || {}).forEach(fieldKey => {
        const field = metadata.fields[fieldKey];
        fields[fieldKey] = {
          name: field.name,
          required: field.required,
          schema: field.schema,
          allowedValues: field.allowedValues || []
        };
      });
      
      return fields;
    } catch (error) {
      console.error('Erro ao buscar metadados do ticket:', error);
      throw error;
    }
  }


  // Upload de anexo
  async uploadAttachment(ticketKey, filePath) {
    try {
      safeLog(`📤 Fazendo upload de ${filePath} para ${ticketKey}`);
      
      const fs = require('fs');
      const path = require('path');
      const FormData = require('form-data');
      
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath), {
        filename: path.basename(filePath)
      });
      
      const endpoint = `/rest/api/3/issue/${ticketKey}/attachments`;
      const fullUrl = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`,
          'X-Atlassian-Token': 'no-check',
          ...form.getHeaders()
        },
        body: form
      });
      
      if (!response.ok) {
        throw new Error(`Upload falhou: ${response.statusText}`);
      }
      
      safeLog(`✅ Anexo enviado com sucesso!`);
    } catch (error) {
      console.error('Erro ao fazer upload de anexo:', error);
      throw error;
    }
  }

  // Download de anexo
  async downloadAttachment(attachmentId) {
    try {
      safeLog(`📥 Baixando anexo ${attachmentId}`);
      
      const endpoint = `/rest/api/3/attachment/content/${attachmentId}`;
      const fullUrl = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.email}:${this.apiToken}`).toString('base64')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Download falhou: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      safeLog(`✅ Anexo baixado com sucesso!`);
      
      return Buffer.from(buffer);
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
      throw error;
    }
  }
}

module.exports = JiraService;

