# 🔄 Atualização: Sistema de Cores por SLA - v2

## ✅ Melhorias Implementadas

Esta atualização resolve o problema de **detecção de SLA** em tickets do Jira Service Management.

---

## 🐛 Problema Identificado

O Jira Service Management **não usa o campo `duedate` padrão** para SLAs. Em vez disso, usa **campos customizados** que armazenam informações de SLA como:
- `Time to resolution`
- `Time to first response`

Esses campos são armazenados em `customfield_XXXXX` e têm estrutura especial.

---

## 🔧 Solução Implementada

### 1. **Função Inteligente de Detecção** (`getSlaDate()`)

Criada uma nova função que busca o SLA em múltiplos locais:

1. ✅ Campo `duedate` padrão (se existir)
2. ✅ Campos customizados com padrões de SLA:
   - `customfield_*sla*`
   - `customfield_*resolution*`
   - `customfield_*due*`
3. ✅ Extrai dados de estruturas complexas:
   - `field.goalDate`
   - `field.ongoingCycle.goalDate`

### 2. **Busca de Campos Expandida**

Agora **todas as queries** buscam:
- ✅ `duedate`
- ✅ `project` (para filtrar apenas IT)
- ✅ `customfield_*` (todos os campos customizados)

### 3. **Logs de Debug**

A função `getSlaDate()` agora **registra no console**:
- ✅ Quando encontra um SLA (e qual campo)
- ⚠️ Quando NÃO encontra SLA para um ticket

---

## 🧪 Como Testar

### 1. **Reinicie o App**

```bash
# No terminal (onde o app está rodando)
# Pressione Ctrl+C para parar

# Reinicie:
npm start
```

### 2. **Abra o Console de Desenvolvedor**

No Jira Monitor, pressione:
- **macOS**: `Cmd + Option + I`
- **Windows/Linux**: `Ctrl + Shift + I`

### 3. **Expanda Lista de Tickets**

Clique para expandir qualquer card com tickets IT.

### 4. **Verifique os Logs**

No console, você verá mensagens como:

```
🎯 SLA encontrado em duedate para IT-1079021: 2026-01-06T16:00:00.000-0300
🎯 SLA encontrado em customfield_10200.goalDate para IT-1078686: 2026-01-05T10:00:00Z
⚠️ SLA não encontrado para IT-1078247
```

### 5. **Verifique as Cores**

Os tickets com SLA encontrado devem aparecer com **bordas coloridas**:
- 🟢 Verde: > 3 horas
- 🟡 Amarelo: 1-3 horas
- 🔴 Vermelho: < 1 hora ou estourado (com animação pulsante)

---

## 📊 Exemplo: IT-1079021

Com base na imagem que você mostrou:

**Ticket:** IT-1079021  
**SLA:** Jan 06 04:00 PM (within 20h)  
**Data Atual:** ~Jan 02, 2026  
**Tempo Restante:** ~4 dias e 12 horas  
**Cor Esperada:** 🟢 **VERDE (Safe)**

Se o SLA for encontrado, você verá:
```
🎯 SLA encontrado em [campo] para IT-1079021: [data]
```

E o ticket aparecerá com **borda verde à esquerda**.

---

## 🔍 Troubleshooting

### Se as cores NÃO aparecerem:

1. **Verifique os logs no console**
   - Se aparecer: `⚠️ SLA não encontrado para IT-XXXXX`
   - Significa que o campo de SLA não foi detectado

2. **Compartilhe um exemplo**
   - Abra um ticket IT no Jira
   - Vá em "..." → "View JSON"
   - Procure por campos que contenham "sla", "resolution" ou "due"
   - Compartilhe comigo o nome do campo

3. **Adicione mais padrões**
   - Posso adicionar mais padrões à função `getSlaDate()`
   - Baseado nos campos que você encontrar

---

## 📝 Arquivos Modificados

### `renderer.js`
- ✅ Nova função `getSlaDate(ticket)` com detecção inteligente
- ✅ Logs de debug para troubleshooting
- ✅ Aplicada em todas as listagens de tickets

### `jira-service.js`
- ✅ Adicionado `customfield_*` em todas as queries
- ✅ Adicionado `duedate` e `project` onde faltava

---

## 🎯 Próximos Passos

Após reiniciar e testar:

1. ✅ Verifique se as cores aparecem
2. 📝 Compartilhe os logs do console (copie as mensagens de SLA)
3. 🐛 Se não funcionar, compartilhe o JSON de um ticket IT

Com essas informações, posso **ajustar os padrões** para seu Jira específico!

---

**Versão:** 1.7.1  
**Data:** 02/01/2026  
**Status:** 🔄 Aguardando Testes

