# 📦 Node v25 e o Jira Monitor

## ⚠️ **IMPORTANTE: Por Que Não Podemos Usar Node v25**

### O Problema Técnico:

O **Electron 33.4.11** foi compilado com **Node v20.18.3**. Quando há Node v25 no ambiente:

1. ❌ `require('electron')` retorna **string** (caminho) em vez do **módulo**
2. ❌ Todos os módulos do Electron ficam `undefined`:
   - `ipcMain` → undefined
   - `app` → undefined  
   - `BrowserWindow` → undefined
3. ❌ App **não inicia** com erro: `Cannot read properties of undefined`

Este é um **bug conhecido** da interação entre Electron e versões mais novas do Node.js.

---

## ✅ **Solução Atual**

O Jira Monitor usa **Node v20 (via nvm)** apenas para:
- Rodar o Electron
- Garantir compatibilidade

**Node v25 do Homebrew** está instalado e pode ser usado para:
- ✅ Outros projetos
- ✅ Scripts gerais
- ✅ Ferramentas de linha de comando

---

## 🔄 **Como Alternar Entre Versões**

### Para usar Node v25 (padrão no terminal):
```bash
# Já está ativo por padrão!
node --version  # v25.2.1
```

### Para usar Node v20 (necessário para Jira Monitor):
```bash
nvm use 20
node --version  # v20.19.6
```

### Para voltar ao padrão (v25):
```bash
# Abrir novo terminal (já vem com v25)
# OU
export PATH="/opt/homebrew/bin:$PATH"
```

---

## 🎯 **Comandos do Jira Monitor**

### Iniciar (usa Node v20 automaticamente):
```bash
cd "/Users/gabriel.silva.digisystem/jira monitor"
npm start  # ← script start.sh ativa Node v20 automaticamente
```

### Instalar dependências (pode usar Node v25):
```bash
npm install  # Funciona com v25 ou v20
```

### Build (pode usar Node v25):
```bash
npm run package  # Funciona com v25 ou v20
```

---

## 🚀 **Quando Poderemos Usar Node v25?**

Quando o Electron lançar uma versão compatível com Node v25:

```bash
# Verificar versões disponíveis:
npm view electron versions

# Quando sair Electron com Node v25, atualizar:
npm install electron@latest --save-dev
```

**Acompanhe:** https://github.com/electron/electron/releases

---

## 💡 **Resumo**

| Situação | Node Usado |
|----------|------------|
| **Terminal normal** | v25.2.1 (Homebrew) |
| **Jira Monitor rodando** | v20.18.3 (Electron interno) |
| **`npm start`** | v20.19.6 (nvm, ativado pelo script) |
| **`npm install`** | v25 ou v20 (ambos funcionam) |

---

**Você tem o melhor setup possível:** Node v25 para tudo, e o Jira Monitor funcionando perfeitamente com Node v20 isolado! 🎊


