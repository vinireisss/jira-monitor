# 🎛️ Sistema de Controle de Debug

## 📋 Problema Resolvido

Seu terminal estava **cheio de logs de debug** porque o código tinha centenas de `console.log()` sempre ativos. Isso causava:

- ❌ Terminal poluído e difícil de ler
- ❌ Performance reduzida (processamento de logs)
- ❌ Logs pesados de JSON (ADF, estatísticas, etc)

## ✅ Solução Implementada

Agora você tem **controle total** sobre os logs de debug através de uma **flag única**:

### 🎚️ Como Ligar/Desligar Logs

Basta alterar **UMA linha** em cada arquivo:

#### 📄 jira-service.js (linha ~10)
```javascript
const DEBUG_MODE = false;  // false = SEM logs | true = COM logs
```

#### 📄 main.js (linha ~9)
```javascript
const DEBUG_MODE = false;  // false = SEM logs | true = COM logs
```

#### 📄 renderer.js (linha ~4)
```javascript
const DEBUG_MODE = false;  // false = SEM logs | true = COM logs
```

---

## 🔧 Como Usar

### Modo Normal (Produção) - Sem Logs ✅
```javascript
const DEBUG_MODE = false;  // ← Terminal limpo!
```

**Resultado:**
- ✅ Terminal limpo e legível
- ✅ Melhor performance
- ✅ Apenas erros críticos são mostrados

### Modo Debug (Desenvolvimento) - Com Logs 🔍
```javascript
const DEBUG_MODE = true;  // ← Todos os logs ativos!
```

**Resultado:**
- 🔍 Ver conversão ADF → HTML
- 🔍 Ver estatísticas e contadores
- 🔍 Ver fluxo de dados
- 🔍 Ver debug de todos os processos

---

## 📊 Impacto

### Antes (sem controle):
```
🔍 Convertendo ADF para HTML: {...1000 linhas de JSON...}
⚠️ Tipo de nó ADF não suportado: mediaInline {...}
🔍 Convertendo ADF para HTML: {...1000 linhas de JSON...}
⚠️ Tipo de nó ADF não suportado: rule {...}
🔍 Convertendo ADF para HTML: {...1000 linhas de JSON...}
💬 Comentários feitos hoje: 23 {...detalhes...}
🎯 fetchStats() RETORNANDO: {...detalhes...}
... [centenas de linhas] ...
```

### Depois (DEBUG_MODE = false):
```
[terminal limpo - apenas mensagens importantes]
```

---

## 🎯 Recomendação

**Para uso diário:** Mantenha `DEBUG_MODE = false` em todos os arquivos

**Para debug:** Ative apenas no arquivo que você está debugando:
- Problemas com Jira API? → `jira-service.js`
- Problemas com a janela? → `main.js`
- Problemas com a UI? → `renderer.js`

---

## 🚀 Aplicar Mudanças

Após alterar o `DEBUG_MODE`, reinicie a aplicação:

```bash
npm start
# ou
./start.sh
```

---

## 💡 Dica Pro

Se você quiser logs **seletivos**, pode criar múltiplas flags:

```javascript
const DEBUG_MODE = false;
const DEBUG_ADF = false;      // Apenas logs de ADF
const DEBUG_STATS = false;    // Apenas logs de estatísticas
const DEBUG_TICKETS = false;  // Apenas logs de tickets
```

E usar assim no código:
```javascript
if (DEBUG_ADF) safeLog('🔍 Convertendo ADF...');
if (DEBUG_STATS) safeLog('📊 Stats:', stats);
```
