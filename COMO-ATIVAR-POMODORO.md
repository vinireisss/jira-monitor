# 🍅 Como Ativar o Método Pomodoro

## Guia Rápido de Ativação

### 1️⃣ Abrir o Timer

Existem três formas de abrir o widget de timer:

**Opção A - Atalho de Teclado (Mais Rápido):**
- **macOS**: `Cmd + T`
- **Windows/Linux**: `Ctrl + T`

**Opção B - Menu Hambúrguer:**
- Clique no botão de **menu** (☰) no canto superior direito
- Selecione **"⏱️ Timer / Pomodoro"**

**Opção C - Interface Visual:**
- Abra um ticket (clique em qualquer ticket da lista)
- Procure pelo botão **"⏱️ Timer"** nos controles do ticket

---

### 2️⃣ Ativar o Modo Pomodoro

Quando o widget de timer abrir:

1. Você verá dois botões na parte superior:
   - 🕐 **Manual** (ativo por padrão)
   - 🍅 **Pomodoro**

2. **Clique no botão "Pomodoro"** para ativar o método

3. Você verá aparecer informações adicionais:
   - **Sessão**: 1/4 (controla o ciclo de 4 pomodoros)
   - **Próximo**: Pausa (5min) ou Pausa Longa (15min)

---

### 3️⃣ Iniciar uma Sessão Pomodoro

1. **Clique em "▶️ Iniciar"**
2. O timer começará a contar
3. Trabalhe focado por **25 minutos**

---

## ⏱️ Como Funciona o Pomodoro

### Ciclo Completo

| Sessão | Duração | Tipo | O que acontece |
|--------|---------|------|----------------|
| 1 | 25 min | Trabalho | Foco total no ticket |
| - | 5 min | Pausa | Descanso curto |
| 2 | 25 min | Trabalho | Foco total no ticket |
| - | 5 min | Pausa | Descanso curto |
| 3 | 25 min | Trabalho | Foco total no ticket |
| - | 5 min | Pausa | Descanso curto |
| 4 | 25 min | Trabalho | Foco total no ticket |
| - | 15 min | Pausa Longa | Descanso prolongado |

### O que acontece automaticamente:

✅ **Ao completar 25 min de trabalho:**
- Som de notificação toca
- Timer para automaticamente
- Mensagem: "✅ Pomodoro concluído! Hora da pausa."
- Worklog pode ser salvo automaticamente no Jira (se configurado)
- Timer inicia contagem da pausa

✅ **Ao completar a pausa:**
- Som de notificação toca
- Mensagem: "✅ Pausa concluída! De volta ao trabalho."
- Próxima sessão é iniciada
- Contador de sessões avança (1/4 → 2/4)

✅ **A cada 4 sessões:**
- Pausa longa de 15 minutos
- Depois, ciclo reinicia (volta para 1/4)

---

## 🎯 Recursos do Pomodoro

### 💾 Salvar Worklog Automaticamente

1. Marque a opção **"✓ Salvar worklog automaticamente"**
2. Quando completar 25 minutos, o tempo será registrado no Jira automaticamente
3. Você pode adicionar um comentário no campo de texto (opcional)

### ⏸️ Pausar o Timer

- Clique em **"⏸️ Pausar"** a qualquer momento
- O timer congela
- Clique em **"▶️ Iniciar"** para continuar de onde parou

### ⏹️ Parar o Timer

- Clique em **"⏹️ Parar"**
- O timer é resetado para 00:00:00
- Você pode salvar o worklog manualmente clicando em **"💾 Salvar Worklog no Jira"**

### 🔻 Minimizar o Widget

1. Clique no botão **"—"** (minimizar) no canto superior direito
2. O timer fica minimizado no canto da tela mostrando apenas o tempo
3. Clique no timer minimizado para restaurar

---

## 🚀 Dicas para Usar o Pomodoro Efetivamente

### ✨ Melhores Práticas

1. **Durante o trabalho (25 min):**
   - Feche notificações
   - Foque exclusivamente no ticket
   - Evite distrações

2. **Durante a pausa (5 min):**
   - Levante e estique o corpo
   - Beba água
   - Não trabalhe em tickets

3. **Durante a pausa longa (15 min):**
   - Afaste-se completamente do computador
   - Faça um lanche
   - Recarregue as energias

### 🎯 Quando Usar Pomodoro

✅ **Use Pomodoro para:**
- Tickets complexos que exigem foco profundo
- Debugging de problemas difíceis
- Desenvolvimento de soluções técnicas
- Análise de logs ou investigação forense

❌ **Não use Pomodoro para:**
- Respostas rápidas (< 5 minutos)
- Triagem de tickets
- Reuniões
- Tarefas muito fragmentadas

### ⚙️ Configurações Recomendadas

```bash
# Ative estas configurações para melhor experiência:

1. ✓ Salvar worklog automaticamente
   → Economiza tempo registrando automaticamente no Jira

2. ✓ Notificações sonoras (nas configurações)
   → Sons avisam quando completar sessões

3. ✓ Notificações desktop (nas configurações)
   → Notificações visuais no sistema operacional
```

---

## 🔧 Diferença entre Modo Manual e Pomodoro

| Característica | Manual 🕐 | Pomodoro 🍅 |
|---------------|-----------|-------------|
| **Duração** | Livre (você controla) | Fixa (25 min) |
| **Pausas** | Você decide | Automáticas (5/15 min) |
| **Worklog** | Manual | Pode ser automático |
| **Notificações** | Não | Sim (som ao completar) |
| **Uso ideal** | Tarefas irregulares | Trabalho focado |
| **Flexibilidade** | Total | Estruturada |

---

## 🐛 Problemas Comuns

### ❓ O timer não salva o worklog

**Solução:**
1. Verifique se selecionou um ticket (deve aparecer a chave do ticket, ex: "SUPORTE-1234")
2. Confirme que trabalhou pelo menos 1 minuto (60 segundos)
3. Verifique suas permissões de API no Jira

### ❓ Não consigo trocar de Manual para Pomodoro

**Solução:**
1. Pare o timer primeiro (botão "⏹️ Parar")
2. Depois clique em "Pomodoro"
3. Não é possível trocar de modo com o timer rodando

### ❓ O som não toca ao completar a sessão

**Solução:**
1. Verifique as configurações do app (⚙️)
2. Ative "Notificações Sonoras"
3. Verifique o volume do seu sistema operacional

### ❓ O widget desapareceu

**Solução:**
- Pressione `Cmd+T` (macOS) ou `Ctrl+T` (Windows/Linux) novamente
- Ou clique no timer minimizado se ele estiver no canto da tela

---

## 📊 Monitorando sua Produtividade

### Usando o Dashboard de Performance

1. Ative o **Modo Pro** com `Cmd+P` ou `Ctrl+P`
2. Role até a seção **"📊 Dashboard de Performance"**
3. Você verá:
   - ⏱️ Tempo médio de resolução
   - ✅ Total de tickets resolvidos
   - 📈 Taxa de fechamento semanal
   - 🔥 Heatmap de atividade (seus horários mais produtivos)

### Ver seus Worklogs

Os worklogs salvos pelo Pomodoro ficam registrados:
- No próprio ticket no Jira
- Na aba "Work Log" do ticket no Jira web
- Podem ser usados para relatórios de tempo

---

## 🎓 Tutorial em Vídeo (Passo a Passo)

### Primeira vez usando Pomodoro?

```bash
# Siga estes passos exatamente:

1. Abra um ticket que precisa trabalhar
2. Pressione Cmd+T (ou Ctrl+T)
3. Clique no botão "Pomodoro" (à direita de "Manual")
4. Clique em "▶️ Iniciar"
5. Trabalhe focado por 25 minutos
6. Quando o som tocar, faça 5 minutos de pausa
7. Repita o ciclo

Pronto! Você está usando a técnica Pomodoro 🍅
```

---

## 📚 Leia Mais

- **GUIA-v1.5.0.md** - Documentação completa da versão 1.5.0
- **README.md** - Visão geral do Jira Monitor
- **QUICK_START.md** - Início rápido

---

## 💡 Técnica Pomodoro Original

A técnica Pomodoro foi criada por Francesco Cirillo nos anos 1980 e é um dos métodos de gestão de tempo mais populares do mundo.

### Princípios:

1. **Trabalho focado** → Sem interrupções por 25 minutos
2. **Pausas regulares** → Descanso para o cérebro
3. **Ciclos repetidos** → Sustentabilidade ao longo do dia
4. **Medição** → Quantos pomodoros você completa

### Benefícios:

✅ Aumenta o foco e concentração  
✅ Reduz procrastinação  
✅ Melhora a gestão do tempo  
✅ Previne burnout com pausas regulares  
✅ Fornece métricas claras de produtividade  

---

**Versão**: 1.6.1  
**Última atualização**: Janeiro 2026  
**Desenvolvido com ❤️ para aumentar sua produtividade**

---

## ⭐ Feedback

Gostou do Pomodoro? Tem sugestões de melhoria?  
Entre em contato com a equipe de desenvolvimento!

**Boa sorte com seus pomodoros! 🍅✨**
