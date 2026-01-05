#!/bin/bash

echo "🔧 FIXING JIRA MONITOR ENVIRONMENT"
echo "=================================="
echo ""

# 1. Remover Node do Homebrew
echo "1️⃣  Removendo Node.js do Homebrew..."
brew uninstall --force --ignore-dependencies node 2>/dev/null || echo "   (Node do Homebrew não estava instalado)"

# 2. Limpar caches
echo ""
echo "2️⃣  Limpando caches..."
brew cleanup
rm -rf ~/.npm
rm -rf ~/.electron
rm -rf ~/.cache/electron

# 3. Configurar nvm
echo ""
echo "3️⃣  Configurando nvm..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar Node v20 se não estiver instalado
if ! nvm ls 20 >/dev/null 2>&1; then
  echo "   Instalando Node.js v20..."
  nvm install 20
fi

nvm use 20
nvm alias default 20

echo "   ✅ Node.js $(node --version) ativo"

# 4. Limpar projeto
echo ""
echo "4️⃣  Limpando projeto..."
cd "/Users/gabriel.silva.digisystem/jira monitor"
rm -rf node_modules package-lock.json

# 5. Reinstalar dependências
echo ""
echo "5️⃣  Instalando dependências..."
npm install

# 6. Remover quarentena do macOS
echo ""
echo "6️⃣  Removendo quarentena do Electron..."
xattr -cr node_modules/electron

echo ""
echo "=================================="
echo "✅ AMBIENTE CONFIGURADO COM SUCESSO!"
echo ""
echo "Para iniciar o app, execute:"
echo "  npm start"
echo ""
echo "⚠️  IMPORTANTE: Feche e reabra o terminal se o erro persistir!"


