const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');

// 🔥 VERSÃO COM SLA COLORS - TESTE DE CARREGAMENTO
console.log('🔥🔥🔥 JIRA-SERVICE.JS CARREGADO - VERSÃO SLA COLORS v2.0 🔥🔥🔥');

class JiraService {
  constructor(config) {
    this.baseUrl = config.jiraUrl || 'https://nubank.atlassian.net';
    this.email = config.jiraEmail;
    this.apiToken = config.jiraApiToken;
    this.queueId = config.queueId || '1104';
    this.monitorOtherUser = config.monitorOtherUser || false;
    this.otherUserEmail = config.otherUserEmail || '';
    
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
      
      console.log('✅ Worklog adicionado:', ticketKey, timeSpentSeconds, 'segundos');
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
    
    // 🔥 Query para agrupar TODOS os projetos (não apenas IT)
    const allProjectsJql = `assignee = ${assignee} AND resolution = Unresolved AND status NOT IN ("Cancelled", "Canceled", "Cancelado", "Closed") ORDER BY updated DESC`;

    try {
      // 🎯 Campos de SLA do Jira Service Management
      const slaFields = ['customfield_10123', 'customfield_10124', 'customfield_10001', 'customfield_10002'];
      const baseFields = ['status', 'summary', 'key', 'updated', 'created', 'project', 'duedate', 'resolutiondate', 'assignee'];
      const allFields = [...baseFields, ...slaFields];
      
      const [totalData, supportData, customerData, pendingData, todayCreatedData, allProjectsData] = await Promise.all([
        this._searchJql(totalJql, allFields),
        this._searchJql(supportJql, [...baseFields, ...slaFields]),
        this._searchJql(customerJql, [...baseFields, ...slaFields]),
        this._searchJql(pendingJql, [...baseFields, ...slaFields]),
        this._searchJql(todayCreatedJql, ['status', 'summary', 'key', 'created', 'resolutiondate', 'customfield_10123', 'customfield_10124']),
        this._searchJql(allProjectsJql, [...baseFields, ...slaFields])
      ]);

      console.log('📦 Dados recebidos das queries:', {
        totalData: { total: totalData.issues?.length },
        supportData: { total: supportData.issues?.length },
        customerData: { total: customerData.issues?.length },
        pendingData: { total: pendingData.issues?.length },
        todayCreatedData: { total: todayCreatedData.issues?.length },
        allProjectsData: { total: allProjectsData.issues?.length }
      });

      // A API /search/jql não retorna 'total', então usamos issues.length
      const total = totalData.issues?.length || 0;
      const waitingForSupport = supportData.issues?.length || 0;
      const waitingForCustomer = customerData.issues?.length || 0;
      const pending = pendingData.issues?.length || 0;

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
        updated: issue.fields.updated
      }));

      // Calcular atividade diária
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      // Tickets recebidos hoje = todos os tickets criados hoje (da query específica)
      const todayReceived = todayCreatedData.issues || [];
      
      // Tickets fechados hoje = filtrar os que foram resolvidos hoje
      // Combinar totalData (tickets abertos) + todayCreatedData (pode ter fechados de hoje)
      const allTicketsToCheck = [
        ...totalData.issues,
        ...todayCreatedData.issues
      ];
      
      // Remover duplicatas e filtrar apenas os fechados hoje
      const uniqueTickets = new Map();
      allTicketsToCheck.forEach(issue => {
        if (!uniqueTickets.has(issue.key)) {
          uniqueTickets.set(issue.key, issue);
        }
      });
      
      const todayResolved = Array.from(uniqueTickets.values()).filter(issue => {
        const resolutionDate = issue.fields.resolutiondate ? new Date(issue.fields.resolutiondate) : null;
        const status = issue.fields.status?.name || '';
        const closedStatuses = ['Fechado', 'Closed', 'Resolvido', 'Resolved', 'Concluído', 'Concluido', 'Done'];
        return resolutionDate && resolutionDate >= startOfDay && closedStatuses.includes(status);
      });
      
      console.log('📊 Atividade diária calculada:', {
        recebidos: todayReceived.length,
        fechados: todayResolved.length,
        ticketsRecebidos: todayReceived.map(t => ({ key: t.key, created: t.fields.created })),
        ticketsFechados: todayResolved.map(t => ({ key: t.key, resolved: t.fields.resolutiondate }))
      });

      // Dados de tendência (implementaremos histórico real)
      console.log('📈 1. Buscando trend data...');
      const trend = await this._getTrendData();
      console.log('✅ 1. Trend data OK');

      // Tickets de Telefonia SIM cards (Modo Pro)
      console.log('📱 2. Buscando SIM cards...');
      const simCardsTickets = await this._getSimCardsTickets();
      console.log('✅ 2. SIM cards OK:', simCardsTickets?.count || 0);

      // Tickets Avaliados (Modo Pro)
      console.log('⭐ 3. Buscando tickets avaliados...');
      const evaluatedTickets = await this._getEvaluatedTickets();
      console.log('✅ 3. Tickets avaliados OK:', evaluatedTickets?.count || 0);

      // Contar comentários feitos hoje pelo usuário
      console.log('💬 4. INDO BUSCAR COMENTÁRIOS...');
      const todayComments = await this._getTodayUserComments();
      console.log('✅ 4. COMENTÁRIOS RETORNADOS:', todayComments?.length || 0);

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
        supportTickets: supportData.issues.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          fields: issue.fields  // 🎨 Incluir fields completo para SLA
        })),
        customerTickets: customerData.issues.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          fields: issue.fields  // 🎨 Incluir fields completo para SLA
        })),
        pendingTickets: pendingData.issues.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          fields: issue.fields  // 🎨 Incluir fields completo para SLA
        })),
        byProject,
        recentTickets,
        trend,
        simCardsTickets,
        evaluatedTickets,
        // Dados de atividade diária (calculados dos tickets existentes)
        todayReceived: todayReceived,
        todayResolved: todayResolved,
        todayComments: todayComments
      };
    } catch (error) {
      console.error('❌❌❌ ERRO AO BUSCAR ESTATÍSTICAS:', error);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  async _searchJql(jql, fields = ['status', 'summary', 'key']) {
    const endpoint = `/rest/api/3/search/jql`;
    
    // Garantir que fields é um array
    if (!fields || !Array.isArray(fields)) {
      fields = ['status', 'summary', 'key'];
    }
    
    const body = {
      jql,
      fields,
      maxResults: 1000
    };

    const slaFields = fields.filter(f => f && f.includes('customfield_10'));
    if (slaFields.length > 0) {
      console.log('📤 Solicitando campos à API Jira:', slaFields);
    }

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
        console.log('📥 API Jira retornou customfield_10123?', hasCustom10123);
        console.log('📥 API Jira retornou customfield_10124?', hasCustom10124);
      }
    }

    return data;
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
        slaStatus: this._getSlaStatus(slaDueDate, issue) // 🎯 Passar o issue completo
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

  _getSlaStatus(duedate, issue = null) {
    if (!duedate) return 'unknown';
    
    // 🎯 PRIORIDADE: Verificar campo 'breached' do Jira Service Management
    if (issue && issue.fields) {
      // Verificar customfield_10123 (Time to resolution)
      const timeToResolution = issue.fields.customfield_10123;
      if (timeToResolution) {
        // Verificar ongoingCycle.breached
        if (timeToResolution.ongoingCycle && timeToResolution.ongoingCycle.breached === true) {
          console.log(`🔴 SLA BREACHED detectado em customfield_10123 para ${issue.key}`);
          return 'overdue'; // 🔴 Estourado (campo breached = true)
        }
        // Verificar completedCycles (quando o SLA já foi completado)
        if (timeToResolution.completedCycles && timeToResolution.completedCycles.length > 0) {
          const lastCycle = timeToResolution.completedCycles[timeToResolution.completedCycles.length - 1];
          if (lastCycle.breached === true) {
            console.log(`🔴 SLA BREACHED detectado em completedCycles (customfield_10123) para ${issue.key}`);
            return 'overdue'; // 🔴 Estourado
          }
        }
      }
      
      // Verificar customfield_10124 (Time to first response)
      const timeToFirstResponse = issue.fields.customfield_10124;
      if (timeToFirstResponse) {
        if (timeToFirstResponse.ongoingCycle && timeToFirstResponse.ongoingCycle.breached === true) {
          console.log(`🔴 SLA BREACHED detectado em customfield_10124 para ${issue.key}`);
          return 'overdue'; // 🔴 Estourado
        }
        if (timeToFirstResponse.completedCycles && timeToFirstResponse.completedCycles.length > 0) {
          const lastCycle = timeToFirstResponse.completedCycles[timeToFirstResponse.completedCycles.length - 1];
          if (lastCycle.breached === true) {
            console.log(`🔴 SLA BREACHED detectado em completedCycles (customfield_10124) para ${issue.key}`);
            return 'overdue'; // 🔴 Estourado
          }
        }
      }
    }
    
    // Se não tem campo breached, calcular baseado no tempo
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
      
      const data = await this._searchJql(jql, ['status', 'summary', 'key', 'duedate', 'updated', 'project', 'customfield_10123', 'customfield_10124']);
      
      return {
        count: data.issues?.length || 0,
        tickets: (data.issues || []).map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          duedate: issue.fields.duedate,
          updated: issue.fields.updated
        })),
        jql: jql
      };
    } catch (error) {
      console.error('Erro ao buscar tickets de SIM cards:', error);
      return { count: 0, tickets: [], jql: '' };
    }
  }

  async _getTodayUserComments() {
    console.log('🚀🚀🚀 === FUNÇÃO _getTodayUserComments INICIADA ===');
    try {
      const assignee = this._getAssignee();
      const userEmail = this.monitorOtherUser && this.otherUserEmail ? this.otherUserEmail : this.email;
      console.log('👤 Email:', userEmail, '| Assignee:', assignee);
      
      // Buscar TODOS os tickets comentados hoje (não apenas onde é assignee)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Query 1: Tickets onde é assignee E foram atualizados hoje
      const jql1 = `assignee = ${assignee} AND updated >= "${todayStr}" ORDER BY updated DESC`;
      
      console.log(`🔍 Buscando comentários de hoje para: ${userEmail}`);
      console.log(`📅 Data de referência: ${todayStr}`);
      
      // Buscar apenas tickets do assignee atualizados hoje
      const data1 = await this._searchJql(jql1, ['key', 'summary', 'comment', 'project']);
      
      console.log(`📦 Tickets encontrados: ${data1.issues?.length || 0}`);
      
      const allIssues = data1.issues || [];
      
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const commentsToday = [];
      
      console.log(`📋 Total de tickets a verificar: ${allIssues.length}`);
      
      // Verificar comentários em cada ticket
      for (const issue of allIssues) {
        const comments = issue.fields.comment?.comments || [];
        
        console.log(`🎫 ${issue.key}: ${comments.length} comentários totais`);
        
        // Debug: mostrar estrutura dos comentários
        if (comments.length > 0) {
          console.log(`   📝 Primeiro comentário exemplo:`, {
            created: comments[0].created,
            author: comments[0].author?.emailAddress || comments[0].author?.name,
            displayName: comments[0].author?.displayName
          });
        }
        
        // Filtrar comentários feitos pelo usuário hoje
        const userCommentsToday = comments.filter(comment => {
          const commentDate = new Date(comment.created);
          const authorEmail = comment.author?.emailAddress || comment.author?.name || '';
          const authorDisplayName = comment.author?.displayName || '';
          
          const isToday = commentDate >= startOfDay;
          const isUserComment = authorEmail === userEmail || 
                               authorEmail.toLowerCase() === userEmail.toLowerCase() ||
                               authorDisplayName.includes(userEmail.split('@')[0]);
          
          console.log(`   🔍 Verificando comentário de ${commentDate.toISOString().split('T')[0]} por ${authorEmail}`);
          console.log(`      isToday: ${isToday}, isUserComment: ${isUserComment}`);
          console.log(`      startOfDay: ${startOfDay.toISOString()}, userEmail: ${userEmail}`);
          
          if (isToday && isUserComment) {
            console.log(`   ✅ Comentário encontrado: ${commentDate.toISOString()} por ${authorEmail}`);
          }
          
          return isToday && isUserComment;
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
      
      console.log(`💬 Comentários feitos hoje: ${commentsToday.length}`, {
        ticketsVerificados: allIssues.length,
        comentariosEncontrados: commentsToday.map(c => ({ ticket: c.ticketKey, data: c.commentCreated }))
      });
      
      return commentsToday;
    } catch (error) {
      console.error('❌❌❌ ERRO AO BUSCAR COMENTÁRIOS DE HOJE:', error);
      console.error('Stack trace:', error.stack);
      return [];
    }
  }

  async _getEvaluatedTickets() {
    try {
      // Buscar tickets do filtro 52358
      console.log('⭐ Buscando tickets avaliados (filtro 52358)...');
      const filterData = await this._makeRequest('/rest/api/3/filter/52358');
      const jql = filterData.jql;
      
      // Buscar metadata de campos do Jira para encontrar "Satisfaction"
      console.log('🔍 Buscando campo Satisfaction...');
      
      let satisfactionFieldId = null;
      
      // Tentar buscar os campos do Jira
      try {
        const fieldsMetadata = await this._makeRequest('/rest/api/3/field');
        
        // Procurar campo com nome "Satisfaction"
        for (const field of fieldsMetadata) {
          if (field.name === 'Satisfaction' || field.name === 'satisfaction') {
            satisfactionFieldId = field.id;
            console.log(`✅ Campo Satisfaction encontrado na metadata: ${field.id} (${field.name})`);
            break;
          }
        }
      } catch (err) {
        console.log('⚠️ Erro ao buscar metadata de campos:', err.message);
      }
      
      // Se não encontrou, tentar campos customizados comuns para satisfaction no JSM
      if (!satisfactionFieldId) {
        console.log('🔍 Tentando campos customizados comuns...');
        const commonFields = [
          'customfield_10200', // Satisfaction comum JSM
          'customfield_10043', // CSAT comum
          'customfield_10002', // Feedback comum
          'customfield_10010'  // Request Satisfaction
        ];
        
        // Buscar um ticket para testar os campos
        const testData = await this._searchJql(jql, ['key', ...commonFields]);
        
        if (testData.issues && testData.issues.length > 0) {
          // Verificar qual campo tem valor não-nulo
          for (const fieldId of commonFields) {
            for (const issue of testData.issues.slice(0, 5)) {
              if (issue.fields[fieldId] !== null && issue.fields[fieldId] !== undefined) {
                satisfactionFieldId = fieldId;
                console.log(`✅ Campo Satisfaction encontrado testando: ${fieldId}`, issue.fields[fieldId]);
                break;
              }
            }
            if (satisfactionFieldId) break;
          }
        }
      }
      
      if (!satisfactionFieldId) {
        console.warn('⚠️ Campo Satisfaction não encontrado! Retornando lista vazia.');
        return { count: 0, tickets: [], jql: jql };
      }
      
      console.log(`📌 Usando campo Satisfaction: ${satisfactionFieldId}`);
      
      // Buscar todos os tickets com o campo de satisfaction
      const data = await this._searchJql(jql, ['status', 'summary', 'key', 'updated', 'resolutiondate', 'assignee', satisfactionFieldId]);
      
      // Filtrar apenas tickets com Satisfaction preenchida
      const ticketsWithSatisfaction = data.issues.filter(issue => {
        const satisfactionValue = issue.fields[satisfactionFieldId];
        return satisfactionValue !== null && satisfactionValue !== undefined;
      });
      
      console.log(`✅ ${ticketsWithSatisfaction.length} tickets COM avaliação (de ${data.issues?.length || 0} total)`);
      
      // Retornar tickets com satisfação
      return {
        count: ticketsWithSatisfaction.length,
        tickets: ticketsWithSatisfaction.slice(0, 50).map(issue => {
          const satisfactionValue = issue.fields[satisfactionFieldId];
          let stars = '⭐';
          let ratingNumber = null;
          
          // Processar valor da satisfação
          if (satisfactionValue) {
            let ratingText = '';
            
            // Verificar diferentes formatos possíveis
            if (typeof satisfactionValue === 'object') {
              // Formato { rating: 5 } (Jira Service Management)
              if (satisfactionValue.rating !== undefined) {
                ratingNumber = satisfactionValue.rating;
              } 
              // Formato { value: "5" } (antigo)
              else if (satisfactionValue.value !== undefined) {
                ratingText = satisfactionValue.value;
              }
            } else if (typeof satisfactionValue === 'string') {
              ratingText = satisfactionValue;
            } else if (typeof satisfactionValue === 'number') {
              ratingNumber = satisfactionValue;
            }
            
            console.log(`⭐ ${issue.key} - Satisfaction:`, satisfactionValue, '→ Rating:', ratingNumber || ratingText);
            
            // Se já temos o número (rating), converter para estrelas
            if (ratingNumber !== null && ratingNumber !== undefined) {
              const numStars = Math.min(5, Math.max(1, parseInt(ratingNumber)));
              stars = '⭐'.repeat(numStars);
              console.log(`  → ${numStars} estrelas:`, stars);
            } 
            // Se temos texto, tentar extrair número
            else if (ratingText) {
              const lowerRating = String(ratingText).toLowerCase();
              
              if (lowerRating.includes('5') || lowerRating.includes('five')) {
                stars = '⭐⭐⭐⭐⭐';
                ratingNumber = 5;
              } else if (lowerRating.includes('4') || lowerRating.includes('four')) {
                stars = '⭐⭐⭐⭐';
                ratingNumber = 4;
              } else if (lowerRating.includes('3') || lowerRating.includes('three')) {
                stars = '⭐⭐⭐';
                ratingNumber = 3;
              } else if (lowerRating.includes('2') || lowerRating.includes('two')) {
                stars = '⭐⭐';
                ratingNumber = 2;
              } else if (lowerRating.includes('1') || lowerRating.includes('one')) {
                stars = '⭐';
                ratingNumber = 1;
              } else {
                // Tentar extrair número do texto
                const numMatch = ratingText.match(/\d+/);
                if (numMatch) {
                  ratingNumber = parseInt(numMatch[0]);
                  stars = '⭐'.repeat(Math.min(5, Math.max(1, ratingNumber)));
                }
              }
            }
          }
          
          // Calcular tempo desde resolução
          let timeAgo = '';
          if (issue.fields.resolutiondate) {
            const resolved = new Date(issue.fields.resolutiondate);
            const now = new Date();
            const diffDays = Math.floor((now - resolved) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
              timeAgo = 'Hoje';
            } else if (diffDays === 1) {
              timeAgo = 'Ontem';
            } else if (diffDays < 7) {
              timeAgo = `${diffDays}d atrás`;
            } else if (diffDays < 30) {
              const weeks = Math.floor(diffDays / 7);
              timeAgo = `${weeks} sem atrás`;
            } else {
              const months = Math.floor(diffDays / 30);
              timeAgo = `${months} mês${months > 1 ? 'es' : ''} atrás`;
            }
          }
          
          return {
            key: issue.key,
            summary: issue.fields.summary,
            status: issue.fields.status?.name || 'N/A',
            updated: issue.fields.updated,
            resolutiondate: issue.fields.resolutiondate,
            assignee: issue.fields.assignee?.displayName || 'Não atribuído',
            timeAgo: timeAgo,
            ratingEmoji: stars,
            ratingNumber: ratingNumber,
            satisfaction: satisfactionValue
          };
        }),
        jql: jql
      };
    } catch (error) {
      console.error('❌ Erro ao buscar tickets avaliados:', error);
      return { count: 0, tickets: [], jql: '' };
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

      const issue = ticketData.fields;
      
      // Processar descrição
      const description = issue.description ? this._convertADFToHTML(issue.description) : '<p>Sem descrição</p>';
      
      // Processar comentários
      const comments = issue.comment?.comments || [];
      console.log(`💬 Processando ${comments.length} comentários para ${ticketKey}`);
      
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
        team: team
      };
      
      console.log(`✅ Ticket ${ticketKey} processado:`, {
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
    console.log('🔍 Convertendo ADF para HTML:', JSON.stringify(content, null, 2));
    
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
        const listContent = node.content ? node.content.map(n => this._convertNodeToHTML(n)).join('') : '';
        return `<li>${listContent}</li>`;
        
      case 'heading':
        const level = node.attrs?.level || 1;
        const headingContent = node.content ? node.content.map(n => this._convertNodeToHTML(n)).join('') : '';
        return `<h${level}>${headingContent}</h${level}>`;
        
      case 'codeBlock':
        const code = node.content ? node.content.map(n => n.text || '').join('') : '';
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
        console.log(`⚠️ Tipo de nó ADF não suportado: ${node.type}`, node);
        if (node.content) {
          return node.content.map(n => this._convertNodeToHTML(n)).join('');
        }
        return '';
    }
  }

  async addComment(ticketKey, commentBody, isInternal = false, mentions = {}) {
    try {
      console.log(`💬 Adicionando comentário ao ticket ${ticketKey}`);
      console.log('📝 Menções:', mentions);
      
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
      
      console.log('📤 Payload do comentário:', JSON.stringify(payload, null, 2));
      
      const result = await this._makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      console.log('✅ Comentário adicionado com sucesso!');
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
      
      console.log('🔔 Buscando notificações para:', {
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
      
      console.log('🔔 AccountId usado para filtrar notificações:', currentUserAccountId);
      
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
      console.log('✅ Notificações encontradas:', result.length, 'de', notifications.length, 'total');
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  // Atualizar campo do ticket
  async updateTicketField(ticketKey, fieldName, value) {
    try {
      console.log(`🔄 Atualizando ${fieldName} do ticket ${ticketKey} para: ${value}`);
      
      // Para STATUS, fazer transição
      if (fieldName === 'status') {
        const transitionEndpoint = `/rest/api/3/issue/${ticketKey}/transitions`;
        await this._makeRequest(transitionEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            transition: { id: value }
          })
        });
        console.log(`✅ Status atualizado com sucesso!`);
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
        console.log(`✅ Prioridade atualizada com sucesso!`);
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
          console.log(`📝 Atualizando ITOps Team usando campo: ${teamFieldId} = ${value}`);
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
      
      console.log(`✅ Campo ${fieldName} atualizado com sucesso!`);
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
      
      console.log(`✅ ${priorities.length} prioridades encontradas`);
      
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
          console.log(`✅ Campo ITOps Team identificado: ${field.name} (${field.id})`);
          return field.id;
        }
      }
    } catch (err) {
      console.log('⚠️ Erro ao identificar campo ITOps Team:', err.message);
    }
    
    // Fallback para ID padrão
    this._cachedFieldIds.itopsTeam = 'customfield_10051';
    return 'customfield_10051';
  }

  // Buscar opções de campo customizado (ITOps Team)
  async getITOpsTeamOptions() {
    try {
      console.log('🔍 Buscando opções de ITOps Team do Jira...');
      
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
          console.log('🔍 Campos com "team" encontrados:', teamFields.map(f => ({ id: f.id, name: f.name })));
          
          // Pegar o primeiro que parece ser ITOps Team
          itopsTeamField = teamFields[0];
        }
        
        if (itopsTeamField) {
          itopsTeamFieldId = itopsTeamField.id;
          this._cachedFieldIds.itopsTeam = itopsTeamFieldId;
          console.log(`✅ Campo encontrado: ${itopsTeamField.name} (${itopsTeamFieldId})`);
        }
      } catch (err) {
        console.log('⚠️ Erro ao buscar campos do Jira:', err.message);
      }
      
      // Se não encontrou, tentar IDs comuns
      if (!itopsTeamFieldId) {
        console.log('⚠️ Campo ITOps Team não encontrado, testando IDs comuns...');
        const commonFieldIds = ['customfield_10010', 'customfield_10051', 'customfield_10020', 'customfield_10030'];
        
        for (const fieldId of commonFieldIds) {
          try {
            const testEndpoint = `/rest/api/3/search?jql=project=IT&fields=${fieldId}&maxResults=1`;
            const result = await this._makeRequest(testEndpoint);
            if (result.issues && result.issues.length > 0) {
              itopsTeamFieldId = fieldId;
              this._cachedFieldIds.itopsTeam = fieldId;
              console.log(`✅ Usando campo: ${fieldId}`);
              break;
            }
          } catch (err) {
            continue;
          }
        }
      }
      
      if (!itopsTeamFieldId) {
        console.log('❌ Não foi possível identificar o campo ITOps Team');
        return this._getDefaultTeams();
      }
      
      // 2. Tentar buscar as opções do campo via API de contexts
      try {
        console.log(`🔍 Buscando opções do campo ${itopsTeamFieldId} via contexts...`);
        const contextsEndpoint = `/rest/api/3/field/${itopsTeamFieldId}/context`;
        const contexts = await this._makeRequest(contextsEndpoint);
        
        if (contexts.values && contexts.values.length > 0) {
          const contextId = contexts.values[0].id;
          console.log(`📋 Context ID encontrado: ${contextId}`);
          
          // Buscar opções do contexto
          const optionsEndpoint = `/rest/api/3/field/${itopsTeamFieldId}/context/${contextId}/option`;
          const optionsResult = await this._makeRequest(optionsEndpoint);
          
          if (optionsResult.values && optionsResult.values.length > 0) {
            const teams = optionsResult.values.map(opt => opt.value).sort();
            console.log(`✅ ${teams.length} times encontrados via API:`, teams);
            return teams;
          }
        }
      } catch (err) {
        console.log('⚠️ Erro ao buscar opções via contexts:', err.message);
      }
      
      // 3. Fallback: Buscar valores únicos de tickets existentes
      try {
        console.log(`🔍 Buscando times de tickets existentes...`);
        const searchEndpoint = `/rest/api/3/search?jql=project=IT&fields=${itopsTeamFieldId}&maxResults=500`;
        const searchResult = await this._makeRequest(searchEndpoint);
        
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
        console.log(`✅ ${teams.length} times únicos encontrados em tickets:`, teams);
        
        if (teams.length > 0) {
          return teams;
        }
      } catch (err) {
        console.log('⚠️ Erro ao buscar times via JQL:', err.message);
      }
      
      // Fallback final para valores padrão
      return this._getDefaultTeams();
    } catch (error) {
      console.error('Erro ao buscar opções de ITOps Team:', error);
      return this._getDefaultTeams();
    }
  }

  _getDefaultTeams() {
    console.log('⚠️ Usando valores padrão de ITOps Team');
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
      console.log(`📤 Fazendo upload de ${filePath} para ${ticketKey}`);
      
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
      
      console.log(`✅ Anexo enviado com sucesso!`);
    } catch (error) {
      console.error('Erro ao fazer upload de anexo:', error);
      throw error;
    }
  }

  // Download de anexo
  async downloadAttachment(attachmentId) {
    try {
      console.log(`📥 Baixando anexo ${attachmentId}`);
      
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
      console.log(`✅ Anexo baixado com sucesso!`);
      
      return Buffer.from(buffer);
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
      throw error;
    }
  }
}

module.exports = JiraService;

