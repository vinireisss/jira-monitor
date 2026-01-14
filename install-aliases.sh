#!/bin/bash

# 🚀 Script de Instalação de Aliases - Jira Monitor
# Funciona em qualquer terminal: macOS, Cursor, bash, zsh

echo "🚀 Instalando aliases do Jira Monitor..."
echo ""

# Detectar qual shell está sendo usado
SHELL_NAME=$(basename "$SHELL")
echo "📍 Shell detectado: $SHELL_NAME"
echo ""

# Aliases a serem instalados
ALIASES='
# 🎯 Jira Monitor - Comandos Rápidos
alias j="cd ~/dev/nu/jira-monitor && npm start > /dev/null 2>&1 &"
alias jira-monitor="cd ~/dev/nu/jira-monitor && npm start > /dev/null 2>&1 &"
alias jira-update="cd ~/dev/nu/jira-monitor && git pull origin main && npm install"
alias jira-restart="cd ~/dev/nu/jira-monitor && pkill -9 -f '\''electron.*jira-monitor'\'' 2>/dev/null; sleep 1; pkill -9 Electron 2>/dev/null; sleep 0.5; npm start > /dev/null 2>&1 &"
alias jira-status="cd ~/dev/nu/jira-monitor && git status"
alias jira-log="cd ~/dev/nu/jira-monitor && git log --oneline -10"
'

# Função para adicionar aliases a um arquivo
add_aliases() {
    local file=$1
    
    if [ -f "$file" ]; then
        # Verificar se já existe
        if grep -q "# 🎯 Jira Monitor - Comandos Rápidos" "$file"; then
            echo "⚠️  Aliases já existem em $file"
        else
            echo "$ALIASES" >> "$file"
            echo "✅ Aliases adicionados em $file"
        fi
    else
        echo "$ALIASES" >> "$file"
        echo "✅ Arquivo $file criado com aliases"
    fi
}

# Adicionar aos arquivos de configuração do Zsh
if [ "$SHELL_NAME" = "zsh" ] || [ -f "$HOME/.zshrc" ]; then
    add_aliases "$HOME/.zshrc"
fi

# Adicionar aos arquivos de configuração do Bash
if [ "$SHELL_NAME" = "bash" ] || [ -f "$HOME/.bashrc" ]; then
    add_aliases "$HOME/.bashrc"
fi

if [ "$SHELL_NAME" = "bash" ] || [ -f "$HOME/.bash_profile" ]; then
    add_aliases "$HOME/.bash_profile"
fi

# Adicionar ao profile genérico
add_aliases "$HOME/.profile"

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "📝 Para ativar os aliases AGORA, rode um destes comandos:"
echo ""

if [ "$SHELL_NAME" = "zsh" ]; then
    echo "   source ~/.zshrc"
elif [ "$SHELL_NAME" = "bash" ]; then
    echo "   source ~/.bashrc"
    echo "   source ~/.bash_profile"
else
    echo "   source ~/.profile"
fi

echo ""
echo "Ou simplesmente feche e reabra o terminal."
echo ""
echo "⚡ Aliases disponíveis:"
echo "   j              - Abre o Jira Monitor (atalho rápido!)"
echo "   jira-monitor   - Abre o Jira Monitor"
echo "   jira-update    - Atualiza (git pull + npm install)"
echo "   jira-restart   - Reinicia o app"
echo "   jira-status    - Ver status do Git"
echo "   jira-log       - Ver últimos 10 commits"
echo ""
echo "🎯 Teste agora: digite 'j' depois de recarregar!"
