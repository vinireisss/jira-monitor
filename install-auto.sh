#!/bin/bash

# 🚀 Script de Instalação Automática do Jira Monitor
# Este script clona o projeto no caminho correto e configura tudo automaticamente

set -e  # Parar em caso de erro

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🎫 Jira Monitor - Auto Installer     ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo ""

# Definir caminho padrão
INSTALL_DIR="$HOME/dev/nu"
PROJECT_DIR="$INSTALL_DIR/jira-monitor"

# 1. Verificar se Git está instalado
echo -e "${BLUE}[1/6]${NC} Verificando Git..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não encontrado!${NC}"
    echo -e "${YELLOW}Instale o Git primeiro:${NC}"
    echo "  brew install git"
    echo "  ou"
    echo "  xcode-select --install"
    exit 1
fi
echo -e "${GREEN}✅ Git instalado${NC}"

# 2. Criar diretório de destino
echo ""
echo -e "${BLUE}[2/6]${NC} Criando estrutura de diretórios..."
if [ ! -d "$INSTALL_DIR" ]; then
    mkdir -p "$INSTALL_DIR"
    echo -e "${GREEN}✅ Criado: $INSTALL_DIR${NC}"
else
    echo -e "${GREEN}✅ Diretório já existe: $INSTALL_DIR${NC}"
fi

# 3. Verificar se o projeto já existe
echo ""
echo -e "${BLUE}[3/6]${NC} Verificando projeto existente..."
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Projeto já existe em: $PROJECT_DIR${NC}"
    echo -e "${YELLOW}Deseja atualizar (git pull)? [s/N]${NC}"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        cd "$PROJECT_DIR"
        git pull
        echo -e "${GREEN}✅ Projeto atualizado${NC}"
    else
        echo -e "${YELLOW}⏭️  Pulando clonagem${NC}"
    fi
else
    # 4. Clonar o repositório
    echo -e "${BLUE}[4/6]${NC} Clonando repositório..."
    cd "$INSTALL_DIR"
    
    echo -e "${YELLOW}Escolha o método de clonagem:${NC}"
    echo "  1) SSH (recomendado) - git@github.com:gabinubank/jira-monitor.git"
    echo "  2) HTTPS - https://github.com/gabinubank/jira-monitor.git"
    read -p "Opção [1/2]: " clone_method
    
    if [ "$clone_method" = "2" ]; then
        git clone https://github.com/gabinubank/jira-monitor.git
    else
        git clone git@github.com:gabinubank/jira-monitor.git
    fi
    
    echo -e "${GREEN}✅ Repositório clonado${NC}"
fi

# 5. Verificar Node.js
echo ""
echo -e "${BLUE}[5/6]${NC} Verificando Node.js..."

# Carregar nvm se disponível
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo ""
    echo -e "${YELLOW}Deseja instalar Node.js via nvm? [s/N]${NC}"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        echo -e "${BLUE}Instalando nvm...${NC}"
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        
        echo -e "${BLUE}Instalando Node.js 20...${NC}"
        nvm install 20
        nvm use 20
        nvm alias default 20
        echo -e "${GREEN}✅ Node.js 20 instalado${NC}"
    else
        echo -e "${RED}❌ Node.js é necessário. Abortando.${NC}"
        exit 1
    fi
else
    NODE_VERSION=$(node --version)
    NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d'.' -f1 | sed 's/v//')
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
    
    # Verificar se é versão 20 ou superior
    if [ "$NODE_MAJOR_VERSION" -lt 20 ]; then
        echo -e "${RED}❌ Node.js v20+ é necessário!${NC}"
        echo -e "${RED}Versão atual: $NODE_VERSION (muito antiga)${NC}"
        echo ""
        echo -e "${YELLOW}Deseja instalar Node.js v20 via nvm? [s/N]${NC}"
        read -r response
        if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
            # Verificar se nvm está disponível
            if command -v nvm &> /dev/null; then
                nvm install 20
                nvm use 20
                nvm alias default 20
                echo -e "${GREEN}✅ Node.js 20 instalado e ativado${NC}"
            else
                echo -e "${YELLOW}⚠️  nvm não encontrado. Instalando nvm primeiro...${NC}"
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                nvm install 20
                nvm use 20
                nvm alias default 20
                echo -e "${GREEN}✅ nvm e Node.js 20 instalados${NC}"
            fi
        else
            echo -e "${RED}❌ Node.js v20+ é obrigatório. Abortando.${NC}"
            exit 1
        fi
    elif [ "$NODE_MAJOR_VERSION" -ge 20 ]; then
        echo -e "${GREEN}✅ Versão do Node compatível (v20+)${NC}"
        if [ "$NODE_MAJOR_VERSION" -gt 20 ]; then
            echo -e "${BLUE}ℹ️  Você tem Node.js v$NODE_MAJOR_VERSION (mais recente que v20)${NC}"
            echo -e "${BLUE}ℹ️  Isso é compatível e funcionará perfeitamente!${NC}"
        fi
    fi
fi

# 6. Instalar dependências
echo ""
echo -e "${BLUE}[6/6]${NC} Instalando dependências..."
cd "$PROJECT_DIR"

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules já existe${NC}"
    echo -e "${YELLOW}Deseja reinstalar? [s/N]${NC}"
    read -r response
    if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
        rm -rf node_modules package-lock.json
        npm install
        echo -e "${GREEN}✅ Dependências reinstaladas${NC}"
    else
        echo -e "${YELLOW}⏭️  Pulando instalação de dependências${NC}"
    fi
else
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
fi

# Finalização
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅ Instalação Concluída com Sucesso!  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📂 Projeto instalado em:${NC}"
echo -e "   ${GREEN}$PROJECT_DIR${NC}"
echo ""
echo -e "${BLUE}🚀 Para iniciar o Jira Monitor:${NC}"
echo -e "   ${YELLOW}cd $PROJECT_DIR${NC}"
echo -e "   ${YELLOW}npm start${NC}"
echo ""
echo -e "${BLUE}📖 Próximos passos:${NC}"
echo -e "   1. Configure suas credenciais do Jira na primeira execução"
echo -e "   2. Leia o QUICK_START.md para mais informações"
echo ""

# Perguntar se deseja iniciar agora
echo -e "${YELLOW}Deseja iniciar o Jira Monitor agora? [s/N]${NC}"
read -r response
if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
    echo -e "${BLUE}🚀 Iniciando...${NC}"
    npm start
fi

