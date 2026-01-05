# 🔧 Solução: Erro "Node.js v20 não está ativo"

## ❌ Problema

Após clonar o repositório, ao executar `npm start`, você recebe o erro:

```bash
./start.sh: line 22: nvm: command not found
📦 Node.js: v25.2.1 (/opt/homebrew/bin/node)
❌ ERRO: Node.js v20 não está ativo!
❌ Caminho atual do node: /opt/homebrew/bin/node
```

## 🎯 Causa

O **Jira Monitor** requer especificamente **Node.js v20** (instalado via nvm), mas você tem:
- Node.js v25.2.1 instalado via Homebrew
- O comando `nvm` (Node Version Manager) não está disponível

## ✅ Solução Completa

### Opção 1: Instalação Automática (Recomendado)

Execute o script de correção que já está no projeto:

```bash
cd jira-monitor
chmod +x fix-environment.sh
./fix-environment.sh
```

⚠️ **IMPORTANTE**: Após executar o script, **feche e reabra o terminal** antes de tentar `npm start` novamente!

---

### Opção 2: Instalação Manual

Se preferir fazer manualmente, siga os passos:

#### Passo 1: Instalar o nvm

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

#### Passo 2: Configurar o nvm no shell

Adicione ao seu `~/.zshrc` (ou `~/.bash_profile` se usar bash):

```bash
# Abrir arquivo de configuração
nano ~/.zshrc

# Adicionar estas linhas no final do arquivo:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Salvar (Ctrl+O, Enter, Ctrl+X)
```

#### Passo 3: Recarregar o terminal

```bash
# Fechar e reabrir o terminal OU executar:
source ~/.zshrc
```

#### Passo 4: Verificar se nvm está instalado

```bash
nvm --version
# Deve mostrar algo como: 0.39.7
```

#### Passo 5: Instalar Node.js v20

```bash
# Instalar Node v20
nvm install 20

# Definir v20 como padrão
nvm use 20
nvm alias default 20

# Verificar versão
node --version
# Deve mostrar: v20.x.x
```

#### Passo 6: Limpar e reinstalar dependências

```bash
cd jira-monitor

# Limpar instalação anterior
rm -rf node_modules package-lock.json

# Reinstalar com Node v20
npm install
```

#### Passo 7: Iniciar o app

```bash
npm start
```

---

## 🎉 Pronto!

Agora o app deve iniciar corretamente com Node.js v20.

---

## 🔍 Verificação Rápida

Para verificar se tudo está configurado corretamente:

```bash
# Verificar se nvm está disponível
nvm --version

# Verificar qual versão do Node está ativa
node --version
# Deve mostrar: v20.x.x

# Verificar qual Node está sendo usado
which node
# Deve mostrar algo como: /Users/seu-usuario/.nvm/versions/node/v20.x.x/bin/node
# NÃO deve mostrar: /opt/homebrew/bin/node
```

---

## ❓ FAQ

### Por que preciso do Node v20 especificamente?

O Electron 25 (usado no projeto) tem melhor compatibilidade com Node.js v20. Versões mais recentes do Node (v24+) podem ter problemas de dependências.

### Posso usar Node v25?

Não recomendado. O projeto foi testado e otimizado para Node v20. Versões diferentes podem causar problemas inesperados.

### O que é nvm?

**nvm** (Node Version Manager) permite instalar e alternar entre múltiplas versões do Node.js facilmente. Muito útil quando você trabalha em diferentes projetos que requerem versões diferentes.

### E se eu quiser manter o Node v25 do Homebrew?

Não tem problema! O nvm instala versões do Node em paralelo. Você pode usar:
- `nvm use 20` - Para usar Node v20 (para este projeto)
- `nvm use system` - Para voltar ao Node do sistema (Homebrew)

### O comando nvm não funciona mesmo após instalação

Certifique-se de ter:
1. ✅ Adicionado as linhas ao `~/.zshrc` (ou `~/.bash_profile`)
2. ✅ Fechado e reaberto o terminal (ou executado `source ~/.zshrc`)

---

## 🚨 Problemas Persistentes?

Se após seguir todos os passos o erro persistir:

### 1. Verificar se o nvm foi carregado

```bash
echo $NVM_DIR
# Deve mostrar: /Users/seu-usuario/.nvm

# Se vazio, execute:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### 2. Verificar se o Node v20 está instalado

```bash
nvm ls
# Deve listar v20.x.x
```

### 3. Forçar uso do Node v20

```bash
nvm use 20
node --version
```

### 4. Limpar completamente e reinstalar

```bash
cd jira-monitor

# Remover tudo
rm -rf node_modules package-lock.json
rm -rf ~/.npm
rm -rf ~/.electron

# Garantir que está usando Node v20
nvm use 20

# Reinstalar
npm install

# Tentar iniciar
npm start
```

---

## 📚 Documentação Relacionada

- [README.md](./README.md) - Documentação completa
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Outros problemas comuns
- [fix-environment.sh](./fix-environment.sh) - Script de correção automática

---

## 💡 Dica Pro

Adicione um alias ao seu `~/.zshrc` para sempre usar Node v20 ao entrar na pasta do projeto:

```bash
# Adicionar ao ~/.zshrc
alias jira-monitor='cd /caminho/para/jira-monitor && nvm use 20'
```

Depois, basta executar `jira-monitor` no terminal para entrar na pasta e ativar Node v20 automaticamente.

---

**Última atualização**: Janeiro 2026

