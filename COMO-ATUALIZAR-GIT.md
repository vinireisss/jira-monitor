# 🔄 Como Atualizar o Jira Monitor (Para a Equipe)

## 🎯 Guia Rápido de Atualização

### Método 1: Atualização Rápida (Recomendado) ⚡

Execute este comando único no terminal:

```bash
cd ~/dev/nu/jira-monitor && git pull && npm install && npm start
```

**O que esse comando faz:**
1. ✅ Entra na pasta do projeto
2. ✅ Baixa as últimas atualizações do Git
3. ✅ Atualiza dependências (se houver novas)
4. ✅ Inicia a aplicação

---

## 📋 Método 2: Passo a Passo Detalhado

### 1️⃣ **Fechar a Aplicação (se estiver rodando)**

No terminal:
```bash
pkill -9 -f "jira-monitor"
```

Ou simplesmente feche a janela do Jira Monitor normalmente.

---

### 2️⃣ **Entrar na Pasta do Projeto**

```bash
cd ~/dev/nu/jira-monitor
```

*(Ajuste o caminho se você instalou em outro lugar)*

---

### 3️⃣ **Baixar as Atualizações**

```bash
git pull
```

**O que você vai ver:**
```
remote: Enumerating objects: 15, done.
remote: Counting objects: 100% (15/15), done.
remote: Compressing objects: 100% (8/8), done.
Updating 3a2b1c4..25a3279
Fast-forward
 jira-service.js  | 966 +++++++++++++++++++++++++++++++++++++--
 renderer.js      | 410 +++++++++++++++--
 ...
 13 files changed, 1843 insertions(+), 314 deletions(-)
```

---

### 4️⃣ **Atualizar Dependências (Opcional)**

*Só se houver mudanças no `package.json`:*

```bash
npm install
```

---

### 5️⃣ **Iniciar a Aplicação**

```bash
npm start
```

**Pronto!** ✨ A aplicação vai abrir com todas as novas funcionalidades.

---

## 🆕 O Que Mudou Nesta Versão?

### ✨ Novos Recursos:
- **Tickets Avaliados Completo:** Sistema de busca exaustiva com +3000 tickets históricos
- **Filtros por Estrelas:** Visualize tickets por avaliação (1-5 ⭐)
- **Ícones Coloridos:** Todos os cards agora têm ícones visuais modernos
- **Avatares Personalizados:** Iniciais coloridas para cada usuário
- **Modo Densidade:** Ajuste o espaçamento da interface
- **Persistência Total:** Pro Mode, posição da janela e densidade são salvos

### 🔧 Correções:
- Busca agora pega TODOS os tickets (não para mais em 70)
- JQL `assignee = currentUser()` funcionando corretamente
- Erro EPIPE resolvido
- Ícones das filas SIMCard, L0 Bot e L1 Open agora mostram assignees corretos

### 🎨 Melhorias Visuais:
- Interface mais responsiva (adapta ao tamanho da janela)
- Filtros de estrelas com design premium
- Gradientes suaves em todos os cards
- Animações mais fluidas

---

## ⚠️ Possíveis Problemas e Soluções

### ❌ **"Your local changes would be overwritten by merge"**

**Você tem mudanças não salvas.** Escolha uma opção:

**Opção A - Guardar suas mudanças temporariamente:**
```bash
git stash
git pull
git stash pop
```

**Opção B - Descartar suas mudanças locais:**
```bash
git reset --hard
git pull
```

---

### ❌ **"Already up to date" mas não vejo as mudanças**

Verifique se está no branch correto:

```bash
git branch
```

Se não estiver em `main`, mude:
```bash
git checkout main
git pull
```

---

### ❌ **Erro ao iniciar: "Port already in use"**

Mate processos antigos:
```bash
pkill -9 -f "jira-monitor"
pkill -9 -f "electron"
npm start
```

---

### ❌ **Configurações foram resetadas**

**Não se preocupe!** Suas credenciais do Jira estão salvas em:
```
~/Library/Application Support/jira-monitor/config.json
```

Se você perder algo, basta reconfigurar na interface.

---

## 🔍 Verificar Versão Atual

Para saber qual versão você está usando:

```bash
cat package.json | grep version
```

**Versão esperada:** `1.5.0` (ou superior)

---

## 🚀 Workflow Completo de Atualização

```bash
# 1. Fechar app
pkill -9 -f "jira-monitor"

# 2. Entrar na pasta
cd ~/dev/nu/jira-monitor

# 3. Verificar status
git status

# 4. Baixar atualizações
git pull

# 5. Atualizar dependências (se necessário)
npm install

# 6. Iniciar aplicação
npm start
```

---

## 📊 Antes e Depois

| Funcionalidade | Antes | Agora |
|----------------|-------|-------|
| **Tickets Avaliados** | ~70 tickets | 3000+ tickets ✅ |
| **Filtros por Estrela** | Não funcionava | Funcionando perfeitamente ✅ |
| **Ícones de Filas** | Genéricos | Coloridos e personalizados ✅ |
| **Avatares** | "??" | Iniciais coloridas ✅ |
| **Persistência de Estado** | Resetava ao reiniciar | Salva tudo ✅ |
| **Responsividade** | Header quebrava | Adapta perfeitamente ✅ |

---

## 💡 Dicas Importantes

### 🔁 Atualizações Futuras
- Sempre rode `git pull` antes de começar a trabalhar
- Se houver conflitos, avise o time

### 🧪 Testando Antes de Usar
1. Primeiro teste com `npm start` (modo desenvolvimento)
2. Se tudo funcionar, pode usar normalmente

### 📸 Backup das Configurações (Opcional)
```bash
cp ~/Library/Application\ Support/jira-monitor/config.json ~/Desktop/jira-monitor-backup.json
```

---

## 🆘 Precisa de Ajuda?

### Logs de Debug:
```bash
# Ver logs da aplicação
tail -f ~/.cursor/projects/*/terminals/*.txt
```

### Reset Total (Último Recurso):
```bash
cd ~/dev/nu/jira-monitor
git reset --hard origin/main
npm install
npm start
```

---

## ✅ Checklist de Atualização

- [ ] Fechei a aplicação antiga
- [ ] Rodei `git pull`
- [ ] Rodei `npm install` (se necessário)
- [ ] Iniciei com `npm start`
- [ ] Verifiquei se os filtros de estrelas funcionam
- [ ] Verifiquei se os ícones estão coloridos
- [ ] Testei o modo Pro
- [ ] Confirmei que a posição da janela é salva

---

## 🎉 Pronto!

Agora você está com a versão mais recente do Jira Monitor! 🚀

Se tiver qualquer problema, chame no Slack/Teams ou abra uma issue no repositório.

---

**Última atualização:** Janeiro 2026  
**Versão:** 1.5.0  
**Commit:** `25a3279`
