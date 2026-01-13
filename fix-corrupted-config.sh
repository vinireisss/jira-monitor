#!/bin/bash

# 🔧 Script para corrigir arquivo de configuração corrompido do Jira Monitor
# Execute este script se você receber erro "is not valid JSON"

echo "🔧 Jira Monitor - Correção de Configuração Corrompida"
echo "=================================================="
echo ""

# Detectar o diretório de configuração do Electron
CONFIG_DIR="$HOME/Library/Application Support/jira-monitor"

if [ ! -d "$CONFIG_DIR" ]; then
  echo "❌ Diretório de configuração não encontrado: $CONFIG_DIR"
  exit 1
fi

echo "📁 Diretório de configuração: $CONFIG_DIR"
echo ""

# Fazer backup do arquivo corrompido
if [ -f "$CONFIG_DIR/config.json" ]; then
  BACKUP_FILE="$CONFIG_DIR/config.json.corrupted.backup.$(date +%Y%m%d_%H%M%S)"
  echo "📦 Fazendo backup do arquivo corrompido..."
  cp "$CONFIG_DIR/config.json" "$BACKUP_FILE"
  echo "✅ Backup salvo em: $BACKUP_FILE"
  echo ""
fi

# Remover arquivo corrompido
echo "🗑️  Removendo arquivo corrompido..."
rm -f "$CONFIG_DIR/config.json"

# Verificar se foi removido
if [ ! -f "$CONFIG_DIR/config.json" ]; then
  echo "✅ Arquivo corrompido removido com sucesso!"
  echo ""
  echo "🎉 Pronto! Agora você pode executar o Jira Monitor novamente."
  echo "   O app criará um novo arquivo de configuração limpo."
  echo ""
  echo "💡 Para iniciar o app:"
  echo "   cd ~/dev/nu/jira-monitor && npm start"
else
  echo "❌ Erro ao remover arquivo. Tente manualmente:"
  echo "   rm \"$CONFIG_DIR/config.json\""
  exit 1
fi
