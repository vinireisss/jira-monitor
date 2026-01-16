# ⚡ Atualizar Jira Monitor em 3 Comandos

## 🎯 Para Quem Não Sabe Git (Guia Super Simples)

Se você já tem o Jira Monitor instalado e quer as correções dos contadores, **copie e cole estes 3 comandos no Terminal**.

---

## 📋 Passo a Passo

### 1️⃣ Abra o Terminal

- Pressione `Cmd + Espaço`
- Digite: `Terminal`
- Pressione `Enter`

---

### 2️⃣ Copie e Cole os 3 Comandos

**Copie TUDO de uma vez** (selecione as 3 linhas abaixo) e cole no Terminal:

```bash
cd ~/dev/nu/jira-monitor && chmod +x atualizar-app.sh && ./atualizar-app.sh
```

**Pronto!** 🎉

---

## 💬 O Que Vai Acontecer

Você vai ver mensagens no terminal assim:

```
╔════════════════════════════════════════════════════════╗
║       🔄 ATUALIZADOR AUTOMÁTICO - JIRA MONITOR        ║
╚════════════════════════════════════════════════════════╝

[1/7] Verificando ambiente...
✅ Pasta correta encontrada

[2/7] Fechando Jira Monitor...
✅ App fechado

[3/7] Verificando branch...
ℹ️  Branch atual: main

[4/7] Verificando mudanças locais...
✅ Nenhuma mudança local encontrada

[5/7] Buscando atualizações do servidor...
ℹ️  Atualizações disponíveis no servidor

[6/7] Aplicando atualizações...
✅ Atualizações aplicadas com sucesso!

╔════════════════════════════════════════════════════════╗
║            ✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!      ║
╚════════════════════════════════════════════════════════╝

Deseja iniciar o Jira Monitor agora? (s/n):
```

**Digite `s` e pressione Enter** para iniciar o app atualizado.

---

## 🆘 E Se Der Erro?

### Erro: "Você tem mudanças não salvas"

O script vai perguntar:

```
⚠️  Você tem mudanças não salvas:
Deseja salvar temporariamente suas mudanças? (s/n):
```

**Digite `s` e pressione Enter** → Suas mudanças serão guardadas

---

### Erro: "comando não encontrado: git"

Instale o Git primeiro:

```bash
xcode-select --install
```

Depois execute os 3 comandos novamente.

---

### Erro: "permissão negada"

Execute este comando primeiro:

```bash
chmod +x ~/dev/nu/jira-monitor/atualizar-app.sh
```

Depois execute os 3 comandos novamente.

---

## ✅ Como Saber se Funcionou?

Depois da atualização, **abra o app** e:

1. Pressione `Cmd + Option + I` (abre o console)
2. Digite: `debugCustomCounters()`
3. Pressione `Enter`

Se você vir informações detalhadas dos contadores, **funcionou!** ✅

---

## 📊 Se Preferir Fazer Manualmente

Copie e cole **UM comando de cada vez**:

```bash
# 1. Ir para a pasta
cd ~/dev/nu/jira-monitor
```

```bash
# 2. Fechar o app
pkill -9 Electron
```

```bash
# 3. Baixar atualizações
git pull origin main
```

```bash
# 4. Iniciar o app
npm start
```

---

## 💡 Comandos Extras Úteis

### Ver se está atualizado:
```bash
cd ~/dev/nu/jira-monitor && git log --oneline -1
```

**Você deve ver:**
```
b886dd0 Merge branch 'fix/contadores-customizados-zero'
```

### Ver arquivos novos:
```bash
cd ~/dev/nu/jira-monitor && ls -la | grep CONTADORES
```

**Você deve ver:**
```
DEBUG-CONTADORES-ZERO.md
INSTRUCOES-RAPIDAS-CONTADORES.md
RESUMO-ATUALIZACAO-CONTADORES.md
SOLUCAO-CONTADORES-ZERO.md
```

---

## 🎓 O Que Foi Corrigido?

Esta atualização corrige os contadores que mostravam **0** mesmo quando havia tickets no Jira:

- 📱 **Tickets Pending SimCard**
- 🤖 **Tickets L0 Jira Bot**
- 🎯 **All L1 Open**

### Novidades:
- ✅ Logs detalhados no terminal
- ✅ Função de debug no console
- ✅ Documentação completa de troubleshooting

---

## 📚 Quer Saber Mais?

Leia estes arquivos (na ordem):

1. **INSTRUCOES-RAPIDAS-CONTADORES.md** ⭐ (comece por aqui)
2. **SOLUCAO-CONTADORES-ZERO.md** (guia completo)
3. **DEBUG-CONTADORES-ZERO.md** (se os contadores ainda estiverem errados)

---

## 🆘 Ainda Não Funcionou?

1. Tire um print do erro
2. Copie os comandos que você executou
3. Envie no canal do time

---

## 🚀 Resumão (TL;DR)

**Copie e cole isto no Terminal:**

```bash
cd ~/dev/nu/jira-monitor && chmod +x atualizar-app.sh && ./atualizar-app.sh
```

**Quando perguntar se quer iniciar, digite `s`**

**Pronto!** ✅

---

**Última atualização:** 16/01/2026
