#!/bin/bash

# Script para iniciar o Jira Monitor com Node v20 via nvm
# Isolando completamente do Homebrew para evitar conflitos

echo "🚀 Iniciando Jira Monitor..."

# Limpar TODAS as variáveis que podem interferir
unset npm_config_prefix
unset NPM_CONFIG_PREFIX
unset NODE_PATH
unset NODE_ENV

# Carregar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Usar Node v20
nvm use 20 > /dev/null 2>&1

# Obter o caminho correto do Node do nvm
NVM_NODE_PATH=$(nvm which 20)
NVM_BIN_DIR=$(dirname "$NVM_NODE_PATH")

# FORÇAR o PATH para usar APENAS o Node do nvm
export PATH="$NVM_BIN_DIR:$PATH"

# Verificar versão do Node
NODE_VERSION=$(node --version)
echo "📦 Node.js: $NODE_VERSION ($(which node))"

# Verificar se é v20
if [[ ! "$NODE_VERSION" =~ ^v20\. ]]; then
  echo "❌ ERRO: Node.js v20 não está ativo!"
  echo "❌ Caminho atual do node: $(which node)"
  exit 1
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
