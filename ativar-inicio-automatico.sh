#!/bin/bash

# Script para ativar o início automático do Jira Monitor no macOS

APP_NAME="Jira Monitor"
PLIST_NAME="com.nubank.jiramonitor"
PLIST_FILE="$HOME/Library/LaunchAgents/$PLIST_NAME.plist"
APP_PATH="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Configurando início automático do $APP_NAME..."

# Criar diretório LaunchAgents se não existir
mkdir -p "$HOME/Library/LaunchAgents"

# Criar arquivo .plist
cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PLIST_NAME</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>$APP_PATH/node_modules/.bin/electron</string>
        <string>$APP_PATH</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$HOME/Library/Logs/$PLIST_NAME.log</string>
    <key>StandardErrorPath</key>
    <string>$HOME/Library/Logs/$PLIST_NAME.error.log</string>
    <key>WorkingDirectory</key>
    <string>$APP_PATH</string>
</dict>
</plist>
EOF

# Carregar o Launch Agent
launchctl unload "$PLIST_FILE" 2>/dev/null
launchctl load "$PLIST_FILE"

echo "✅ Início automático ativado com sucesso!"
echo ""
echo "📁 Arquivo criado: $PLIST_FILE"
echo "📝 Logs disponíveis em: $HOME/Library/Logs/"
echo ""
echo "Para desativar, execute: bash desativar-inicio-automatico.sh"

