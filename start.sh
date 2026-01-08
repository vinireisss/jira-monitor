#!/bin/bash

# Script para iniciar o Jira Monitor
# Suporta Node.js v20+ (v20, v22, v25, etc.)

echo "🚀 Iniciando Jira Monitor..."

# Limpar variáveis que podem interferir
unset npm_config_prefix
unset NPM_CONFIG_PREFIX
unset NODE_PATH
unset NODE_ENV

# Tentar carregar nvm (se disponível)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh"
  
  # Se nvm está disponível E temos Node v20, usar ele
  if command -v nvm &> /dev/null && nvm ls 20 &> /dev/null; then
    nvm use 20 > /dev/null 2>&1
    NVM_NODE_PATH=$(nvm which 20)
    NVM_BIN_DIR=$(dirname "$NVM_NODE_PATH")
    export PATH="$NVM_BIN_DIR:$PATH"
    echo "✅ Usando Node.js v20 via nvm"
  fi
fi

# Verificar se Node.js está disponível
if ! command -v node &> /dev/null; then
  echo "❌ ERRO: Node.js não encontrado!"
  echo ""
  echo "📝 Por favor, instale Node.js:"
  echo "   • Via nvm (recomendado): https://github.com/nvm-sh/nvm"
  echo "   • Via Homebrew: brew install node@20"
  echo "   • Site oficial: https://nodejs.org"
  exit 1
fi

# Verificar versão do Node
NODE_VERSION=$(node --version)
NODE_MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d'.' -f1 | sed 's/v//')

echo "📦 Node.js: $NODE_VERSION ($(which node))"

# Verificar se é v20 ou superior
if [ "$NODE_MAJOR_VERSION" -lt 20 ]; then
  echo "❌ ERRO: Node.js v20+ é necessário!"
  echo "❌ Versão atual: $NODE_VERSION"
  echo ""
  echo "📝 Atualize o Node.js para v20 ou superior"
  exit 1
else
  echo "✅ Versão do Node compatível (v20+)"
fi

# Obter o caminho completo do Electron
ELECTRON_PATH="$(pwd)/node_modules/.bin/electron"

if [ ! -f "$ELECTRON_PATH" ]; then
  echo "❌ ERRO: Electron não encontrado em $ELECTRON_PATH"
  echo "❌ Execute: npm install"
  exit 1
fi

# Iniciar Electron com PATH isolado
echo "⚡ Iniciando Electron..."
echo "📍 Electron: $ELECTRON_PATH"

# Executar Electron (sem env -i que pode quebrar o Electron)
exec "$ELECTRON_PATH" "$(pwd)"
