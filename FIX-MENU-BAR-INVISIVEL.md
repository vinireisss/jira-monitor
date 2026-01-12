# 🔧 Fix: Menu Bar Invisível ou Não Clicável

## 🐛 Problema

Após `git pull`, o ícone do Menu Bar:
- ✅ Aparece inicialmente
- ❌ Some ao tirar screenshot
- ❌ Fica não clicável (como se não existisse)

## 🎯 Causa

O macOS está bloqueando as permissões do app (Electron).

---

## ✅ Solução 1: Dar Permissões no macOS

### Passo 1: Abrir Configurações do Sistema

```bash
# Abrir diretamente as configurações de Privacidade
open "x-apple.systempreferences:com.apple.preference.security?Privacy"
```

### Passo 2: Dar Permissão de "Screen Recording"

1. No menu lateral, clique em **"Screen Recording"** (Gravação de Tela)
2. Procure por **"Electron"** na lista
3. Marque o checkbox ✅
4. Se não aparecer, clique no **"+"** e adicione:
   - Caminho: `/Users/[seu-usuario]/jira monitor/node_modules/.bin/electron`

### Passo 3: Dar Permissão de "Accessibility"

1. No menu lateral, clique em **"Accessibility"** (Acessibilidade)
2. Procure por **"Electron"** na lista
3. Marque o checkbox ✅
4. Se não aparecer, clique no **"+"** e adicione:
   - Caminho: `/Users/[seu-usuario]/jira monitor/node_modules/.bin/electron`

### Passo 4: Reiniciar o App

```bash
# Fechar completamente
pkill -f electron

# Abrir novamente
cd "/Users/[seu-usuario]/jira monitor"
./node_modules/.bin/electron .
```

---

## ✅ Solução 2: Reinstalar Dependências

Às vezes o problema é que o `git pull` não atualizou as dependências do Electron.

```bash
cd "/Users/[seu-usuario]/jira monitor"

# Limpar cache
rm -rf node_modules
rm package-lock.json

# Reinstalar tudo
npm install

# Iniciar app
./node_modules/.bin/electron .
```

---

## ✅ Solução 3: Matar Processos Duplicados

Pode ter múltiplas instâncias do Electron rodando.

```bash
# Ver quantos processos Electron estão rodando
ps aux | grep -i electron | grep -v grep

# Matar todos
pkill -9 -f electron

# Aguardar 3 segundos
sleep 3

# Iniciar novamente
cd "/Users/[seu-usuario]/jira monitor"
./node_modules/.bin/electron .
```

---

## ✅ Solução 4: Verificar se npm install foi executado

```bash
cd "/Users/[seu-usuario]/jira monitor"

# Ver se tray-manager.js existe
ls -la tray-manager.js

# Se existir, verificar se main.js foi atualizado
grep -n "createTray" main.js

# Se aparecer a função createTray, significa que o código está OK
# Agora rodar:
npm install
./node_modules/.bin/electron .
```

---

## 🧪 Testar se Funcionou

1. **Ícone visível?** Olhe no canto superior direito da tela
2. **Clicável?** Clique no ícone e veja se o menu abre
3. **Aparece em screenshot?** Tire um print e veja se o ícone aparece

---

## 🆘 Se Nada Funcionar

### Debug Completo:

```bash
cd "/Users/[seu-usuario]/jira monitor"

# 1. Verificar se arquivos existem
echo "=== Verificando arquivos ==="
ls -la tray-manager.js main.js

# 2. Ver logs do Electron
echo "=== Iniciando com logs ==="
./node_modules/.bin/electron . 2>&1 | tee electron-debug.log

# 3. Procurar por erros específicos
grep -i "tray\|menu\|icon" electron-debug.log
```

**Enviar o arquivo `electron-debug.log` para análise.**

---

## 📋 Checklist

- [ ] Dei permissão de "Screen Recording"
- [ ] Dei permissão de "Accessibility"  
- [ ] Matei todos os processos Electron
- [ ] Rodei `npm install` após o git pull
- [ ] Reiniciei o app
- [ ] Testei clicar no ícone
- [ ] Testei tirar screenshot

---

## 💡 Dica para Evitar Problemas Futuros

Sempre que fizer `git pull` e o código tiver mudanças importantes:

```bash
git pull
npm install          # ← SEMPRE rodar isso
./node_modules/.bin/electron .
```

---

**✨ Depois de seguir esses passos, o Menu Bar deve funcionar normalmente!**
