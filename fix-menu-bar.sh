#!/bin/bash

# 🔧 Script de Fix para Menu Bar Invisível
# Resolve problemas de ícone não aparecendo ou não clicável

echo "🔧 Fix: Menu Bar Jira Monitor"
echo "=============================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na pasta raiz do projeto${NC}"
    echo "   cd \"path/to/jira monitor\""
    exit 1
fi

echo -e "${YELLOW}📍 Passo 1: Matando processos Electron existentes...${NC}"
pkill -9 -f "electron.*jira" 2>/dev/null
sleep 2
echo -e "${GREEN}✅ Processos finalizados${NC}"
echo ""

echo -e "${YELLOW}📍 Passo 2: Verificando arquivos necessários...${NC}"
if [ ! -f "tray-manager.js" ]; then
    echo -e "${RED}❌ Arquivo tray-manager.js não encontrado${NC}"
    echo "   Rode: git pull"
    exit 1
fi
echo -e "${GREEN}✅ tray-manager.js encontrado${NC}"
echo ""

echo -e "${YELLOW}📍 Passo 3: Reinstalando dependências...${NC}"
echo "   (Isso pode demorar um pouco)"
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""

echo -e "${YELLOW}📍 Passo 4: Verificando permissões do macOS...${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Você precisa dar permissões manualmente${NC}"
echo ""
echo "   1. Abra: Configurações do Sistema > Privacidade e Segurança"
echo "   2. Vá em: Screen Recording (Gravação de Tela)"
echo "   3. Adicione: Electron (marque o checkbox)"
echo "   4. Vá em: Accessibility (Acessibilidade)"
echo "   5. Adicione: Electron (marque o checkbox)"
echo ""
echo -e "${YELLOW}Deseja abrir as Configurações do Sistema agora? (s/n)${NC}"
read -r resposta
if [[ "$resposta" =~ ^[Ss]$ ]]; then
    open "x-apple.systempreferences:com.apple.preference.security?Privacy"
    echo ""
    echo -e "${GREEN}✅ Configurações abertas${NC}"
    echo -e "${YELLOW}⏳ Aguarde 10 segundos para você configurar...${NC}"
    sleep 10
fi
echo ""

echo -e "${YELLOW}📍 Passo 5: Iniciando Jira Monitor...${NC}"
echo ""
./node_modules/.bin/electron . &
ELECTRON_PID=$!
sleep 3

# Verificar se o processo está rodando
if ps -p $ELECTRON_PID > /dev/null; then
    echo -e "${GREEN}✅ Jira Monitor iniciado com sucesso!${NC}"
    echo ""
    echo "🎯 Teste agora:"
    echo "   1. Olhe no canto superior direito da tela"
    echo "   2. Procure pelo ícone do Jira Monitor"
    echo "   3. Clique no ícone"
    echo "   4. Tire um screenshot (Cmd+Shift+4)"
    echo ""
    echo -e "${GREEN}✨ Se o ícone aparecer e for clicável, está resolvido!${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar o Electron${NC}"
    echo "   Rode manualmente com:"
    echo "   ./node_modules/.bin/electron . 2>&1 | tee error.log"
    exit 1
fi
