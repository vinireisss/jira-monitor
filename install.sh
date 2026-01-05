#!/bin/bash

# Script para instalar o Jira Monitor em /Applications

echo "📦 Instalador do Jira Monitor"
echo ""

APP_SOURCE="dist/mac-arm64/Jira Monitor.app"
APP_DEST="/Applications/Jira Monitor.app"

# Verificar se o app foi compilado
if [ ! -d "$APP_SOURCE" ]; then
  echo "❌ Erro: Aplicativo não encontrado em $APP_SOURCE"
  echo "Execute primeiro: npm run build"
  exit 1
fi

# Verificar se já existe uma versão instalada
if [ -d "$APP_DEST" ]; then
  echo "⚠️  Versão anterior encontrada em $APP_DEST"
  read -p "Deseja substituir? (s/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "❌ Instalação cancelada"
    exit 0
  fi
  
  echo "🗑️  Removendo versão anterior..."
  rm -rf "$APP_DEST"
fi

# Copiar o app para /Applications
echo "📂 Copiando para /Applications..."
cp -R "$APP_SOURCE" "$APP_DEST"

# Remover quarentena do macOS
echo "🔓 Removendo restrições do macOS..."
xattr -cr "$APP_DEST"

# Verificar se instalou
if [ -d "$APP_DEST" ]; then
  echo ""
  echo "✅ Jira Monitor instalado com sucesso!"
  echo ""
  echo "Para abrir:"
  echo "  • Via Finder: /Applications/Jira Monitor.app"
  echo "  • Via terminal: open -a 'Jira Monitor'"
  echo ""
  read -p "Deseja abrir agora? (s/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[SsYy]$ ]]; then
    echo "🚀 Abrindo Jira Monitor..."
    open -a "Jira Monitor"
  fi
else
  echo "❌ Erro ao instalar"
  exit 1
fi

