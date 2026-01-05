# 🔍 Debug: Ticket Preview Não Carrega

## 🎯 Objetivo

Este guia irá ajudar a identificar **exatamente** onde está o problema quando o preview de ticket não carrega.

## 🛠️ Logs de Debug Adicionados

Adicionei logs detalhados em **3 camadas**:

### 1️⃣ Frontend (renderer.js)
- 🔍 Quando você clica para abrir um ticket
- 📦 Quando recebe a resposta do backend
- ✅ Quando o preview é renderizado com sucesso
- ❌ Quando há erro

### 2️⃣ IPC Handler (main.js)
- 🎫 Quando recebe a solicitação
- ✅ Quando obtém os detalhes
- ❌ Quando há erro

### 3️⃣ Backend (jira-service.js)
- 💬 Quantos comentários estão sendo processados
- ✅ Dados retornados
- ❌ Erros durante processamento

## 🧪 Como Testar

### Passo 1: Abrir DevTools

1. Abra o app:
```bash
cd "/Users/gabriel.silva.digisystem/jira monitor"
npm start
```

2. **Abra o DevTools** (Console):
   - Pressione `Cmd + Option + I` (macOS)
   - Ou clique com botão direito → "Inspect Element"

3. Vá para a aba **"Console"**

### Passo 2: Tentar Abrir um Ticket

1. Clique em **qualquer ticket** na lista
2. **Observe o console** - você verá uma sequência de logs:

#### ✅ Sequência Esperada (SUCESSO):

```
🔍 Buscando detalhes do ticket: IT-1080742
🎫 [IPC] Recebida solicitação de detalhes para: IT-1080742
💬 Processando X comentários para IT-1080742
✅ Ticket IT-1080742 processado: { key: 'IT-1080742', summary: '...', commentsCount: X, attachmentsCount: Y }
✅ [IPC] Detalhes obtidos para IT-1080742: { key: 'IT-1080742', hasComments: true, commentsLength: X }
📦 Resultado recebido: { success: true, data: {...} }
✅ Dados do ticket: { key: 'IT-1080742', summary: '...', hasComments: true, commentsLength: X, ... }
🎨 Renderizando preview do ticket: { key: 'IT-1080742', ... }
✅ Preview renderizado com sucesso
```

#### ❌ Sequência com Erro (PROBLEMA):

Se algo der errado, você verá mensagens de erro **indicando exatamente onde falhou**:

**Erro no Backend (jira-service.js):**
```
❌ Erro ao buscar detalhes do ticket IT-XXXXX: ...
Stack: ...
```

**Erro no IPC (main.js):**
```
❌ [IPC] Erro ao buscar detalhes do ticket IT-XXXXX: ...
```

**Erro no Frontend (renderer.js):**
```
❌ Erro no resultado: Cannot read properties of undefined...
❌ Erro ao carregar ticket: ...
Stack trace: ...
```

**Erro ao Renderizar:**
```
❌ Ticket vazio ou undefined!
OU
❌ Elemento ticket-preview-body não encontrado!
OU
❌ Erro ao renderizar preview: ...
```

## 📊 O Que Observar

### 1. O Request Chega no Backend?

Se você vê:
```
🔍 Buscando detalhes do ticket: IT-XXXXX
🎫 [IPC] Recebida solicitação de detalhes para: IT-XXXXX
```

✅ **Sim**: A comunicação frontend → backend está OK

❌ **Não**: Problema na chamada IPC do renderer.js

### 2. O Backend Processa os Dados?

Se você vê:
```
💬 Processando X comentários para IT-XXXXX
✅ Ticket IT-XXXXX processado: {...}
```

✅ **Sim**: Backend está funcionando

❌ **Não**: Erro ao buscar dados do Jira ou processar resposta

### 3. Os Dados Voltam pro Frontend?

Se você vê:
```
📦 Resultado recebido: { success: true, data: {...} }
✅ Dados do ticket: {...}
```

✅ **Sim**: Comunicação backend → frontend está OK

❌ **Não**: IPC não está retornando os dados

### 4. O Render Funciona?

Se você vê:
```
🎨 Renderizando preview do ticket: {...}
✅ Preview renderizado com sucesso
```

✅ **Sim**: Tudo funcionando!

❌ **Não**: Erro ao montar o HTML ou inserir no DOM

## 🔧 Correções Aplicadas

### 1. Proteção contra `comments` undefined

**Antes:**
```javascript
${ticket.comments.map(comment => ...)}  // ❌ Erro se undefined
```

**Depois:**
```javascript
${(ticket.comments && Array.isArray(ticket.comments) && ticket.comments.length > 0) 
  ? ticket.comments.map(comment => ...)
  : '<p class="no-comments-msg">Nenhum comentário ainda</p>'
}
```

### 2. Try-Catch em Processamento de Comentários

Se um comentário específico tiver dados inválidos, não quebra todo o processo:

```javascript
const processedComments = comments.map(comment => {
  try {
    return { /* processar comentário */ };
  } catch (err) {
    console.error('❌ Erro ao processar comentário:', err);
    return { /* comentário com erro */ };
  }
});
```

### 3. Mensagens de Erro Detalhadas

Agora quando algo falha, você vê:
- ❌ **Onde** falhou (frontend/IPC/backend)
- ❌ **Por que** falhou (mensagem de erro)
- ❌ **Stack trace** para debug profundo

## 🚑 Soluções Rápidas

### Problema: "Elemento ticket-preview-body não encontrado"

**Causa:** Modal HTML não está carregado

**Solução:**
1. Verifique se o `index.html` tem o modal:
```bash
grep -A5 "ticket-preview-modal" index.html
```

2. Se não tiver, o HTML do modal está faltando

### Problema: "Ticket vazio ou undefined"

**Causa:** Backend não está retornando dados

**Solução:**
1. Verifique credenciais do Jira
2. Verifique conexão com internet
3. Veja logs do backend para detalhes

### Problema: "Cannot read properties of undefined"

**Causa:** Algum campo do ticket está undefined e o código tenta acessar

**Solução:** 
- Verifique qual campo no stack trace
- Os logs agora mostram exatamente qual propriedade está faltando

## 📸 Tire um Screenshot

Se o problema persistir, **tire um screenshot do console** mostrando:

1. ✅ Todos os logs desde "🔍 Buscando detalhes..." até o erro
2. ✅ O stack trace completo
3. ✅ A aba "Network" (se houver requisições falhando)

## 🎯 Próximos Passos

Agora **teste novamente** com o app rodando:

```bash
npm start
```

E me envie:
1. 📋 Os logs do console (copie e cole o texto)
2. 🖼️ Screenshot do erro (se houver)
3. 🎫 Qual ticket você tentou abrir

Com esses dados, conseguirei identificar **exatamente** onde está o problema! 🎯

---

**Criado em**: Janeiro 2026  
**Versão**: 1.6.1  
**Status**: 🔍 Debug Mode Ativo

