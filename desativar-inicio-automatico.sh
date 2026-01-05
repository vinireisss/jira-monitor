#!/bin/bash

# Script para desativar o início automático do Jira Monitor no macOS

APP_NAME="Jira Monitor"
PLIST_NAME="com.nubank.jiramonitor"
PLIST_FILE="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"

echo "🛑 Desativando início automático do $APP_NAME..."

# Verificar se o arquivo existe
if [ ! -f "$PLIST_FILE" ]; then
    echo "⚠️  Arquivo $PLIST_FILE não encontrado."
    echo "O início automático já está desativado ou nunca foi ativado."
    exit 1
fi

# Descarregar o Launch Agent
launchctl unload "$PLIST_FILE" 2>/dev/null

# Remover o arquivo .plist
rm "$PLIST_FILE"

echo "✅ Início automático desativado com sucesso!"
echo ""
echo "Para reativar, execute: bash ativar-inicio-automatico.sh"

