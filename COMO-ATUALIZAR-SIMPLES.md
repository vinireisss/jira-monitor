# 🔄 Como Atualizar o Jira Monitor (Guia Simples)

## 📋 Para quem é este guia?

Se você já tem o Jira Monitor instalado e quer receber as **correções dos contadores** que mostram 0, este guia é para você!

---

## ⚡ Opção 1: ATUALIZAÇÃO AUTOMÁTICA (Recomendado)

### Passo a passo:

**1. Feche o Jira Monitor** (se estiver aberto)

**2. Abra o Terminal** 
   - Pressione `Cmd + Espaço`
   - Digite "Terminal"
   - Pressione Enter

**3. Vá até a pasta do Jira Monitor**

Copie e cole este comando no terminal e pressione Enter:

```bash
cd ~/dev/nu/jira-monitor
```

> 💡 **O que este comando faz?** Entra na pasta onde o Jira Monitor está instalado.

**4. Execute o script de atualização**

Copie e cole este comando e pressione Enter:

```bash
./atualizar-app.sh
```

✅ **Pronto!** O script vai fazer tudo automaticamente:
- Salvar suas mudanças locais
- Baixar as atualizações
- Aplicar as correções
- Reiniciar o app

---

## 🔧 Opção 2: ATUALIZAÇÃO MANUAL (Passo a Passo)

Se preferir fazer manualmente ou o script automático não funcionar:

### Passo 1: Fechar o app

```bash
# Cole este comando no terminal:
pkill -9 Electron
```

> 💡 **O que faz?** Fecha completamente o Jira Monitor.

---

### Passo 2: Ir até a pasta do projeto

```bash
# Cole este comando:
cd ~/dev/nu/jira-monitor
```

> 💡 **O que faz?** Vai até a pasta do app (substitua o caminho se instalou em outro lugar).

---

### Passo 3: Ver se há mudanças locais

```bash
# Cole este comando:
git status
```

**O que você vai ver:**

**Cenário A - Tudo limpo** ✅
```
On branch main
nothing to commit, working tree clean
```
→ **Ótimo!** Pule para o Passo 4.

**Cenário B - Tem mudanças** ⚠️
```
Changes not staged for commit:
  modified:   algum-arquivo.js
```
→ **Continue para o Passo 3.1**

---

### Passo 3.1: Salvar suas mudanças (se houver)

```bash
# Cole este comando:
git stash
```

> 💡 **O que faz?** Guarda suas mudanças temporariamente para não serem perdidas.

**Você vai ver:**
```
Saved working directory and index state...
```

✅ **Suas mudanças estão salvas!**

---

### Passo 4: Baixar as atualizações

```bash
# Cole este comando:
git pull origin main
```

> 💡 **O que faz?** Baixa as correções mais recentes do servidor.

**Você vai ver:**
```
Updating 7b251e2..b886dd0
Fast-forward
 DEBUG-CONTADORES-ZERO.md         | 211 +++++
 jira-service.js                  | 105 +++-
 renderer.js                      | 158 +++-
 ...
```

✅ **Arquivos baixados com sucesso!**

---

### Passo 5: Recuperar suas mudanças (se salvou no Passo 3.1)

**Somente se você executou `git stash` no Passo 3.1:**

```bash
# Cole este comando:
git stash pop
```

> 💡 **O que faz?** Restaura as mudanças que você tinha antes.

---

### Passo 6: Reiniciar o app

```bash
# Cole este comando:
npm start
```

> 💡 **O que faz?** Inicia o Jira Monitor com as correções.

✅ **Pronto! App atualizado e rodando!**

---

## 🆘 Problemas Comuns

### Problema 1: "comando não encontrado: git"

**Solução:**
```bash
# Instale o git primeiro:
xcode-select --install
```

Depois tente novamente do Passo 2.

---

### Problema 2: "não é um repositório git"

**Causa:** Você não instalou via `git clone`

**Solução:** Siga o guia de instalação manual:
1. Baixe o projeto novamente: https://github.com/SEU_REPO_AQUI
2. Ou veja: `INSTALACAO-GIT.md`

---

### Problema 3: Mensagem de "conflito"

```
error: Your local changes to the following files would be overwritten by merge:
```

**Solução:**

**Opção A - Descartar suas mudanças locais:**
```bash
git reset --hard HEAD
git pull origin main
```

**Opção B - Salvar suas mudanças:**
```bash
git stash
git pull origin main
git stash pop
```

---

### Problema 4: "permissão negada"

```bash
# Torne o script executável:
chmod +x atualizar-app.sh
```

Depois execute novamente.

---

## ✅ Como saber se atualizou corretamente?

Depois de atualizar:

### 1. Veja a versão dos arquivos

```bash
git log --oneline -1
```

**Você deve ver:**
```
b886dd0 Merge branch 'fix/contadores-customizados-zero'
```

### 2. Verifique se os novos arquivos existem

```bash
ls -la | grep CONTADORES
```

**Você deve ver:**
```
DEBUG-CONTADORES-ZERO.md
INSTRUCOES-RAPIDAS-CONTADORES.md
RESUMO-ATUALIZACAO-CONTADORES.md
SOLUCAO-CONTADORES-ZERO.md
```

### 3. Teste os novos logs

1. Abra o app: `npm start`
2. Aguarde 60 segundos
3. Procure no terminal por linhas com 🔍
4. Você deve ver blocos de log detalhados

### 4. Teste a função de debug

1. Pressione `Cmd+Option+I` (abre DevTools)
2. No console, digite: `debugCustomCounters()`
3. Você deve ver informações detalhadas dos contadores

---

## 📊 Resumo dos Comandos (Cheat Sheet)

```bash
# Atualização completa (copie linha por linha):
cd ~/dev/nu/jira-monitor
pkill -9 Electron
git status
git stash                    # (só se houver mudanças)
git pull origin main
git stash pop               # (só se usou stash)
npm start
```

---

## 🎓 Explicação: O que mudou?

### Correções aplicadas:
- ✅ Logs detalhados nos contadores customizados
- ✅ Função `debugCustomCounters()` para diagnóstico
- ✅ Documentação completa de troubleshooting
- ✅ Alertas quando contadores estão incorretos

### Como usar as novidades:
Leia: `INSTRUCOES-RAPIDAS-CONTADORES.md`

---

## 💡 Dicas

### Para ver o que mudou:
```bash
git log --oneline -5
```

### Para ver diferenças nos arquivos:
```bash
git diff HEAD~1
```

### Para voltar para versão anterior (se der problema):
```bash
git log                    # Anote o código do commit anterior
git checkout CODIGO_AQUI   # Substitua CODIGO_AQUI pelo código
```

---

## 🆘 Ainda com dúvida?

1. **Leia primeiro**: `INSTRUCOES-RAPIDAS-CONTADORES.md`
2. **Tire print** da mensagem de erro
3. **Envie** para o time com o comando que executou

---

## 📞 Contatos

- 🐛 Problemas? Abra uma issue no GitHub
- 💬 Dúvidas? Pergunte no canal do time

---

**Última atualização:** 16/01/2026
