# 📺 Guia Visual: Atualização do Jira Monitor

## 🎯 Objetivo

Atualizar o Jira Monitor para corrigir os contadores que mostram 0.

---

## 🚀 Método 1: AUTOMÁTICO (1 comando)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Abra o Terminal                                     │
│     (Cmd + Espaço → "Terminal" → Enter)                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  2. COPIE e COLE este comando:                          │
│                                                         │
│  cd ~/dev/nu/jira-monitor && ./atualizar-app.sh        │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  3. Quando perguntar se quer iniciar o app:            │
│                                                         │
│     Digite: s                                           │
│     (e pressione Enter)                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
                    ✅ PRONTO!
```

---

## 🔧 Método 2: MANUAL (4 comandos)

```
┌─────────────────────────────────────────────────────────┐
│  PASSO 1: Ir para a pasta                               │
└─────────────────────────────────────────────────────────┘

   cd ~/dev/nu/jira-monitor

                          ↓

┌─────────────────────────────────────────────────────────┐
│  PASSO 2: Fechar o app (se estiver aberto)             │
└─────────────────────────────────────────────────────────┘

   pkill -9 Electron

                          ↓

┌─────────────────────────────────────────────────────────┐
│  PASSO 3: Baixar atualizações                           │
└─────────────────────────────────────────────────────────┘

   git pull origin main

                          ↓

┌─────────────────────────────────────────────────────────┐
│  PASSO 4: Iniciar o app                                 │
└─────────────────────────────────────────────────────────┘

   npm start

                          ↓
                    ✅ PRONTO!
```

---

## 📊 O Que Você Vai Ver

### Durante a Atualização:

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
ℹ️  Atualizações disponíveis

[6/7] Aplicando atualizações...
✅ Atualizações aplicadas com sucesso!

╔════════════════════════════════════════════════════════╗
║            ✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!      ║
╚════════════════════════════════════════════════════════╝
```

---

## 🎯 Como Testar se Funcionou

```
┌─────────────────────────────────────────────────────────┐
│  1. Abra o app (se não abriu automaticamente)          │
└─────────────────────────────────────────────────────────┘

   npm start

                          ↓

┌─────────────────────────────────────────────────────────┐
│  2. Abra o Console de Desenvolvedor                     │
└─────────────────────────────────────────────────────────┘

   Pressione: Cmd + Option + I

                          ↓

┌─────────────────────────────────────────────────────────┐
│  3. Digite no console:                                  │
└─────────────────────────────────────────────────────────┘

   debugCustomCounters()

                          ↓

┌─────────────────────────────────────────────────────────┐
│  4. Você deve ver informações detalhadas assim:         │
└─────────────────────────────────────────────────────────┘

   📱 TICKETS PENDING SIMCARD:
      ✅ Count: 15
      ✅ Tickets: 15
      📋 JQL: ...
   
   🤖 TICKETS L0 JIRA BOT:
      ✅ Count: 8
      ...
   
   🎯 ALL L1 OPEN:
      ✅ Count: 23
      ...

                          ↓
                    ✅ FUNCIONOU!
```

---

## ⚠️ Problemas Comuns

### Problema 1: "comando não encontrado: git"

```
┌─────────────────────────────────────────────────────────┐
│  SOLUÇÃO: Instalar Git                                  │
└─────────────────────────────────────────────────────────┘

   xcode-select --install

   (Aguarde a instalação terminar)

   Depois execute a atualização novamente
```

---

### Problema 2: "Você tem mudanças não salvas"

```
┌─────────────────────────────────────────────────────────┐
│  O script vai perguntar:                                │
└─────────────────────────────────────────────────────────┘

   ⚠️  Você tem mudanças não salvas:
   Deseja salvar temporariamente suas mudanças? (s/n):

                          ↓

   Digite: s
   (e pressione Enter)

                          ↓

   ✅ Suas mudanças serão guardadas
      e restauradas depois!
```

---

### Problema 3: "permissão negada"

```
┌─────────────────────────────────────────────────────────┐
│  SOLUÇÃO: Dar permissão ao script                       │
└─────────────────────────────────────────────────────────┘

   chmod +x ~/dev/nu/jira-monitor/atualizar-app.sh

   Depois execute a atualização novamente
```

---

## 📋 Checklist Rápido

Antes de pedir ajuda, verifique:

```
□ Fechei o Jira Monitor antes de atualizar?
□ Estou na pasta correta (~dev/nu/jira-monitor)?
□ Tenho Git instalado? (digite: git --version)
□ Copiei o comando completo (sem cortar)?
□ Executei todos os passos na ordem?
```

---

## 🎓 O Que Foi Atualizado

```
┌─────────────────────────────────────────────────────────┐
│  ANTES                          DEPOIS                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Contadores mostrando 0    →    Logs detalhados        │
│                                                         │
│  Difícil diagnosticar      →    Função de debug        │
│                                                         │
│  Sem documentação          →    4 guias completos      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Arquivos Novos:

```
📄 DEBUG-CONTADORES-ZERO.md
📄 INSTRUCOES-RAPIDAS-CONTADORES.md
📄 RESUMO-ATUALIZACAO-CONTADORES.md
📄 SOLUCAO-CONTADORES-ZERO.md
📄 ATUALIZAR-3-COMANDOS.md
📄 COMO-ATUALIZAR-SIMPLES.md
📄 GUIA-VISUAL-ATUALIZACAO.md (este arquivo)
🔧 atualizar-app.sh (script automático)
```

---

## 💡 Dica Pro

**Adicione um alias no seu terminal** para atualizar mais rápido:

```bash
echo 'alias atualizar-jira="cd ~/dev/nu/jira-monitor && ./atualizar-app.sh"' >> ~/.zshrc
source ~/.zshrc
```

Agora você pode atualizar apenas digitando:

```bash
atualizar-jira
```

---

## 📚 Mais Ajuda

| Situação | Documento |
|----------|-----------|
| Primeira vez atualizando | **ATUALIZAR-3-COMANDOS.md** ⭐ |
| Preciso de mais detalhes | **COMO-ATUALIZAR-SIMPLES.md** |
| Contadores ainda em 0 | **INSTRUCOES-RAPIDAS-CONTADORES.md** |
| Erro complexo | **DEBUG-CONTADORES-ZERO.md** |
| Entender as mudanças | **RESUMO-ATUALIZACAO-CONTADORES.md** |

---

## 🆘 Suporte

```
┌─────────────────────────────────────────────────────────┐
│  Se nada funcionou:                                     │
│                                                         │
│  1. Tire print do erro no terminal                      │
│  2. Copie os comandos que executou                      │
│  3. Envie no canal do time                              │
│                                                         │
│  Incluir:                                               │
│  • Print do terminal com erro                           │
│  • Comandos executados                                  │
│  • Sistema operacional e versão                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 Resumo Final

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              📋 COMANDO ÚNICO (COPIAR)                  │
│                                                         │
│   cd ~/dev/nu/jira-monitor && ./atualizar-app.sh       │
│                                                         │
│              (Cole no Terminal e pressione Enter)       │
│                                                         │
└─────────────────────────────────────────────────────────┘

                          ↓
                          
                 Aguarde a atualização
                          
                          ↓
                          
           Digite 's' quando perguntar se quer iniciar
                          
                          ↓
                          
                    ✅ PRONTO!
```

---

**Última atualização:** 16/01/2026

**Versão do guia:** 1.0

**Compatível com:** macOS, Linux
