# 📦 Instalação via Git Clone

## 🚀 Instalação Automática (Recomendado)

Execute este comando único para instalação automática:

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

Ou baixe e execute o script:

```bash
# 1. Baixar o script
curl -O https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh

# 2. Tornar executável
chmod +x install-auto.sh

# 3. Executar
./install-auto.sh
```

**O que o script faz:**
- ✅ Cria automaticamente a pasta `~/dev/nu`
- ✅ Clona o repositório no local correto
- ✅ Verifica e instala Node.js (se necessário)
- ✅ Instala todas as dependências
- ✅ Pergunta se deseja iniciar o app

---

## 📍 Diretório Padrão

**IMPORTANTE**: O projeto será instalado no seguinte caminho:

```
~/dev/nu/jira-monitor
```

Ou seja:
```
/Users/[seu-usuario]/dev/nu/jira-monitor
```

---

## 🔧 Instalação Manual (Passo a Passo)

### 1️⃣ Criar Estrutura de Diretórios

```bash
# Criar o diretório padrão (se não existir)
mkdir -p ~/dev/nu
```

### 2️⃣ Navegar para o Diretório

```bash
cd ~/dev/nu
```

### 3️⃣ Clonar o Repositório

```bash
# Via SSH (recomendado)
git clone git@github.com:gabinubank/jira-monitor.git

# OU via HTTPS
git clone https://github.com/gabinubank/jira-monitor.git
```

### 4️⃣ Entrar no Diretório do Projeto

```bash
cd jira-monitor
```

### 5️⃣ Instalar Node.js (via nvm - Recomendado)

```bash
# Instalar nvm (se ainda não tiver)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Configurar nvm (adicionar ao ~/.zshrc)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Fechar e reabrir o terminal

# Instalar Node 20
nvm install 20
nvm use 20
nvm alias default 20

# Verificar versão
node --version  # Deve mostrar v20.x.x
```

### 6️⃣ Instalar Dependências

```bash
npm install
```

### 7️⃣ Iniciar a Aplicação

```bash
npm start
```

---

## ✅ Verificação da Instalação

Após seguir os passos acima, verifique se está tudo correto:

```bash
# 1. Verificar caminho do projeto
pwd
# Deve mostrar: /Users/[seu-usuario]/dev/nu/jira-monitor

# 2. Verificar Node.js
node --version
# Deve mostrar: v20.x.x

# 3. Verificar se o app inicia
npm start
# O app deve abrir automaticamente
```

---

## 🔄 Atualizações Futuras

Para atualizar o projeto quando houver mudanças:

```bash
cd ~/dev/nu/jira-monitor
git pull
npm install
npm start
```

---

## 📂 Estrutura Final

Após a instalação, sua estrutura de diretórios deve estar assim:

```
/Users/[seu-usuario]/
└── dev/
    └── nu/
        └── jira-monitor/
            ├── main.js
            ├── renderer.js
            ├── package.json
            ├── node_modules/
            └── ... (outros arquivos)
```

---

## ❓ Por que esse caminho específico?

- **Organização**: Mantém todos os projetos Nubank em um local padronizado
- **Scripts**: Alguns scripts podem referenciar esse caminho
- **Convenção**: Segue o padrão de organização de projetos da empresa

---

## 🚨 Troubleshooting

### Erro: "Permission denied (publickey)"

Se você receber esse erro ao clonar via SSH:

```bash
# 1. Verifique se tem chave SSH configurada
ls -la ~/.ssh/

# 2. Se não tiver, gere uma nova
ssh-keygen -t ed25519 -C "seu-email@nubank.com.br"

# 3. Adicione a chave ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 4. Copie a chave pública
cat ~/.ssh/id_ed25519.pub

# 5. Adicione no GitHub: https://github.com/settings/keys
```

### Erro: "command not found: git"

Instale o Git:

```bash
# Via Homebrew
brew install git

# Via Xcode Command Line Tools
xcode-select --install
```

### Erro: "npm: command not found"

Instale o Node.js seguindo o passo 5️⃣ acima (via nvm).

---

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. 📖 Leia o [QUICK_START.md](./QUICK_START.md) para configuração inicial
2. 🎯 Consulte o [GUIA-v1.5.0.md](./GUIA-v1.5.0.md) para guia completo
3. ⚙️ Configure suas credenciais do Jira na primeira execução

---

**Versão**: 1.6.1  
**Última atualização**: Janeiro 2025

