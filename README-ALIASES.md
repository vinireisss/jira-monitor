# 🚀 Jira Monitor - Guia de Aliases

Este guia explica como configurar e usar os comandos rápidos (aliases) do Jira Monitor.

---

## 📦 Instalação Rápida

Execute os seguintes comandos no terminal:

```bash
cd ~/dev/nu/jira-monitor
git pull origin main
./fix-aliases.sh
source ~/.zshrc
```

**Pronto!** Os aliases estão instalados e prontos para usar! 🎉

---

## ⚡ Comandos Disponíveis

### 1. `j` - Abrir o Jira Monitor ⭐ (Recomendado!)

O comando mais rápido para abrir o app!

```bash
j
```

**O que faz:**
- Navega para o diretório do projeto
- Inicia o app em background
- Redireciona output (sem poluir o terminal)

---

### 2. `jira-update` - Atualizar para última versão 🔄

Use este comando sempre que houver uma nova atualização no GitHub!

```bash
jira-update
```

**O que faz:**
1. Navega para o diretório do projeto
2. Faz `git pull origin main` (baixa últimas mudanças)
3. Roda `npm install` (instala novas dependências se houver)

**Quando usar:**
- Quando o time avisar sobre nova atualização
- Se encontrar bugs que já foram corrigidos
- Para ter as últimas features

---

### 3. `jira-restart` - Reiniciar o app 🔁

Use quando o app travar ou ficar lento.

```bash
jira-restart
```

**O que faz:**
1. Mata todos os processos do Electron relacionados ao Jira Monitor
2. Aguarda 1 segundo para garantir que tudo foi fechado
3. Inicia o app novamente em background

**Quando usar:**
- App travou
- App está consumindo muita memória
- Após atualizar para aplicar mudanças

---

### 4. `jira-status` - Ver status do Git 📊

Verifica se há mudanças locais ou se está desatualizado.

```bash
jira-status
```

**O que faz:**
- Mostra o status atual do repositório Git
- Lista arquivos modificados (se houver)
- Mostra se está atualizado com o GitHub

---

### 5. `jira-log` - Ver últimos commits 📜

Veja as últimas 10 atualizações do projeto.

```bash
jira-log
```

**O que faz:**
- Mostra os últimos 10 commits
- Formato compacto (uma linha por commit)

---

## 🛠️ Troubleshooting

### Aliases não funcionam após instalação

**Solução 1: Recarregar o terminal**

```bash
source ~/.zshrc
```

**Solução 2: Fechar e reabrir o terminal**

Simplesmente feche a aba/janela do terminal e abra uma nova.

---

### Erro: "command not found: j"

**Causa:** Aliases ainda não foram instalados ou não foram carregados.

**Solução:**

```bash
cd ~/dev/nu/jira-monitor
./fix-aliases.sh
source ~/.zshrc
```

---

### Erro ao executar fix-aliases.sh

**Sintoma:**

```
zsh: permission denied: ./fix-aliases.sh
```

**Solução:** Dar permissão de execução

```bash
chmod +x fix-aliases.sh install-aliases.sh
./fix-aliases.sh
```

---

### jira-restart não fecha o app

**Solução manual:**

1. Abra o **Monitor de Atividade** (Activity Monitor)
2. Busque por "Electron" ou "Jira Monitor"
3. Force-quit o processo
4. Execute `j` para iniciar novamente

---

### Quero remover os aliases

Edite o arquivo `~/.zshrc` e remova as linhas que começam com:

```bash
# 🎯 Jira Monitor - Comandos Rápidos
```

Depois recarregue:

```bash
source ~/.zshrc
```

---

## 🎯 Workflow Recomendado

### Primeira vez

```bash
cd ~/dev/nu/jira-monitor
./fix-aliases.sh
source ~/.zshrc
j
```

### Uso diário

```bash
j  # Abrir o app
```

### Quando houver atualização

```bash
jira-update
jira-restart
```

### Se o app travar

```bash
jira-restart
```

---

## 📝 Verificar se os aliases estão instalados

Execute este comando para verificar:

```bash
type j jira-update jira-restart
```

**Resultado esperado:**

```
j is an alias for cd ~/dev/nu/jira-monitor && npm start > /dev/null 2>&1 &
jira-update is an alias for cd ~/dev/nu/jira-monitor && git pull origin main && npm install
jira-restart is an alias for cd ~/dev/nu/jira-monitor && pkill -9 -f "electron.*jira-monitor" 2>/dev/null; sleep 1; pkill -9 Electron 2>/dev/null; sleep 0.5; npm start > /dev/null 2>&1 &
```

---

## 💡 Dicas

### 1. Use `j` em vez de `npm start`

❌ **Evite:**
```bash
cd ~/dev/nu/jira-monitor
npm start
```

✅ **Use:**
```bash
j
```

### 2. Sempre atualize antes de reportar bugs

```bash
jira-update
jira-restart
```

Muitos bugs já foram corrigidos nas versões mais recentes!

### 3. Verifique o log para ver novidades

```bash
jira-log
```

### 4. Combine comandos

```bash
jira-update && jira-restart
```

---

## 🆘 Precisa de Ajuda?

**Contatos:**
- 📧 Gabriel Silva: gabriel.silva.digisystem@nubank.com.br
- 📧 Yanka Dantas: yanka.araujo.digisystem@nubank.com.br
- 💬 Slack: @GABS SILVA | @ya (Yanka Dantas)

**GitHub:**
- 🔗 https://github.com/gabinubank/jira-monitor

---

## 📋 Checklist Pós-Instalação

- [ ] Executei `./fix-aliases.sh`
- [ ] Executei `source ~/.zshrc`
- [ ] Testei o comando `j`
- [ ] O app abriu corretamente
- [ ] Li este guia

---

**Feito com ❤️ para facilitar o dia a dia do time IT**
