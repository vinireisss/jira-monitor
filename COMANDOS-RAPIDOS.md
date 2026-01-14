# 🚀 Comandos Rápidos - Jira Monitor

## 📦 Instalação dos Aliases

### **Opção 1: Script Automático (RECOMENDADO)** ✨

Funciona em **qualquer terminal** (macOS Terminal, iTerm, Cursor, etc.):

```bash
cd ~/dev/nu/jira-monitor
./install-aliases.sh
source ~/.zshrc  # ou source ~/.bashrc
```

### **Opção 2: Instalação Manual**

Se preferir instalar manualmente:

```bash
cat >> ~/.zshrc << 'EOF'

# 🎯 Jira Monitor - Comandos Rápidos
alias jira-monitor="cd ~/dev/nu/jira-monitor && npm start > /dev/null 2>&1 &"
alias jira-update="cd ~/dev/nu/jira-monitor && git pull origin main && npm install"
alias jira-restart="cd ~/dev/nu/jira-monitor && pkill -9 -f 'electron.*jira-monitor' 2>/dev/null; sleep 1; pkill -9 Electron 2>/dev/null; sleep 0.5; npm start > /dev/null 2>&1 &"
alias jira-status="cd ~/dev/nu/jira-monitor && git status"
alias jira-log="cd ~/dev/nu/jira-monitor && git log --oneline -10"
EOF

source ~/.zshrc
```

**Para Bash** (adicione também ao `~/.bashrc` e `~/.bash_profile`)

---

## ⚡ Comandos Disponíveis

### 🎯 **Uso Diário**

| Comando | O que faz |
|---------|-----------|
| `jira-monitor` | 🚀 Abre o Jira Monitor |
| `jira-update` | 🔄 Atualiza para a última versão (git pull + npm install) |
| `jira-restart` | 🔄 Reinicia o app do ZERO (encerra completamente e abre novamente) |

### 📊 **Informações**

| Comando | O que faz |
|---------|-----------|
| `jira-status` | 📝 Ver status do Git (mudanças locais) |
| `jira-log` | 📜 Ver últimos 10 commits |

---

## 🔄 Workflow Típico

### **Para Você (que faz commits):**

```bash
# 1. Fazer suas alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 2. Avisar a equipe para atualizar
```

### **Para Seus Colegas (que usam o app):**

```bash
# Quando você avisar que tem atualização:
jira-update

# Depois abrir o app:
j
```

---

## 📖 Exemplos Práticos

### **Cenário 1: Começar o dia**
```bash
jira-monitor         # Abre o Jira Monitor
```

### **Cenário 2: Há uma atualização nova**
```bash
jira-update          # Baixa atualizações
jira-monitor         # Abre o app atualizado
```

### **Cenário 3: App travou ou bugou**
```bash
jira-restart         # Mata processos e reinicia
```

### **Cenário 4: Ver o que mudou**
```bash
jira-log             # Ver últimos commits
```

### **Cenário 5: Verificar se está tudo ok**
```bash
jira-status          # Ver status do Git
```

---

## 🔧 Troubleshooting

### **Problema: Comando não funciona**

**Solução:**
```bash
source ~/.zshrc      # Recarrega os aliases
```

Ou feche e reabra o terminal.

---

### **Problema: `jira-update` diz que há conflitos**

**Solução:**
```bash
cd ~/dev/nu/jira-monitor
git stash            # Guarda suas mudanças locais
git pull origin main # Baixa atualizações
git stash pop        # Restaura suas mudanças (se quiser)
```

Ou mais simples (descarta mudanças locais):
```bash
cd ~/dev/nu/jira-monitor
git reset --hard origin/main
npm install
```

---

### **Problema: Processo não foi morto pelo `jira-restart`**

**Solução manual:**
```bash
# Ver processos do Electron
ps aux | grep electron

# Matar processo específico (substitua PID pelo número)
kill -9 PID
```

---

## 💡 Dicas

1. **Sempre use `jira-update` antes de abrir** se faz tempo que não usa
2. **Use `jira-log`** para ver o que há de novo
3. **Use `jira-restart`** se o app travar
4. **Alias `j` é o mais usado** - memorize ele! 🚀

---

## 📞 Suporte

Se algum comando não funcionar:
1. Verifique se está no zsh: `echo $SHELL` (deve mostrar `/bin/zsh`)
2. Recarregue: `source ~/.zshrc`
3. Se ainda não funcionar, entre em contato com o time

---

**Feito com ❤️ para facilitar seu dia a dia!**
