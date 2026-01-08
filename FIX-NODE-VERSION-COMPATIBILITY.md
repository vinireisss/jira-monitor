# 🔧 Fix: Compatibilidade de Versões do Node.js

## Problema

Ao tentar instalar o Jira Monitor, você pode encontrar este erro:

```
📦 Node.js: v25.1.0 (/opt/homebrew/bin/node)
❌ ERRO: Node.js v20 não está ativo!
```

## Causa

O Jira Monitor agora é **compatível com Node.js v20+** (v20, v22, v25, etc.), mas o script antigo exigia especificamente v20.

## ✅ Solução Aplicada

O problema foi corrigido! Agora o Jira Monitor:

1. **Aceita Node.js v20+** (incluindo v22, v25, v26, etc.)
2. **Funciona com ou sem nvm** (Node Version Manager)
3. **Detecta automaticamente** a melhor versão disponível

## 🚀 Como Instalar Agora

### Opção 1: Instalação Automática (Recomendada)

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

O script agora:
- ✅ Aceita Node.js v20 ou superior
- ✅ Funciona com Node.js instalado via Homebrew
- ✅ Funciona com Node.js instalado via nvm
- ✅ Instala nvm automaticamente se necessário

### Opção 2: Instalação Manual

Se você já tem Node.js v20+ instalado:

```bash
# Clonar o repositório
git clone https://github.com/gabinubank/jira-monitor.git
cd jira-monitor

# Instalar dependências
npm install

# Iniciar
npm start
```

## 🔍 Verificar sua Versão do Node.js

```bash
node --version
```

**Versões Compatíveis:**
- ✅ v20.x.x
- ✅ v22.x.x
- ✅ v25.x.x
- ✅ v26.x.x ou superior
- ❌ v18.x.x ou inferior (muito antiga)

## 📝 Cenários Comuns

### Cenário 1: Node.js via Homebrew (v25+)

Se você tem Node.js instalado via Homebrew:

```bash
# Verificar versão
node --version  # v25.1.0 ou superior

# Instalar diretamente
cd ~/dev/nu
git clone https://github.com/gabinubank/jira-monitor.git
cd jira-monitor
npm install
npm start
```

**✅ Funciona perfeitamente!** Não é necessário instalar nvm.

### Cenário 2: Preferindo Node.js v20 (via nvm)

Se você prefere usar especificamente v20:

```bash
# Instalar nvm (se não tiver)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Fechar e reabrir o terminal, depois:
nvm install 20
nvm use 20
nvm alias default 20

# Agora instalar o Jira Monitor
cd ~/dev/nu
git clone https://github.com/gabinubank/jira-monitor.git
cd jira-monitor
npm install
npm start
```

### Cenário 3: Atualizar Instalação Existente

Se você já tem o Jira Monitor instalado com o script antigo:

```bash
cd ~/dev/nu/jira-monitor

# Atualizar o código
git pull

# Reinstalar dependências (opcional, mas recomendado)
rm -rf node_modules package-lock.json
npm install

# Iniciar normalmente
npm start
```

## 🆘 Ainda com Problemas?

### Erro: "nvm: command not found"

**Este erro NÃO é mais um problema!** O novo script funciona sem nvm.

Se você quer usar nvm de qualquer forma:

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Adicionar ao seu shell (escolha o seu)
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc

# Recarregar
source ~/.zshrc

# Instalar Node.js v20
nvm install 20
nvm use 20
nvm alias default 20
```

### Erro: "Node.js não encontrado"

Instale Node.js via Homebrew:

```bash
# macOS
brew install node

# Ou, se preferir v20 especificamente
brew install node@20
```

### Erro de Permissões

```bash
# Se npm install falhar com erros de permissão
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

## 📊 Tabela de Compatibilidade

| Versão Node.js | Status | Observações |
|----------------|--------|-------------|
| v16.x ou anterior | ❌ Não suportado | Muito antiga |
| v18.x | ❌ Não suportado | Electron requer v20+ |
| v20.x | ✅ Recomendado | Versão oficial suportada |
| v22.x | ✅ Compatível | LTS recente |
| v25.x | ✅ Compatível | Versão atual |
| v26.x+ | ✅ Compatível | Futuras versões |

## 🎯 Resumo para seu Chefe

**Problema Resolvido!**

O erro aconteceu porque o script antigo exigia exatamente Node.js v20, mas seu chefe tem v25 instalado.

**Agora está corrigido:**
- ✅ Aceita Node.js v20 ou superior (incluindo v25)
- ✅ Funciona com Node.js do Homebrew
- ✅ Não precisa mais instalar nvm obrigatoriamente

**Para instalar agora:**

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

Ou simplesmente:

```bash
cd ~/dev/nu
git clone https://github.com/gabinubank/jira-monitor.git
cd jira-monitor
npm install
npm start
```

**Pronto!** 🎉

## 📞 Suporte

Se ainda tiver problemas:
1. Verifique o [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Abra uma issue no GitHub
3. Entre em contato com a equipe:
   - **Slack**: @GABS SILVA | @ya (Yanka Dantas)

---

**Última atualização:** Janeiro 2026  
**Versão do Jira Monitor:** v1.6.1+
