#!/bin/bash

echo "🧹 Iniciando limpeza completa..."

# Matar todos os processos Electron
echo "🔪 Matando processos Electron..."
killall "Electron" 2>/dev/null
killall "jira-monitor" 2>/dev/null
sleep 1

# Limpar TODOS os caches possíveis
echo "🗑️  Limpando caches..."
rm -rf ~/Library/Application\ Support/jira-monitor/
rm -rf ~/Library/Caches/jira-monitor/
rm -rf ~/Library/Preferences/jira-monitor/
rm -rf .cache/
rm -rf dist/

# Limpar cache do npm
echo "📦 Limpando cache do npm..."
npm cache clean --force 2>/dev/null

# Limpar e reinstalar node_modules
echo "♻️  Reconstruindo node_modules..."
rm -rf node_modules/
npm install

echo ""
echo "✅ Limpeza completa!"
echo "🚀 Iniciando aplicação..."
echo ""

npm start

