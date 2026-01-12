# 🔄 Atualizar Jira Monitor Instalado (Versão .app)

## 🎯 Para quem usa o app instalado em `/Applications/`

---

## ⚡ **Comando Único (Recomendado):**

```bash
cd ~/dev/nu/jira-monitor && git pull && npm run build && ./install.sh
```

**O que esse comando faz:**
1. ✅ Vai para a pasta do projeto
2. ✅ Baixa as últimas atualizações do Git
3. ✅ Reconstrói o aplicativo (.app)
4. ✅ Reinstala automaticamente em `/Applications/`

**⏱️ Tempo:** ~2-3 minutos

---

## 📋 **Passo a Passo Detalhado:**

### 1️⃣ Fechar o App (se estiver rodando)
```bash
killall "Jira Monitor" 2>/dev/null
```

### 2️⃣ Ir para a pasta do código-fonte
```bash
cd ~/dev/nu/jira-monitor
```

### 3️⃣ Baixar atualizações
```bash
git pull
```

### 4️⃣ Atualizar dependências (se necessário)
```bash
npm install
```

### 5️⃣ Rebuild do app
```bash
npm run build
```

### 6️⃣ Reinstalar
```bash
./install.sh
```

---

## 🚀 **Modo Rápido (Script Automático):**

Crie este script de atualização rápida:

```bash
#!/bin/bash
# Salve como: update-jira-monitor.sh

echo "🔄 Atualizando Jira Monitor..."

# Fechar app se estiver rodando
killall "Jira Monitor" 2>/dev/null
echo "✅ App fechado"

# Ir para pasta do projeto
cd ~/dev/nu/jira-monitor || exit 1
echo "✅ Pasta encontrada"

# Baixar atualizações
echo "📥 Baixando atualizações do Git..."
git pull

# Instalar dependências se houver mudanças
if git diff HEAD@{1} package.json | grep -q "dependencies"; then
  echo "📦 Atualizando dependências..."
  npm install
fi

# Rebuild
echo "🔨 Reconstruindo aplicação..."
npm run build

# Reinstalar
echo "📲 Reinstalando em /Applications..."
./install.sh

echo ""
echo "✅ ✅ ✅ ATUALIZAÇÃO CONCLUÍDA! ✅ ✅ ✅"
echo ""
echo "🚀 Você pode abrir o Jira Monitor agora!"
```

**Como usar:**

```bash
# 1. Salvar o script
nano ~/update-jira-monitor.sh

# 2. Dar permissão de execução
chmod +x ~/update-jira-monitor.sh

# 3. Rodar sempre que precisar atualizar
~/update-jira-monitor.sh
```

---

## 🔀 **Diferença: Dev vs App Instalado**

| Situação | Como Usar | Atualização |
|----------|-----------|-------------|
| **Rodo com `npm start`** | Modo desenvolvimento | `git pull && npm start` |
| **Abro o ícone em Applications** | App instalado | `git pull && npm run build && ./install.sh` |

---

## ⚠️ **Importante:**

- 📁 **Suas configurações NÃO serão perdidas** (ficam em `~/Library/Application Support/jira-monitor/`)
- 🪟 **Posição da janela será mantida**
- ⚙️ **Pro Mode e outras preferências** permanecem
- 🔐 **Credenciais do Jira** continuam salvas

---

## 🐛 **Problemas Comuns:**

### ❌ "xcrun: error: invalid active developer path"

Instale as Command Line Tools:
```bash
xcode-select --install
```

### ❌ Build falha com erro de memória

Limpe o cache:
```bash
npm run clean
rm -rf node_modules
npm install
npm run build
```

### ❌ App não abre depois de atualizar

Remova a quarentena do macOS:
```bash
xattr -cr "/Applications/Jira Monitor.app"
```

### ❌ "Permission denied" ao rodar install.sh

Dê permissão:
```bash
chmod +x install.sh
./install.sh
```

---

## 📊 **Verificar Versão Atual:**

### No código:
```bash
cat ~/dev/nu/jira-monitor/package.json | grep version
```

### No app instalado:
```bash
open -a "Jira Monitor"
# Veja o número da versão na tela de carregamento ou nas configurações
```

---

## ✅ **Checklist de Atualização:**

- [ ] Fechei o app instalado
- [ ] Rodei `git pull`
- [ ] Rodei `npm run build`
- [ ] Rodei `./install.sh`
- [ ] Abri o app e testei as novas funcionalidades
- [ ] Verifiquei se minhas configurações foram mantidas

---

## 💡 **Dica Pro:**

Crie um alias no seu `.zshrc` ou `.bashrc`:

```bash
alias update-jira='cd ~/dev/nu/jira-monitor && git pull && npm run build && ./install.sh'
```

Depois é só rodar:
```bash
update-jira
```

Para adicionar o alias permanentemente:
```bash
echo "alias update-jira='cd ~/dev/nu/jira-monitor && git pull && npm run build && ./install.sh'" >> ~/.zshrc
source ~/.zshrc
```

---

## 🆘 **Reset Completo (Último Recurso):**

Se algo der muito errado:

```bash
# 1. Remover app instalado
rm -rf "/Applications/Jira Monitor.app"

# 2. Limpar tudo e reconstruir
cd ~/dev/nu/jira-monitor
git reset --hard origin/main
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
./install.sh
```

---

## 🎉 **Pronto!**

Agora você tem a versão mais recente instalada em `/Applications/`!

**Última atualização:** Janeiro 2026  
**Versão:** 1.5.0
