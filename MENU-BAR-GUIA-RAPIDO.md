# 🚀 Menu Bar - Guia Rápido

## 📍 O que é?

Ícone inteligente na barra de menu do macOS que mostra o status dos seus tickets do Jira em tempo real.

---

## 🎨 Emojis e Significados

| Emoji | O que significa |
|-------|-----------------|
| 🔴 | Tem ticket(s) com SLA vencido |
| 🟡 | Tem ticket(s) próximo do vencimento |
| 🟢 | Tem ticket(s) com SLA OK |
| ⚪ | Sem tickets |
| 🔴🟡🟢 | Todos os estados (crítico + alerta + OK) |

---

## 🎯 Como Usar

### Ver Status Rápido
- **Olhe para o Menu Bar** → Veja os emojis coloridos

### Ver Detalhes
- **Clique no ícone** → Menu abre com lista de tickets

### Focar em Ticket
- **Clique em qualquer ticket no menu** → Jira Monitor abre e foca nele

### Atualizar Dados
- **Clique em "🔄 Atualizar Agora"** → Força busca imediata

### Abrir Jira Monitor
- **Clique em "📊 Abrir Jira Monitor"** → Abre/restaura a janela

---

## 🧪 Testar o Sistema

1. Clique no ícone do Menu Bar
2. Vá em **"🧪 Testar Cores"**
3. Escolha um estado para simular:
   - **🔴 Vermelho** → Simula SLA vencido
   - **🟡 Amarelo** → Simula próximo do vencimento
   - **🟢 Verde** → Simula SLA OK
   - **🔴🟡🟢 Todos** → Simula todos os estados
4. Clique em **"♻️ Voltar ao Normal"** para voltar aos dados reais

---

## 💡 Dicas

✅ **O Menu Bar funciona mesmo com a janela fechada**
✅ **Atualização automática a cada 15 minutos**
✅ **Passe o mouse sobre o ícone para ver resumo**
✅ **Tickets são clicáveis - abrem direto no Jira Monitor**

---

## 🐛 Problema?

**Ícone não aparece?**
- Reinicie o aplicativo

**Dados não atualizam?**
- Clique em "🔄 Atualizar Agora"

**Ticket não foca?**
- Aguarde dados carregarem (1-2 segundos)

---

## 📋 Estrutura do Menu

```
[Ícone 🔴🟡🟢]
├─ 📊 X crítico(s) / Y em alerta / Z OK
│
├─ 🔴 SLA VENCIDO
│  ├─ IT-12345: Bug crítico
│  └─ IT-12350: Falha no login
│
├─ 🟡 SLA PRÓXIMO DO VENCIMENTO
│  └─ IT-12346: Feature importante
│
├─ 🟢 SLA OK (3)
│  ├─ IT-12347: Tarefa normal
│  ├─ IT-12348: Melhoria UI
│  └─ IT-12349: Documentação
│
├─────────────────
├─ 📊 Abrir Jira Monitor
├─ 🔄 Atualizar Agora
├─────────────────
├─ 🧪 Testar Cores ▶
├─────────────────
├─ ⚙️ Configurações
└─ 🚪 Sair
```

---

**✨ Pronto para usar!**

Para mais detalhes, consulte: **MENU-BAR.md**
