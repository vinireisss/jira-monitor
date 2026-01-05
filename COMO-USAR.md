# 🚀 Como Usar o Jira Monitor

## ⚡ Comandos Principais

### **Modo Desenvolvimento (Testar):**
```bash
npm start
```

### **Gerar Versão Instalável (Atualizar):**
```bash
npm run build && ./install.sh
```

📚 **Ver todos os comandos:** `COMANDOS.md` | **Guia rápido:** `GUIA-RAPIDO.md`

---

## 📋 Requisitos

- ✅ **Node.js v20.19.6** (via nvm) - **OBRIGATÓRIO**
- ✅ **Electron 33.4.11**
- ✅ **macOS 15.7+**

⚠️ **IMPORTANTE:** O app **requer Node v20**. Node v25 causa incompatibilidade com o Electron.

---

## 🔧 Se o App Não Iniciar

Execute o script de correção do ambiente:

```bash
./fix-environment.sh
```

Este script irá:
1. Remover Node.js do Homebrew (se instalado)
2. Limpar caches
3. Configurar nvm com Node v20
4. Reinstalar dependências
5. Remover quarentena do Electron

---

## 🛠️ Versões

- **Electron:** 33.4.11 (mais recente)
- **Node.js:** v20.19.6 LTS (via nvm)
- **npm:** 10.8.2

---

## 📦 Tecnologias Usadas

- **Electron** - Framework para desktop
- **electron-store** - Persistência de dados
- **node-fetch** - Requisições HTTP
- **form-data** - Upload de arquivos
- **Jira REST API v3** - Integração com Jira

---

## 🎯 Funcionalidades

✅ Monitor em tempo real de tickets do Jira  
✅ Múltiplos usuários monitorados  
✅ Notificações desktop  
✅ Modo Pro (Jira embutido)  
✅ Preview de tickets com edição inline  
✅ Upload/download de anexos  
✅ Comentários com menções  
✅ Drag-and-drop para reorganizar cards  
✅ Focus Mode  
✅ Temas customizáveis  
✅ Atalhos de teclado  
✅ Exportação de relatórios  

---

## ⚠️ Problemas Conhecidos

### `require('electron')` retorna string

**Causa:** Conflito entre Node do Homebrew e Node do nvm.

**Solução:** 
1. Remover Node do Homebrew: `brew uninstall node`
2. Usar apenas Node via nvm
3. Executar `./fix-environment.sh`

---

## 📞 Suporte

Se tiver problemas, verifique:
1. Node v20 está ativo: `node --version`
2. nvm está configurado: `nvm current`
3. Electron instalado: `ls node_modules/electron`

---

**Desenvolvido para Nubank ITOps** 🚀

