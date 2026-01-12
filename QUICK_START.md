# 🚀 Guia Rápido - Jira Monitor

## ⚡ Instalação Ultra-Rápida (1 comando)

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

**Pronto!** O script instala tudo automaticamente. ✅

---

## 🔧 Instalação Manual (3 Passos)

### 1️⃣ Clonar o Projeto
```bash
# Criar diretório (se não existir)
mkdir -p ~/dev/nu
cd ~/dev/nu

# Clonar o repositório
git clone git@github.com:gabinubank/jira-monitor.git
cd jira-monitor

# Instalar dependências
npm install
```

### 2️⃣ Executar a Aplicação
```bash
npm start
```

### 3️⃣ Configurar
Na primeira execução, você verá a tela de configuração:

1. **URL do Jira**: `https://nubank.atlassian.net`
2. **Email**: seu email do Jira
3. **API Token**: [Como gerar](#como-gerar-api-token)
4. **ID da Fila**: `1104` (padrão)
5. Clique em **Salvar**

## Como Gerar API Token

1. Acesse: https://id.atlassian.com/manage-profile/security/api-tokens
2. Clique em **"Create API token"**
3. Nome: `Jira Monitor`
4. Copie o token gerado
5. Cole na configuração

## Atalhos Principais

| Atalho | Função |
|--------|--------|
| `Cmd+K` | Busca rápida de tickets |
| `Cmd+P` | Ativar/desativar Modo Pro |
| `Cmd+L` | Alternar layout (vertical/horizontal) |
| `Cmd+R` | Atualizar dados |
| `Cmd+,` | Abrir configurações |
| `Esc` | Minimizar |
| `1,2,3,4` | Abrir cards |

## Recursos

### 📊 Contadores
- **Total**: Todos os seus tickets ativos
- **Waiting for Support**: Aguardando sua ação
- **Waiting for Customer**: Aguardando cliente
- **Tickets Pending**: Tickets pendentes

### 🔔 Notificações
- Novos tickets atribuídos
- Mudanças de status
- SLA próximo (⏰)
- Tickets antigos (📅)

### ⭐ Modo Pro
Ative nas configurações para acessar:
- 📊 Estatísticas por projeto
- 📈 Gráfico de tendência (7 dias)
- 🕐 Tickets recentes
- 📱 Tickets de Telefonia SIM cards
- 📚 Documentação L1

### 👁️ Preview de Tickets
Clique em qualquer ticket para ver:
- Detalhes completos
- Descrição formatada
- Comentários (adicionar, editar, excluir)
- Anexos (visualizar, adicionar, baixar)
- Editar campos (status, assignee, etc.)

### 👤 Monitorar Outro Usuário
Nas configurações:
1. Marque "👤 Monitorar outro usuário"
2. Digite o email do usuário
3. Salve

## Início Automático (macOS)

Para iniciar automaticamente no login:

```bash
bash ativar-inicio-automatico.sh
```

Para desativar:

```bash
bash desativar-inicio-automatico.sh
```

## Dicas

### 💡 Expandir Cards
Clique no botão **▼** no canto superior direito de cada card para ver a lista completa de tickets.

### 💡 Busca Rápida
Pressione `Cmd+K` e busque por:
- Código do ticket (ex: IT-1234)
- Palavras-chave do título
- Status

### 💡 Layout Compacto
Pressione `Cmd+L` para alternar para o modo barra horizontal (ideal para deixar no topo da tela).

### 💡 Botões Customizáveis (Modo Pro)
- **Editar**: Duplo clique no ✏️ ou no texto
- **Arrastar**: Clique e arraste pelo ☰

## Solução de Problemas

### ❌ Não conecta ao Jira
- Verifique URL, email e API token
- Confirme que você tem acesso aos tickets

### ❌ Notificações não aparecem
- Permita notificações nas configurações do sistema
- Ative "Tocar som nas notificações"

### ❌ Início automático não funciona
- Execute o script novamente
- Verifique os logs em `~/Library/Logs/com.nubank.jiramonitor.log`

## Suporte

Encontrou algum problema? Abra uma issue no repositório ou entre em contato com o time de desenvolvimento:

- **Slack**: @GABS SILVA | @ya (Yanka Dantas)

---

**Versão**: 1.4.0  
**Última atualização**: Dezembro 2025

