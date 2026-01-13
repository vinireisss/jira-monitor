# 🔧 Fix: "You have divergent branches"

## 🎯 Problema

```bash
git pull && npm start
```

**Erro:**
```
hint: You have divergent branches and need to specify how to reconcile them.
fatal: Need to specify how to reconcile divergent branches.
```

---

## ✅ Solução Rápida (Recomendada)

### **Se você NÃO fez mudanças importantes localmente:**

```bash
cd ~/dev/nu/jira-monitor
git reset --hard origin/main
npm install
npm start
```

**O que esse comando faz:**
- ✅ Descarta suas mudanças locais
- ✅ Sincroniza com o GitHub (versão mais recente)
- ✅ Reinstala dependências (se necessário)
- ✅ Inicia a aplicação

⚠️ **ATENÇÃO:** Isso vai descartar todas as suas mudanças locais não commitadas!

---

## 🔄 Solução Completa (Se você tem mudanças importantes)

### **Opção A: Merge (Mantém histórico completo)**

```bash
cd ~/dev/nu/jira-monitor
git config pull.rebase false
git pull
```

Se aparecer conflitos, você verá algo assim:
```
CONFLICT (content): Merge conflict in main.js
```

**Resolver conflitos:**
```bash
# Ver quais arquivos têm conflito
git status

# Para cada arquivo com conflito, escolha:
# Manter sua versão local:
git checkout --ours nome-do-arquivo.js

# OU manter a versão remota (GitHub):
git checkout --theirs nome-do-arquivo.js

# Depois de resolver todos:
git add .
git commit -m "Merge: Integra atualizações do GitHub"
npm start
```

---

### **Opção B: Rebase (Histórico linear, mais limpo)**

```bash
cd ~/dev/nu/jira-monitor
git config pull.rebase true
git pull
```

Se der conflito:
```bash
# Aceitar versão remota para todos os conflitos:
git checkout --theirs .
git add .
git rebase --continue

# Ou desistir do rebase:
git rebase --abort
```

---

### **Opção C: Salvar suas mudanças temporariamente**

```bash
cd ~/dev/nu/jira-monitor

# 1. Guardar suas mudanças
git stash save "Minhas alterações locais"

# 2. Atualizar do GitHub
git pull

# 3. Reaplicar suas mudanças (opcional)
git stash pop

# 4. Iniciar
npm start
```

---

## 🚀 Comando Único (Mais Fácil)

**Para a maioria dos casos** (descarta mudanças locais e pega do GitHub):

```bash
cd ~/dev/nu/jira-monitor && git fetch origin && git reset --hard origin/main && npm install && npm start
```

---

## 📋 Passo a Passo Detalhado

### 1️⃣ Verificar o que você tem de diferente:

```bash
cd ~/dev/nu/jira-monitor
git status
```

### 2️⃣ Ver quais arquivos foram modificados localmente:

```bash
git diff --name-only
```

### 3️⃣ Escolher a estratégia:

**Se você NÃO reconhece essas mudanças** (provavelmente do Electron/Cache):
```bash
git reset --hard origin/main
```

**Se você FEZ mudanças importantes**:
```bash
git stash
git pull
git stash pop
```

---

## 🔍 Entendendo o Erro

**O que significa "divergent branches"?**

```
   GitHub (origin/main)          Seu Local (main)
         |                              |
         |                              |
    [commit A]                     [commit X]
    [commit B]                     [commit Y]
    [commit C]                     [commit Z]
         |                              |
         └──────── DIVERGÊNCIA ─────────┘
```

Seu repositório local tem commits que o GitHub não tem, e vice-versa.

---

## ⚙️ Configurar Comportamento Padrão (Opcional)

Para não ver esse erro no futuro:

```bash
# Usar merge por padrão (mantém histórico)
git config --global pull.rebase false

# OU usar rebase por padrão (histórico linear)
git config --global pull.rebase true

# OU aceitar apenas fast-forward (mais seguro)
git config --global pull.ff only
```

**Recomendação:** Use `pull.rebase false` (merge) se você não entende as diferenças.

---

## 🆘 Casos Especiais

### **Erro: "Already up to date" mas não vejo mudanças**

```bash
git fetch --all
git reset --hard origin/main
npm install
npm start
```

---

### **Erro ao fazer merge: "too many conflicts"**

Desista e use a versão do GitHub:
```bash
git merge --abort
git reset --hard origin/main
```

---

### **Salvei mudanças importantes mas o stash não funciona**

```bash
# Criar um branch temporário com suas mudanças
git checkout -b minhas-mudanças-backup
git add .
git commit -m "Backup das minhas mudanças"

# Voltar para main e pegar do GitHub
git checkout main
git reset --hard origin/main

# Suas mudanças estão salvas no branch "minhas-mudanças-backup"
```

---

## ✅ Checklist de Resolução

- [ ] Parei a aplicação (se estava rodando)
- [ ] Entrei na pasta do projeto (`cd ~/dev/nu/jira-monitor`)
- [ ] Decidi se tenho mudanças importantes localmente
- [ ] Executei um dos comandos de solução
- [ ] Rodei `npm install` (se necessário)
- [ ] Iniciei com `npm start`
- [ ] Confirmei que a aplicação está funcionando

---

## 💡 Para Evitar Esse Problema no Futuro

### **Sempre antes de começar a trabalhar:**

```bash
cd ~/dev/nu/jira-monitor
git pull
```

### **Não edite arquivos diretamente no projeto se não for fazer commit**

### **Use um branch separado para experimentar:**

```bash
git checkout -b meus-testes
# Faça suas mudanças...
# Para voltar ao normal:
git checkout main
git pull
```

---

## 📞 Ajuda Rápida

| Situação | Comando |
|----------|---------|
| **Não fiz mudanças, só quero atualizar** | `git reset --hard origin/main && npm start` |
| **Tenho mudanças, quero manter** | `git stash && git pull && git stash pop` |
| **Tenho conflitos, aceitar versão do GitHub** | `git reset --hard origin/main` |
| **Ver o que mudou localmente** | `git status && git diff` |
| **Desistir de tudo e recomeçar** | `git fetch --all && git reset --hard origin/main` |

---

## 🎯 TL;DR (Muito Longo, Não Li)

### **Solução em 1 linha:**

```bash
cd ~/dev/nu/jira-monitor && git reset --hard origin/main && npm install && npm start
```

Isso resolve 99% dos casos! ✅

---

## 📚 Mais Informações

- Git Pull Documentation: https://git-scm.com/docs/git-pull
- Git Rebase vs Merge: https://www.atlassian.com/git/tutorials/merging-vs-rebasing

---

**Última atualização:** Janeiro 2026
