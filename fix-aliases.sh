#!/bin/bash

# 🔧 Script para corrigir aliases que não estão funcionando
# Execute este script se os aliases (j, jira-update, etc.) não funcionarem

echo "🔧 Correção de Aliases - Jira Monitor"
echo "======================================"
echo ""

# Detectar qual shell está sendo usado
SHELL_NAME=$(basename "$SHELL")
echo "📍 Shell detectado: $SHELL_NAME"
echo ""

# Determinar arquivo de configuração
if [ "$SHELL_NAME" = "zsh" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
    RELOAD_CMD="source ~/.zshrc"
elif [ "$SHELL_NAME" = "bash" ]; then
    if [ -f "$HOME/.bash_profile" ]; then
        SHELL_CONFIG="$HOME/.bash_profile"
        RELOAD_CMD="source ~/.bash_profile"
    else
        SHELL_CONFIG="$HOME/.bashrc"
        RELOAD_CMD="source ~/.bashrc"
    fi
else
    SHELL_CONFIG="$HOME/.profile"
    RELOAD_CMD="source ~/.profile"
fi

echo "📝 Arquivo de configuração: $SHELL_CONFIG"
echo ""

# Verificar se aliases já existem
if grep -q "# 🎯 Jira Monitor - Comandos Rápidos" "$SHELL_CONFIG" 2>/dev/null; then
    echo "✅ Aliases já estão no arquivo!"
    echo ""
    echo "💡 Se não estão funcionando, rode:"
    echo "   $RELOAD_CMD"
    echo ""
    echo "Ou feche e reabra o terminal."
else
    echo "⚠️  Aliases não encontrados. Instalando..."
    bash "$(dirname "$0")/install-aliases.sh"
fi

echo ""
echo "🧪 Testando aliases..."
echo ""

# Testar se o arquivo está sendo carregado
if [ -f "$SHELL_CONFIG" ]; then
    # Source temporário para testar
    source "$SHELL_CONFIG" 2>/dev/null || true
    
    if type j &>/dev/null; then
        echo "✅ Alias 'j' encontrado!"
    else
        echo "❌ Alias 'j' NÃO encontrado"
        echo ""
        echo "🔧 SOLUÇÃO:"
        echo "   1. Rode: $RELOAD_CMD"
        echo "   2. Ou feche e reabra o terminal"
        echo "   3. Teste novamente digitando: j"
    fi
fi

echo ""
echo "📋 Aliases disponíveis:"
echo "   j              - Abre o Jira Monitor (atalho rápido!)"
echo "   jira-monitor   - Abre o Jira Monitor"
echo "   jira-update    - Atualiza (git pull + npm install)"
echo "   jira-restart   - Reinicia o app"
echo "   jira-status    - Ver status do Git"
echo "   jira-log       - Ver últimos 10 commits"
echo ""
echo "🎯 PRÓXIMO PASSO:"
echo "   $RELOAD_CMD"
echo ""
