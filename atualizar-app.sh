#!/bin/bash

###############################################################################
# 🔄 SCRIPT DE ATUALIZAÇÃO AUTOMÁTICA - JIRA MONITOR
# 
# Este script atualiza o Jira Monitor automaticamente, salvando suas 
# configurações e aplicando as correções mais recentes.
#
# USO: ./atualizar-app.sh
###############################################################################

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo ""
echo -e "${PURPLE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                        ║${NC}"
echo -e "${PURPLE}║       🔄 ATUALIZADOR AUTOMÁTICO - JIRA MONITOR        ║${NC}"
echo -e "${PURPLE}║                                                        ║${NC}"
echo -e "${PURPLE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função para mostrar erro e sair
error_exit() {
    echo -e "${RED}❌ ERRO: $1${NC}"
    echo ""
    exit 1
}

# Função para mostrar sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função para mostrar info
info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Função para mostrar aviso
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função para perguntar sim/não
ask_yes_no() {
    while true; do
        read -p "$1 (s/n): " yn
        case $yn in
            [Ss]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Por favor, responda s (sim) ou n (não).";;
        esac
    done
}

###############################################################################
# PASSO 1: Verificações iniciais
###############################################################################

echo -e "${BLUE}[1/7] Verificando ambiente...${NC}"
echo ""

# Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
    error_exit "Você não está na pasta do Jira Monitor. Execute: cd ~/dev/nu/jira-monitor"
fi

# Verificar se é um repositório git
if [ ! -d ".git" ]; then
    error_exit "Esta pasta não é um repositório Git. Reinstale usando 'git clone'."
fi

success "Pasta correta encontrada"
echo ""

###############################################################################
# PASSO 2: Fechar app se estiver rodando
###############################################################################

echo -e "${BLUE}[2/7] Fechando Jira Monitor...${NC}"
echo ""

# Verificar se o Electron está rodando
if pgrep -x "Electron" > /dev/null; then
    info "App está rodando. Fechando..."
    pkill -9 Electron 2>/dev/null
    sleep 2
    success "App fechado"
else
    info "App já estava fechado"
fi
echo ""

###############################################################################
# PASSO 3: Verificar branch atual
###############################################################################

echo -e "${BLUE}[3/7] Verificando branch...${NC}"
echo ""

CURRENT_BRANCH=$(git branch --show-current)
info "Branch atual: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    warning "Você está na branch '$CURRENT_BRANCH', não na 'main'"
    
    if ask_yes_no "Deseja mudar para a branch 'main'?"; then
        git checkout main || error_exit "Falha ao mudar para branch main"
        success "Mudado para branch main"
    else
        warning "Continuando na branch '$CURRENT_BRANCH'"
    fi
fi
echo ""

###############################################################################
# PASSO 4: Verificar mudanças locais
###############################################################################

echo -e "${BLUE}[4/7] Verificando mudanças locais...${NC}"
echo ""

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    warning "Você tem mudanças não salvas:"
    echo ""
    git status --short
    echo ""
    
    if ask_yes_no "Deseja salvar temporariamente suas mudanças?"; then
        git stash push -m "Auto-stash antes da atualização em $(date)"
        success "Mudanças salvas temporariamente"
        STASHED=true
    else
        warning "Suas mudanças locais podem causar conflitos"
        
        if ask_yes_no "Deseja DESCARTAR suas mudanças e continuar?"; then
            git reset --hard HEAD
            success "Mudanças descartadas"
            STASHED=false
        else
            info "Atualização cancelada pelo usuário"
            exit 0
        fi
    fi
else
    success "Nenhuma mudança local encontrada"
    STASHED=false
fi
echo ""

###############################################################################
# PASSO 5: Buscar atualizações
###############################################################################

echo -e "${BLUE}[5/7] Buscando atualizações do servidor...${NC}"
echo ""

# Buscar informações do remoto
git fetch origin || error_exit "Falha ao buscar atualizações do servidor"

# Verificar se há atualizações disponíveis
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
BASE=$(git merge-base @ @{u} 2>/dev/null || echo "")

if [ -z "$REMOTE" ]; then
    warning "Não foi possível verificar atualizações remotas"
elif [ "$LOCAL" = "$REMOTE" ]; then
    success "Você já está na versão mais recente!"
    
    if [ "$STASHED" = true ]; then
        info "Restaurando suas mudanças..."
        git stash pop
    fi
    
    echo ""
    echo -e "${GREEN}✨ Nenhuma atualização necessária!${NC}"
    echo ""
    exit 0
elif [ "$LOCAL" = "$BASE" ]; then
    info "Atualizações disponíveis no servidor"
elif [ "$REMOTE" = "$BASE" ]; then
    warning "Sua versão local está à frente do servidor"
else
    warning "Sua versão divergiu do servidor"
fi

echo ""

###############################################################################
# PASSO 6: Aplicar atualizações
###############################################################################

echo -e "${BLUE}[6/7] Aplicando atualizações...${NC}"
echo ""

# Fazer pull
if git pull origin main; then
    success "Atualizações aplicadas com sucesso!"
    
    # Mostrar o que mudou
    echo ""
    info "📋 Arquivos atualizados:"
    git diff --name-status HEAD@{1} HEAD | head -10
    echo ""
    
else
    error_exit "Falha ao aplicar atualizações. Execute manualmente: git pull origin main"
fi

###############################################################################
# PASSO 7: Restaurar mudanças locais (se necessário)
###############################################################################

if [ "$STASHED" = true ]; then
    echo -e "${BLUE}[7/7] Restaurando suas mudanças...${NC}"
    echo ""
    
    if git stash pop; then
        success "Mudanças restauradas com sucesso"
    else
        warning "Houve conflitos ao restaurar suas mudanças"
        info "Suas mudanças ainda estão salvas em 'git stash'"
        info "Execute 'git stash list' para ver"
    fi
    echo ""
fi

###############################################################################
# FINALIZAÇÃO
###############################################################################

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║            ✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!      ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

info "📊 Versão atual:"
git log --oneline -1
echo ""

echo -e "${CYAN}🚀 Próximos passos:${NC}"
echo ""
echo "   1. Inicie o app:"
echo -e "      ${YELLOW}npm start${NC}"
echo ""
echo "   2. Aguarde 60 segundos para ver os logs"
echo ""
echo "   3. Para testar as correções, abra DevTools (Cmd+Option+I) e execute:"
echo -e "      ${YELLOW}debugCustomCounters()${NC}"
echo ""
echo "   4. Leia o guia de uso:"
echo -e "      ${YELLOW}cat INSTRUCOES-RAPIDAS-CONTADORES.md${NC}"
echo ""

# Perguntar se quer iniciar o app
if ask_yes_no "Deseja iniciar o Jira Monitor agora?"; then
    echo ""
    info "Iniciando Jira Monitor..."
    echo ""
    npm start
else
    echo ""
    info "Para iniciar o app mais tarde, execute: npm start"
    echo ""
fi

exit 0
