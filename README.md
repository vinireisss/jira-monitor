# 🎫 Jira Monitor

> **Monitor em tempo real de tickets Jira com alertas de SLA e cores inteligentes**

![Electron](https://img.shields.io/badge/Electron-25+-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey)

---

## 📋 Sobre

**Jira Monitor** é uma aplicação desktop desenvolvida em Electron para monitorar tickets do Jira em tempo real, com foco em:

- 🎨 **SLA Colors**: Visualização por cores do status dos tickets (verde/amarelo/vermelho)
- 🔔 **Notificações**: Alertas de desktop quando tickets mudam de status ou SLA
- ⚡ **Performance**: Otimizado para **baixo consumo de CPU e memória**
- 📊 **Dashboard**: Estatísticas em tempo real de todos os seus tickets
- 🎯 **Modo Pro**: Interface avançada com mais recursos

---

## ✨ Funcionalidades

### 🎨 SLA Colors (Visual)
- 🟢 **Verde**: Mais de 3h até vencer SLA
- 🟡 **Amarelo**: Entre 1h e 3h até vencer SLA
- 🔴 **Vermelho (Critical)**: Menos de 1h até vencer SLA
- 🔴 **Vermelho (Overdue)**: SLA estourado

### 🔔 Notificações Inteligentes
- ✅ Notificação quando ticket muda de status
- ✅ Alerta quando SLA entra em zona crítica
- ✅ Notificação quando SLA estoura
- ✅ In-app notifications + Desktop notifications

### ⚡ Otimizações de Performance
- ✅ **Economia de memória**: Até 80% menos RAM (com muitos tickets)
- ✅ **Economia de CPU**: Até 67% menos processamento
- ✅ **Economia de bateria**: Menos processos em background
- ✅ **Renderização inteligente**: Máximo 100 tickets por lista

### 📊 Dashboard
- Total de tickets
- Tickets de suporte (IT)
- Tickets de clientes
- Tickets pendentes
- Estatísticas em tempo real

---

## 🚀 Instalação

### ⚡ Instalação Automática (Recomendado)

Execute um único comando para instalar tudo automaticamente:

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

**🎯 O que o script faz:**
- ✅ Cria automaticamente a estrutura `~/dev/nu/jira-monitor`
- ✅ Clona o repositório no caminho correto
- ✅ Verifica e instala Node.js v20 (via nvm, se necessário)
- ✅ Instala todas as dependências npm
- ✅ Oferece iniciar o app imediatamente

> 📖 **Detalhes do Script**: Veja [INSTALL-AUTO-README.md](./INSTALL-AUTO-README.md) para entender tudo que o script faz

---

### 🔧 Instalação Manual

> 📖 **Guia Completo**: Para instruções detalhadas, consulte [INSTALACAO-GIT.md](./INSTALACAO-GIT.md)

#### Pré-requisitos
- **macOS** 10.13 ou superior
- **Node.js** 18-20 (**recomendado via nvm**)
- **Git** (para clonar o repositório)

#### Instalação do Node.js (Recomendado via nvm)

```bash
# 1. Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. Configurar (adicionar ao ~/.zshrc)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. Fechar e reabrir o terminal

# 4. Instalar Node 20
nvm install 20
nvm use 20
nvm alias default 20

# 5. Verificar
node --version  # Deve mostrar v20.x.x
```

#### Passos de Instalação

```bash
# 1. Criar diretório (se não existir)
mkdir -p ~/dev/nu
cd ~/dev/nu

# 2. Clonar o repositório
git clone git@github.com:gabinubank/jira-monitor.git
cd jira-monitor

# 3. Instalar dependências
npm install

# 4. Iniciar o app
npm start
```

---

## ⚙️ Configuração

### Primeira vez

1. **Abra o app** e clique em **"Configurações"** (⚙️)
2. **Preencha**:
   - 🔗 URL do Jira: `https://sua-empresa.atlassian.net`
   - 📧 Email: `seu-email@empresa.com`
   - 🔑 API Token: [Criar token aqui](https://id.atlassian.com/manage-profile/security/api-tokens)
   - 👤 Seu nome de usuário no Jira
3. **Clique em "Salvar"**

### Intervalo de Atualização
- Padrão: **60 segundos**
- Recomendado: Entre 30s e 120s
- Menor intervalo = mais tempo real, mas mais consumo

---

## 📖 Guias Completos

- 📘 [**GUIA-v1.5.0.md**](./GUIA-v1.5.0.md) - Guia completo de uso
- 🚀 [**OTIMIZACOES-CPU-MEMORIA.md**](./OTIMIZACOES-CPU-MEMORIA.md) - Detalhes técnicos das otimizações

---

## 🎯 Uso

### Modo Normal
- **Dashboard**: Visualize estatísticas gerais
- **Listas de Tickets**: Clique em cada card para ver detalhes
- **Preview**: Clique em um ticket para abrir preview rápido
- **Busca**: Use a barra de busca para encontrar tickets específicos

### Modo Pro
- **Ativação**: Clique no 👨‍💻 no canto superior direito
- **Recursos extras**:
  - Edição de campos inline
  - Adicionar comentários
  - Upload de anexos
  - Mencionar usuários (@)
  - Visualização expandida

---

## 🔔 Notificações

O app envia notificações nos seguintes casos:

### Tickets Novos
- Quando você recebe um novo ticket atribuído

### Mudanças de Status
- Quando um ticket muda de status (ex: "To Do" → "In Progress")

### Alertas de SLA
- 🟡 **Warning**: Quando faltam 1-3h para vencer
- 🔴 **Critical**: Quando falta menos de 1h
- 🔴 **Overdue**: Quando o SLA estoura

---

## 📊 Performance

### Antes das Otimizações
- 💾 Memória: ~480 MB (500 tickets)
- ⚙️ CPU idle: ~12%
- ⚙️ CPU pico: ~35%

### Depois das Otimizações
- 💾 Memória: ~180 MB (-62%) ✅
- ⚙️ CPU idle: ~4% (-67%) ✅
- ⚙️ CPU pico: ~14% (-60%) ✅

**Mais detalhes**: [OTIMIZACOES-CPU-MEMORIA.md](./OTIMIZACOES-CPU-MEMORIA.md)

---

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
jira-monitor/
├── main.js              # Processo principal do Electron
├── renderer.js          # Interface do usuário
├── preload.js           # Bridge seguro entre main e renderer
├── jira-service.js      # Integração com API do Jira
├── styles.css           # Estilos da interface
├── index.html           # HTML principal
├── package.json         # Dependências e scripts
└── start.sh             # Script de inicialização
```

### Scripts Disponíveis

```bash
# Iniciar em desenvolvimento
npm start

# Limpar cache do Electron
npm run clean

# Build para produção (futuro)
npm run build
```

### Tecnologias Utilizadas
- **Electron** 25+
- **Node.js** 18+
- **Jira REST API** v3
- **electron-store** (persistência)
- **axios** (HTTP)

---

## 🔧 Troubleshooting

### Erro: `Node.js v20 não está ativo!`

**Sintoma:**
```bash
./start.sh: line 22: nvm: command not found
📦 Node.js: v25.2.1 (/opt/homebrew/bin/node)
❌ ERRO: Node.js v20 não está ativo!
```

**Causa:** Você tem Node.js instalado via Homebrew, mas o app precisa de Node.js v20 via nvm.

**Solução:** Consulte o guia completo: [FIX-NODE-VERSION.md](./FIX-NODE-VERSION.md)

**Solução Rápida:**
```bash
# Execute o script de correção
./fix-environment.sh

# Feche e reabra o terminal, depois:
npm start
```

---

### Erro: `Library not loaded: libsimdjson.28.dylib`

**Sintoma:**
```bash
dyld[14840]: Library not loaded: /opt/homebrew/opt/simdjson/lib/libsimdjson.28.dylib
zsh: abort   npm install
```

**Causa:** Node.js instalado via Homebrew com dependências quebradas ou versão incompatível (Node 24+)

**Solução:**

```bash
# 1. Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 2. Configurar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. Fechar e reabrir o terminal

# 4. Instalar Node 20
nvm install 20
nvm use 20
nvm alias default 20

# 5. Verificar
node --version  # Deve mostrar v20.x.x

# 6. Tentar novamente
npm install
npm start
```

### Erro: `npm install` falha

**Solução:**
```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### App não inicia

**Solução:**
```bash
# Verificar Node.js
node --version  # Deve ser 18-20

# Verificar se Electron está instalado
ls node_modules/.bin/electron

# Se não existir, reinstalar
npm install
```

### Mais problemas?

- 📚 Consulte: [DOCUMENTACAO-COMPLETA.md](./DOCUMENTACAO-COMPLETA.md#-troubleshooting)
- 📧 Entre em contato: gabriel.silva.digisystem@nubank.com.br

---

## 🤝 Contribuindo

Este é um projeto em **fase beta** de testes internos.

### Como contribuir:
1. 🐛 Reporte bugs criando uma issue
2. 💡 Sugira melhorias
3. 🧪 Teste e dê feedback
4. 📝 Melhore a documentação

---

## 📝 Changelog

### v1.6.1 (Atual)
- 🚀 **Otimizações de CPU e Memória** (-60% recursos)
- 🎨 **SLA Colors** em todos os tickets IT
- 🔔 **Notificações de SLA** (warning/critical/overdue)
- 🧹 **Limpeza automática** de cache
- ⚡ **Debouncing otimizado** em buscas
- 📊 **Limitação de renderização** (max 100 tickets por lista)

### v1.5.0
- 🎨 SLA Colors implementado
- 🔔 Sistema de notificações
- 📊 Dashboard melhorado
- 🎯 Modo Pro

---

## 🔒 Segurança

- ✅ Credenciais armazenadas localmente (electron-store)
- ✅ Comunicação via HTTPS com Jira
- ✅ Sem envio de dados para servidores externos
- ✅ API Token nunca exposto no código

**⚠️ Importante**: Nunca compartilhe seu API Token!

---

## 📞 Suporte

### Problemas Comuns

**App não inicia:**
- Verifique se tem Node.js 18+ instalado
- Execute `npm install` novamente

**Erro de autenticação:**
- Verifique suas credenciais
- Crie um novo API Token

**Tickets não aparecem:**
- Verifique sua conexão com internet
- Verifique se o usuário tem acesso aos projetos

**Alto consumo de recursos:**
- Reduza o intervalo de atualização
- Verifique quantos tickets você tem (limite renderizado: 100)

---

## 📄 Licença

Este é um projeto **interno** em fase de testes.

---

## 👥 Autores

- **Gabriel Silva - @GABS SILVA** - [@gabinubank](https://github.com/gabinubank)
- **Yanka Dantas -  @ya** - [@yankadantas1](https://github.com/yankadantas1)

---

## 🙏 Agradecimentos

- Equipe IT do Nubank
- Colaboradores que testaram e deram feedback

---

**Feito com ❤️ para tornar o monitoramento de tickets mais eficiente**
