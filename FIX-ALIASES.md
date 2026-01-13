# 🔧 Aliases não funcionam? Resolva aqui!

## 🚨 Problema

Você instalou o Jira Monitor mas os aliases não funcionam:
- `j` - não abre o app
- `jira-update` - comando não encontrado
- `jira-restart` - comando não encontrado

## ✅ Solução Rápida (Método 1)

Execute o script de correção:

```bash
cd ~/dev/nu/jira-monitor
./fix-aliases.sh
```

Depois, **recarregue o terminal**:

```bash
source ~/.zshrc
```

Ou simplesmente **feche e reabra o terminal**.

## 🛠️ Solução Manual (Método 2)

### Passo 1: Verificar qual shell você usa

```bash
echo $SHELL
```

Resultado comum:
- `/bin/zsh` → você usa **Zsh** (padrão do macOS)
- `/bin/bash` → você usa **Bash**

### Passo 2: Executar o instalador de aliases

```bash
cd ~/dev/nu/jira-monitor
./install-aliases.sh
```

### Passo 3: Recarregar o shell

**Para Zsh:**
```bash
source ~/.zshrc
```

**Para Bash:**
```bash
source ~/.bashrc
# ou
source ~/.bash_profile
```

### Passo 4: Testar

```bash
j
```

Se funcionar, o Jira Monitor vai abrir! 🎉

## 🔍 Verificação: Os aliases foram instalados?

### Verificar se estão no arquivo

**Para Zsh:**
```bash
grep "Jira Monitor" ~/.zshrc
```

**Para Bash:**
```bash
grep "Jira Monitor" ~/.bashrc
grep "Jira Monitor" ~/.bash_profile
```

Se aparecer algo como `# 🎯 Jira Monitor - Comandos Rápidos`, significa que os aliases estão instalados!

### Verificar se o alias está carregado

```bash
type j
```

**Resultado esperado:**
```
j is an alias for cd ~/dev/nu/jira-monitor && npm start > /dev/null 2>&1 &
```

**Se aparecer "j not found":**
- Você precisa recarregar o shell (ver Passo 3)
- Ou fechar e reabrir o terminal

## 🆘 Ainda não funciona?

### Problema: Terminal do Cursor

Se você está usando o terminal integrado do **Cursor**, ele pode não carregar os arquivos de configuração.

**Solução:**
1. Use o **Terminal nativo do macOS** (CMD+Espaço → Terminal)
2. Ou configure o Cursor para carregar o shell:
   ```bash
   # Adicione no início do seu ~/.zshrc ou ~/.bashrc
   source ~/.zshrc  # ou ~/.bashrc se usar bash
   ```

### Problema: Múltiplos shells

Se você usa tanto `bash` quanto `zsh`:

```bash
cd ~/dev/nu/jira-monitor
./install-aliases.sh
```

Isso instalará nos dois!

### Problema: Permissão negada

```bash
cd ~/dev/nu/jira-monitor
chmod +x install-aliases.sh
./install-aliases.sh
```

## 📋 Aliases Disponíveis

Depois de instalar corretamente:

| Alias | Descrição |
|-------|-----------|
| `j` | Abre o Jira Monitor em background |
| `jira-update` | Atualiza para última versão do Git |
| `jira-restart` | Mata e reinicia o app |
| `jira-status` | Mostra status do Git |
| `jira-log` | Mostra últimos 10 commits |

## 💡 Dica: Testar se está funcionando

Depois de recarregar o shell, teste um por um:

```bash
# Teste 1: Verificar se alias existe
type j

# Teste 2: Usar o alias
j

# Teste 3: Ver os outros aliases
type jira-update
type jira-restart
```

## 🔄 Para quem reinstalou o app

Se você reinstalou com:
```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

A nova versão **já instala os aliases automaticamente**! 

Você só precisa:
1. Recarregar o terminal: `source ~/.zshrc`
2. Ou fechar e reabrir o terminal
3. Digitar: `j`

## ✨ Funcionou!

Agora você pode usar:

```bash
j                # Abre o app
jira-update      # Atualiza
jira-restart     # Reinicia
```

Aproveite! 🚀
