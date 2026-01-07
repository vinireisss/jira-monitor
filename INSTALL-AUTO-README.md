# 🤖 Script de Instalação Automática

## 📝 Sobre

O `install-auto.sh` é um script inteligente que automatiza completamente a instalação do Jira Monitor, criando a estrutura de diretórios correta e configurando tudo necessário.

---

## 🚀 Como Usar

### Opção 1: Execução Direta (One-liner)

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

### Opção 2: Download e Execução

```bash
# Baixar
curl -O https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh

# Tornar executável
chmod +x install-auto.sh

# Executar
./install-auto.sh
```

### Opção 3: Se já clonou o repositório

```bash
cd jira-monitor
./install-auto.sh
```

---

## ✨ O que o Script Faz

### 1. Verifica Git
- Checa se o Git está instalado
- Sugere instalação caso não encontre

### 2. Cria Estrutura de Diretórios
- Cria automaticamente `~/dev/nu`
- Garante que o caminho padrão exista

### 3. Clona/Atualiza o Repositório
- Clona o projeto em `~/dev/nu/jira-monitor`
- Se já existir, oferece opção de atualizar (git pull)
- Permite escolher entre SSH ou HTTPS

### 4. Verifica Node.js
- Detecta se Node.js está instalado
- Verifica a versão (recomenda v20)
- Oferece instalar via nvm se necessário
- Configura nvm automaticamente

### 5. Instala Dependências
- Executa `npm install`
- Detecta se já existem node_modules
- Oferece opção de reinstalar

### 6. Inicialização Opcional
- Pergunta se deseja iniciar o app imediatamente
- Inicia com `npm start` se confirmado

---

## 🎯 Decisões Interativas

O script é inteligente e pergunta quando necessário:

### "Projeto já existe. Deseja atualizar?"
- **Sim**: Executa `git pull` para atualizar
- **Não**: Pula a clonagem

### "Escolha o método de clonagem"
- **1 (SSH)**: `git@github.com:gabinubank/jira-monitor.git`
- **2 (HTTPS)**: `https://github.com/gabinubank/jira-monitor.git`

### "Deseja instalar Node.js via nvm?"
- **Sim**: Instala nvm e Node.js v20
- **Não**: Aborta (Node.js é obrigatório)

### "Versão do Node não é v20. Instalar v20?"
- **Sim**: Instala Node.js v20 via nvm
- **Não**: Continua com versão atual

### "node_modules já existe. Reinstalar?"
- **Sim**: Remove e reinstala dependências
- **Não**: Pula instalação

### "Deseja iniciar o Jira Monitor agora?"
- **Sim**: Executa `npm start`
- **Não**: Apenas mostra instruções

---

## 📂 Estrutura Criada

Após executar o script, você terá:

```
~/dev/nu/jira-monitor/
├── main.js
├── renderer.js
├── package.json
├── node_modules/        (dependências instaladas)
├── install-auto.sh      (este script)
├── README.md
└── ... (outros arquivos)
```

---

## ✅ Verificações de Segurança

O script:
- ✅ Para em caso de erro (`set -e`)
- ✅ Verifica pré-requisitos antes de continuar
- ✅ Não sobrescreve dados sem perguntar
- ✅ Mostra feedback colorido em cada etapa
- ✅ Oferece opções em vez de forçar decisões

---

## 🔄 Atualizações

Para atualizar um projeto já instalado:

```bash
cd ~/dev/nu/jira-monitor
./install-auto.sh
```

O script detectará que já existe e oferecerá fazer `git pull`.

---

## 🐛 Troubleshooting

### "git: command not found"
Instale o Git:
```bash
brew install git
# ou
xcode-select --install
```

### "Permission denied"
Torne o script executável:
```bash
chmod +x install-auto.sh
```

### Script trava ou falha
Execute passo a passo para identificar o problema:
```bash
bash -x install-auto.sh
```

### Problema com SSH
Se falhar ao clonar via SSH, use HTTPS:
- Escolha opção **2** quando o script perguntar
- Ou clone manualmente:
```bash
cd ~/dev/nu
git clone https://github.com/gabinubank/jira-monitor.git
```

---

## 💡 Dicas

### Executar sem interação (modo não-interativo)
Ainda não suportado, mas você pode usar a instalação manual:
```bash
mkdir -p ~/dev/nu && cd ~/dev/nu
git clone git@github.com:gabinubank/jira-monitor.git
cd jira-monitor
npm install
npm start
```

### Customizar caminho de instalação
Edite o script e mude a variável:
```bash
INSTALL_DIR="$HOME/dev/nu"  # ← mudar aqui
```

### Ver logs detalhados
Execute com modo debug:
```bash
bash -x install-auto.sh
```

---

## 🔧 Tecnologias

- **Bash**: Script shell compatível com macOS/Linux
- **Git**: Clonagem do repositório
- **nvm**: Gerenciador de versões do Node.js
- **npm**: Instalador de dependências

---

## 📝 Contribuindo

Para melhorar o script:
1. Edite `install-auto.sh`
2. Teste em uma máquina limpa
3. Commit e push

---

## 📚 Veja Também

- [README.md](./README.md) - Documentação principal
- [INSTALACAO-GIT.md](./INSTALACAO-GIT.md) - Guia de instalação manual
- [QUICK_START.md](./QUICK_START.md) - Início rápido

---

**Versão do Script**: 1.0.0  
**Última atualização**: Janeiro 2026

