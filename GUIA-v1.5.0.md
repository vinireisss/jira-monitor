# 🎉 Guia de Uso - Jira Monitor v1.5.0

## 🆕 O que há de novo na v1.5.0?

Esta versão traz **3 grandes funcionalidades** que transformam o Jira Monitor em uma ferramenta ainda mais poderosa para gerenciamento de tickets:

1. **📊 Dashboard de Performance** - Métricas e análises detalhadas
2. **⏱️ Timer & Pomodoro** - Rastreamento de tempo com worklog automático
3. **🔔 Notificações** - Alertas do sistema

---

## 📊 Dashboard de Performance

### Como Acessar

1. Ative o **Modo Pro** (`Cmd+P`)
2. Role até encontrar a seção **"📊 Dashboard de Performance"**
3. Clique na seta para expandir os detalhes

### O que você vê

#### Resumo Rápido (sempre visível)
- **⏱️ Tempo Médio** - Tempo médio de resolução dos seus tickets
- **✅ Resolvidos** - Total de tickets resolvidos nos últimos 30 dias
- **📈 Por Semana** - Taxa de fechamento semanal

#### Detalhes Expandidos
- **🥧 Gráficos de Pizza** - Distribuição por prioridade e por projeto
- **🔥 Heatmap de Atividade** - Horários em que você é mais produtivo (0h-24h)
- **📋 Últimos 10 Resolvidos** - Lista clicável dos tickets recentemente fechados

### Como Usar

```bash
# Atualizar métricas manualmente
Clique no botão "Atualizar Métricas"

# Ver detalhes de um ticket resolvido
Clique em qualquer item da lista "Últimos 10 Resolvidos"

# Interpretar o Heatmap
- Células mais escuras = mais atividade naquele horário
- Passe o mouse sobre uma célula para ver o número exato
```

### Dicas
- O dashboard carrega automaticamente ao ativar o Modo Pro
- Os dados são baseados nos últimos 30 dias
- Use o heatmap para identificar seus horários mais produtivos
- Os gráficos de pizza ajudam a identificar padrões (ex: muitos tickets P1?)

---

## ⏱️ Timer & Pomodoro

### Como Abrir

- **Atalho**: `Cmd+T` ou `Ctrl+T`
- **Ou**: Menu Hambúrguer → (em breve será adicionado ao menu)

### Modos Disponíveis

#### 🕐 Modo Manual
- Timer livre para rastrear quanto tempo você gasta em um ticket
- Inicie, pause e pare quando quiser
- Útil para trabalho irregular ou tarefas que não seguem Pomodoro

#### 🍅 Modo Pomodoro
- **25 minutos** de trabalho focado
- **5 minutos** de pausa curta
- **15 minutos** de pausa longa (após 4 sessões)
- Notificação sonora ao completar cada sessão
- Ideal para manter foco e produtividade

### Como Usar

```bash
# 1. Abrir timer para um ticket específico
- Abra o preview do ticket
- Clique no botão "⏱️ Timer" (será adicionado)
- Ou use Cmd+T e selecione o ticket

# 2. Iniciar timer
Clique em "▶️ Iniciar"

# 3. Pausar (se necessário)
Clique em "⏸️ Pausar"

# 4. Parar e salvar
Clique em "⏹️ Parar"
Adicione um comentário (opcional)
Clique em "💾 Salvar Worklog no Jira"
```

### Worklog Automático

O timer pode salvar automaticamente o tempo trabalhado no Jira:

1. **Ative** "Salvar worklog automaticamente"
2. Quando o timer parar, o tempo será registrado automaticamente
3. No Modo Pomodoro, ao completar 25min, o worklog é salvo automaticamente

### Minimizar o Timer

- Clique no botão **"—"** para minimizar
- O timer continua rodando no canto da tela
- Clique no timer minimizado para restaurar

### Dicas
- Use o Modo Pomodoro para tarefas que exigem foco intenso
- Adicione comentários descritivos no worklog para rastrear o que foi feito
- O timer minimizado mostra o tempo em formato compacto (MM:SS)
- Sons de notificação ajudam a saber quando a sessão terminou

---

## 🚀 Fluxo de Trabalho Sugerido

### 1. Início do Dia
```bash
1. Abrir Jira Monitor
2. Ativar Modo Pro (Cmd+P)
3. Priorizar tickets com SLA crítico
```

### 2. Durante o Trabalho
```bash
1. Abrir ticket que vai trabalhar
2. Iniciar Timer (Cmd+T)
3. Escolher Modo Pomodoro para foco
4. Trabalhar até completar sessão
5. Fazer pausa quando o timer avisar
6. Worklog é salvo automaticamente
```

### 3. Final do Dia
```bash
1. Verificar Dashboard de Performance
2. Ver quantos tickets fechou hoje
3. Planejar dia seguinte baseado em métricas
```

---

## 🎯 Casos de Uso

### Para Analistas de Suporte L1/L2
- Use o Timer para rastrear tempo em cada ticket
- Dashboard mostra sua produtividade
- Heatmap ajuda a identificar melhor horário de trabalho

### Para Líderes de Equipe
- Dashboard mostra métricas de performance
- Gráficos de pizza revelam padrões (tipos de ticket, prioridades)
- Tempo médio de resolução indica eficiência

### Para Trabalho Focado
- Modo Pomodoro ajuda a manter foco
- Pausas regulares evitam burnout
- Worklog automático economiza tempo

### Para Gestão de SLA
- Alertas de SLA crítico evitam estouros
- Tickets sem resposta são identificados rapidamente
- Notificações desktop garantem visibilidade

---

## ⚙️ Configurações Recomendadas

### Para Máxima Produtividade
```json
{
  "proMode": true,
  "refreshInterval": 60,
  "soundNotifications": true,
  "desktopNotifications": true,
  "notifyNewTickets": true,
  "notifyStatusChanges": true,
  "notifyReassignments": true,
  "notifyMentions": true,
  "alertSla": true,
  "alertOldTickets": true,
  "oldTicketsDays": 7
}
```

### Para Trabalho Silencioso
```json
{
  "soundNotifications": false,
  "desktopNotifications": true (apenas visuais)
}
```

---

## 🐛 Solução de Problemas

### Dashboard não carrega
- Verifique conexão com Jira
- Certifique-se de ter tickets resolvidos nos últimos 30 dias
- Clique em "Atualizar Métricas"

### Timer não salva worklog
- Verifique permissões de API no Jira
- Confirme que o ticket existe e está acessível
- Tempo mínimo: 1 minuto (60 segundos)

### Alertas não aparecem
- Ative o Modo Pro
- Verifique permissões de notificações do sistema
- Aguarde 5 minutos para próxima verificação automática

### Gráficos não aparecem
- Expanda a seção "Dashboard de Performance"
- Aguarde alguns segundos para renderizar
- Recarregue com F5 se necessário

---

## 📞 Atalhos Rápidos v1.5.0

| Atalho | Ação | Novidade |
|--------|------|----------|
| `Cmd+T` | Abrir Timer | ✨ NOVO |
| `Cmd+P` | Ativar Modo Pro | Acessa Dashboard e Alertas |
| `Cmd+K` | Busca Rápida | - |
| `Cmd+R` | Atualizar | - |
| `Esc` | Fechar Modal | - |

---

## 🎓 Aprenda Mais

- **README.md** - Documentação completa
- **CHANGELOG.md** - Histórico de todas as versões
- **TROUBLESHOOTING.md** - Soluções de problemas
- **QUICK_START.md** - Início rápido

---

## ✨ Próximas Versões

Planejado para v1.6.0:
- [ ] Templates de resposta rápida
- [ ] Ações em massa (bulk actions)
- [ ] Filtros customizáveis salvos
- [ ] Integração com Slack

**Feedbacks e sugestões são bem-vindos!** 🚀

---

**Versão**: 1.5.0  
**Data**: 31 de Dezembro de 2025  
**Desenvolvido com ❤️ para a equipe de suporte**  
**Autores**: Gabriel Silva (@GABS SILVA) & Yanka Dantas (@ya)

