# 🚨 Menu Bar Invisível? Execute Isto!

## ⚡ Solução Rápida (1 comando)

```bash
cd "/Users/seu-usuario/jira monitor"
./fix-menu-bar.sh
```

Isso vai:
1. ✅ Matar processos antigos
2. ✅ Reinstalar dependências
3. ✅ Abrir configurações de permissões
4. ✅ Iniciar o app

---

## 🔧 Solução Manual (se preferir)

### 1. Matar processos

```bash
pkill -9 -f electron
```

### 2. Reinstalar dependências

```bash
cd "/Users/seu-usuario/jira monitor"
npm install
```

### 3. Dar permissões no macOS

**IMPORTANTE:** Sem isso o ícone não funciona!

1. Abra: **Configurações do Sistema** > **Privacidade e Segurança**
2. Clique em: **Gravação de Tela** (Screen Recording)
3. Procure **Electron** e marque ✅
4. Clique em: **Acessibilidade** (Accessibility)
5. Procure **Electron** e marque ✅

### 4. Iniciar app

```bash
./node_modules/.bin/electron .
```

---

## ✅ Como Saber se Funcionou?

1. **Olhe no canto superior direito** da tela
2. **Você deve ver o ícone** do Jira Monitor (ou emojis 🔴🟡🟢)
3. **Clique no ícone** - o menu deve abrir
4. **Tire um screenshot** (Cmd+Shift+4) - o ícone deve aparecer

---

## 🆘 Ainda não funcionou?

Rode com logs:

```bash
./node_modules/.bin/electron . 2>&1 | tee debug.log
```

Envie o arquivo `debug.log` para análise.

---

## 📖 Documentação Completa

Para mais detalhes: [FIX-MENU-BAR-INVISIVEL.md](./FIX-MENU-BAR-INVISIVEL.md)
