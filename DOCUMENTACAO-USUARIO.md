# 📘 Manual do Usuário - Jira Monitor

> **Guia completo para usar o Jira Monitor e aproveitar todos os recursos**

![Jira Monitor](assets/icon.png)

---

## 📑 Índice

1. [Bem-vindo ao Jira Monitor](#-bem-vindo-ao-jira-monitor)
2. [Instalação](#-instalação)
3. [Primeiro Acesso](#-primeiro-acesso)
4. [Interface Principal](#-interface-principal)
5. [Entendendo as Cores de SLA](#-entendendo-as-cores-de-sla)
6. [Notificações](#-notificações)
7. [Modo Pro](#-modo-pro)
8. [Menu Bar (Bandeja do Sistema)](#-menu-bar-bandeja-do-sistema)
9. [Atalhos de Teclado](#-atalhos-de-teclado)
10. [Dicas e Truques](#-dicas-e-truques)
11. [Solução de Problemas](#-solução-de-problemas)
12. [Perguntas Frequentes (FAQ)](#-perguntas-frequentes-faq)

---

## 👋 Bem-vindo ao Jira Monitor

### O que é o Jira Monitor?

O **Jira Monitor** é uma aplicação desktop que ajuda você a **acompanhar seus tickets do Jira em tempo real**, com destaque especial para:

- 🎨 **Cores visuais** indicando o status do SLA (Service Level Agreement)
- 🔔 **Notificações** quando algo importante acontece
- 📊 **Dashboard** com estatísticas dos seus tickets
- ⚡ **Atualizações automáticas** para você não perder nada

### Por que usar o Jira Monitor?

- ✅ **Nunca esqueça um ticket importante**
- ✅ **Veja de relance quais tickets precisam de atenção urgente**
- ✅ **Seja notificado imediatamente** quando algo mudar
- ✅ **Monitore seus SLAs** sem precisar ficar checando o Jira constantemente
- ✅ **Economize tempo** com uma interface otimizada

---

## 💾 Instalação

### Instalação Automática (Recomendado)

A forma mais fácil de instalar o Jira Monitor é usando o script automático:

```bash
curl -fsSL https://raw.githubusercontent.com/gabinubank/jira-monitor/main/install-auto.sh | bash
```

**O que o script faz:**
1. ✅ Verifica se você tem o Node.js instalado (versão 20 ou superior)
2. ✅ Cria a pasta `~/dev/nu/jira-monitor` automaticamente
3. ✅ Baixa o código do GitHub
4. ✅ Instala todas as dependências
5. ✅ Oferece iniciar o app imediatamente

### Instalação Manual

Se preferir instalar manualmente:

```bash
# 1. Criar pasta
mkdir -p ~/dev/nu
cd ~/dev/nu

# 2. Clonar repositório
git clone git@github.com:gabinubank/jira-monitor.git
cd jira-monitor

# 3. Instalar dependências
npm install

# 4. Iniciar o app
npm start
```

### Requisitos

- **Sistema Operacional**: macOS 10.13 ou superior
- **Node.js**: Versão 20 ou superior
- **Conexão com Internet**: Para conectar ao Jira

---

## 🚀 Primeiro Acesso

### 1. Obtendo suas Credenciais do Jira

Antes de usar o Jira Monitor, você precisa criar um **API Token** do Jira:

#### Passo 1: Acesse a página de API Tokens
Abra seu navegador e vá para:
```
https://id.atlassian.com/manage-profile/security/api-tokens
```

#### Passo 2: Crie um novo token
1. Clique em **"Create API token"**
2. Dê um nome ao token: `Jira Monitor`
3. Clique em **"Create"**
4. **IMPORTANTE**: Copie o token que aparece (ele só será mostrado uma vez!)

> 💡 **Dica**: Cole o token em algum lugar temporário (Notes, por exemplo) enquanto configura o app.

### 2. Configurando o Jira Monitor

Quando você abre o Jira Monitor pela primeira vez, verá a tela de configuração:

![Tela de Configuração](assets/screenshots/configuracao.png)
<!-- Screenshot: Primeira tela de configuração -->

#### Preencha os campos:

**URL do Jira:**
```
https://nubank.atlassian.net
```
(Ou a URL do seu Jira, se diferente)

**Email:**
```
seu.email@nubank.com.br
```
(O email que você usa para logar no Jira)

**API Token:**
```
Cole o token que você copiou anteriormente
```

**Intervalo de Atualização:**
```
60 segundos (recomendado)
```
- Valores menores: Atualização mais rápida, mas mais consumo
- Valores maiores: Menos consumo, mas atualizações mais espaçadas

#### Clique em "Salvar"

Se tudo estiver correto, o Jira Monitor começará a carregar seus tickets!

---

## 🖥️ Interface Principal

### Visão Geral

A interface do Jira Monitor é dividida em várias seções:

```
┌────────────────────────────────────────────────────┐
│  ⚙️ Menu     [Jira Monitor]     🔔 📄 ⚙️ ☰ −  ✕   │ ← Header
├────────────────────────────────────────────────────┤
│  🔍 [Busca rápida...]                              │ ← Busca
├────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Total de Tickets │  │ Waiting for      │       │
│  │       24         │  │ Support: 8       │       │
│  └──────────────────┘  └──────────────────┘       │ ← Cards
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Waiting for      │  │ Tickets          │       │
│  │ Customer: 12     │  │ Pending: 4       │       │
│  └──────────────────┘  └──────────────────┘       │
├────────────────────────────────────────────────────┤
│  📊 Modo Pro (se ativado)                          │
│  - Atividade de Hoje                               │
│  - Tickets de Telefonia                            │
│  - Dashboard de Performance                        │
├────────────────────────────────────────────────────┤
│  ⏰ Última atualização: há 2 min    🔄            │ ← Footer
└────────────────────────────────────────────────────┘
```

### Header (Barra Superior)

O header contém os principais controles:

| Ícone | Função | Descrição |
|-------|--------|-----------|
| **☰** | Menu | Abre menu com opções adicionais |
| **🔔** | Notificações | Mostra notificações recentes (badge vermelho se houver novas) |
| **📄** | Documentação | Links para documentação L1 e BPO |
| **⚙️** | Configurações | Abre tela de configurações |
| **👨‍💻** | Modo Pro | Ativa/desativa recursos avançados |
| **−** | Minimizar | Minimiza a janela |
| **✕** | Fechar | Fecha a janela (app continua na Menu Bar) |

### Cards de Estatísticas

Cada card mostra um tipo de ticket:

#### 📊 Total de Tickets - IT
- **O que mostra**: Todos os seus tickets abertos no projeto IT
- **Como usar**: Clique para ver a lista completa
- **Cores**: Varia conforme o SLA dos tickets

#### 🔧 Waiting for Support - IT
- **O que mostra**: Tickets aguardando sua ação
- **Como usar**: Priorize estes tickets!
- **Dica**: Tickets vermelhos precisam de atenção imediata

#### 👤 Waiting for Customer - IT
- **O que mostra**: Tickets aguardando resposta do cliente
- **Como usar**: Acompanhe para não esquecer de dar follow-up
- **Dica**: Você pode estar aguardando informações adicionais

#### ⏸️ Tickets Pending - IT
- **O que mostra**: Tickets em estado pendente
- **Como usar**: Verifique o que está impedindo o progresso

### Lista de Tickets

Ao clicar em um card, você vê a lista de tickets:

```
┌────────────────────────────────────────────────────┐
│ IT-12345                                    [...]  │ ← Ticket
│ Bug no sistema de login                            │
│ Status: In Progress                                │
│ SLA: 🟢 4h 30min restantes                        │
└────────────────────────────────────────────────────┘
```

Cada ticket mostra:
- **Key**: Código do ticket (ex: IT-12345)
- **Summary**: Título/resumo
- **Status**: Estado atual
- **SLA**: Tempo restante (com cor indicativa)

> 💡 **Dica**: Clique em qualquer ticket para ver mais detalhes!

---

## 🎨 Entendendo as Cores de SLA

O Jira Monitor usa um sistema de cores para indicar a urgência dos tickets baseado no **tempo restante** até o vencimento do SLA:

### 🟢 Verde (Tudo Bem)

```
┌─────────────────────────────────┐
│ IT-12345                        │ ← Borda verde
│ Configurar novo usuário         │
│ SLA: 🟢 5h 30min restantes     │
└─────────────────────────────────┘
```

**O que significa:**
- ✅ Mais de **3 horas** até o vencimento do SLA
- ✅ Você tem tempo suficiente
- ✅ Continue trabalhando normalmente

**O que fazer:**
- Trabalhe no ticket no ritmo normal
- Não precisa de urgência especial

---

### 🟡 Amarelo (Atenção!)

```
┌─────────────────────────────────┐
│ IT-12346                        │ ← Borda amarela
│ Erro ao acessar sistema         │ ← Fundo levemente amarelo
│ SLA: 🟡 2h 15min restantes     │
└─────────────────────────────────┘
```

**O que significa:**
- ⚠️ Entre **1 e 3 horas** até o vencimento
- ⚠️ Atenção necessária
- ⚠️ Priorize este ticket

**O que fazer:**
- Priorize este ticket na sua fila
- Comece a trabalhar nele em breve
- Avalie se precisa de ajuda

---

### 🔴 Vermelho (Urgente!)

```
┌─────────────────────────────────┐
│ IT-12347                        │ ← Borda vermelha
│ Sistema fora do ar              │ ← Fundo levemente vermelho
│ SLA: 🔴 45min restantes        │ ← Sombra vermelha
└─────────────────────────────────┘
```

**O que significa:**
- 🚨 Menos de **1 hora** até o vencimento
- 🚨 **URGENTE** - Precisa de ação imediata!
- 🚨 Risco de estourar SLA

**O que fazer:**
- **Largue tudo** e atenda este ticket
- Se não conseguir resolver, **escale** imediatamente
- Mantenha o cliente informado

---

### 🔴 Vermelho Pulsante (SLA VENCIDO!)

```
┌─────────────────────────────────┐
│ IT-12348                        │ ← Borda vermelha
│ Solicitação de acesso           │ ← Fundo vermelho pulsante
│ SLA: 🔴 VENCIDO há 30min       │ ← Animação pulsando
└─────────────────────────────────┘
```

**O que significa:**
- ❌ **SLA JÁ ESTOUROU**
- ❌ Você perdeu o prazo
- ❌ Requer ação **IMEDIATA**

**O que fazer:**
1. **Atenda IMEDIATAMENTE**
2. Informe o cliente sobre o atraso
3. Explique o que aconteceu
4. Resolva o mais rápido possível
5. **Documente** o ocorrido

> ⚠️ **IMPORTANTE**: SLAs estourados podem afetar métricas da equipe e satisfação do cliente!

---

### Como o SLA é Calculado?

O Jira Monitor busca o campo **"Time to resolution"** (Tempo até resolução) do Jira Service Management:

```javascript
Tempo restante = Data/hora de vencimento - Data/hora atual

Se tempo < 0 → 🔴 VENCIDO (pulsante)
Se tempo < 1h → 🔴 Crítico
Se tempo entre 1h e 3h → 🟡 Atenção
Se tempo > 3h → 🟢 OK
```

> 💡 **Nota**: O SLA é recalculado automaticamente a cada atualização (padrão: 60 segundos).

---

## 🔔 Notificações

O Jira Monitor tem dois tipos de notificações:

### 1. Notificações de Desktop (macOS)

Aparecem no canto superior direito da tela:

```
┌─────────────────────────────────────┐
│ 🎫 Jira Monitor                     │
│                                     │
│ Novo Ticket: IT-12349               │
│ Solicitação de reset de senha      │
│                                     │
│ há 2 segundos                       │
└─────────────────────────────────────┘
```

**Quando aparecem:**
- ✅ Novo ticket atribuído a você
- ✅ Status de um ticket mudou
- ✅ SLA entrando em zona de atenção (amarelo)
- ✅ SLA entrando em zona crítica (vermelho)
- ✅ SLA estourou
- ✅ Alguém mencionou você (@) em um comentário

**Como interagir:**
- Clique na notificação para abrir o ticket
- Ignore para que ela desapareça automaticamente

**Ativar/Desativar:**
1. Clique em ⚙️ (Configurações)
2. Marque/desmarque "🔔 Notificações desktop"
3. Clique em "Salvar"

> 💡 **Dica**: Se não estiver recebendo notificações, verifique as permissões do macOS:
> **System Preferences → Notifications → Jira Monitor → Permitir Notificações**

---

### 2. Notificações In-App

Aparecem dentro do próprio Jira Monitor:

```
┌────────────────────────────────┐
│ 🔔 (3)  ← Badge vermelho       │ ← Clique aqui
└────────────────────────────────┘
```

Ao clicar no sino 🔔, você vê:

```
┌──────────────────────────────────────┐
│ Notificações                    ✕    │
├──────────────────────────────────────┤
│ 💬 João Silva comentou              │
│    IT-12345: Bug no login           │
│    há 5 minutos                     │
├──────────────────────────────────────┤
│ 🔴 SLA Crítico                      │
│    IT-12346: Sistema lento          │
│    há 10 minutos                    │
├──────────────────────────────────────┤
│ ✅ Status Mudou                     │
│    IT-12347: Done → Closed          │
│    há 15 minutos                    │
└──────────────────────────────────────┘
```

**Como usar:**
- Clique em uma notificação para abrir o ticket
- Clique em "Limpar" para remover todas
- Badge vermelho mostra quantas não lidas

---

## 🎯 Modo Pro

O **Modo Pro** desbloqueia recursos avançados de edição e gerenciamento de tickets.

### Como Ativar

Clique no ícone **👨‍💻** no canto superior direito do header.

### Recursos Exclusivos

#### 1. 📅 Atividade de Hoje

Veja um resumo do que aconteceu hoje:

```
┌─────────────────────────────────────┐
│ 📅 Atividade de Hoje                │
│                                     │
│  🆕 Recebidos: 5                   │
│  ✅ Fechados: 8                    │
│  💬 Comentários: 12                │
└─────────────────────────────────────┘
```

Clique em cada card para ver detalhes:
- **Recebidos**: Tickets que você recebeu hoje
- **Fechados**: Tickets que você resolveu hoje
- **Comentários**: Comentários que você fez hoje

---

#### 2. 📱 Tickets de Telefonia (SIM Cards)

Veja todos os tickets relacionados a SIM cards:

```
┌─────────────────────────────────────┐
│ 📱 Telefonia                         │
│                                     │
│  Tickets SIM Cards: 3               │
│                                     │
│  [MVE] [Controle de SIMCARD]       │
└─────────────────────────────────────┘
```

- Clique no número para ver a lista
- Clique nos botões para acessar ferramentas úteis
- Arraste os botões para reordenar (☰)

---

#### 3. ✅ Tickets Avaliados

Veja os últimos tickets que receberam avaliação:

```
┌─────────────────────────────────────┐
│ ✅ Tickets Avaliados                │
│                                     │
│  Últimos Avaliados: 10              │
│                                     │
│  IT-12345 ⭐⭐⭐⭐⭐ (há 2 dias)   │
│  IT-12346 ⭐⭐⭐⭐   (há 3 dias)   │
│  IT-12347 ⭐⭐⭐     (há 5 dias)   │
└─────────────────────────────────────┘
```

---

#### 4. 📊 Dashboard de Performance

Métricas da sua performance nos últimos 30 dias:

```
┌──────────────────────────────────────┐
│ 📊 Dashboard de Performance          │
│                                      │
│  ⏱️ Tempo Médio    ✅ Resolvidos    │
│     4.5 horas        87 tickets     │
│                                      │
│  📈 Por Semana                       │
│     12 tickets/sem                   │
│                                      │
│  [Atualizar Métricas]                │
└──────────────────────────────────────┘
```

Clique para expandir e ver:
- 🏷️ Gráfico por prioridade
- 📦 Gráfico por projeto
- 🔥 Heatmap de atividade (horários mais produtivos)
- 📋 Últimos 10 tickets resolvidos

---

#### 5. 🔔 Alertas Proativos

Sistema de alertas inteligentes:

```
┌──────────────────────────────────────┐
│ 🔔 Alertas Proativos                 │
│                                      │
│  ⚠️ Tickets sem resposta (3)        │
│     IT-12345 - 6h sem atualização   │
│     IT-12346 - 8h sem atualização   │
│     IT-12347 - 12h sem atualização  │
│                                      │
│  🚨 SLA Crítico (2)                  │
│     IT-12348 - Vence em 30min       │
│     IT-12349 - Vence em 45min       │
└──────────────────────────────────────┘
```

Tipos de alertas:
- **⚠️ Tickets sem resposta**: Tickets há muito tempo sem atualização
- **🚨 SLA Crítico**: Tickets prestes a estourar o SLA
- **💬 Menções**: Comentários onde você foi mencionado

---

### Preview de Ticket no Modo Pro

Ao clicar em um ticket no Modo Pro, você pode:

#### ✏️ Editar Campos

```
┌──────────────────────────────────────┐
│ IT-12345                        ✕    │
├──────────────────────────────────────┤
│ Título: [Bug no sistema de login]   │ ← Editável
│ Status: [In Progress ▼]             │ ← Dropdown
│ Prioridade: [High ▼]                │ ← Dropdown
│ Responsável: [@João Silva ▼]        │ ← Busca
│                                      │
│ Descrição:                           │
│ [Sistema apresenta erro ao fazer...] │ ← Editável
│                                      │
│ [Salvar Alterações]                  │
└──────────────────────────────────────┘
```

**Como editar:**
1. Clique no campo que deseja editar
2. Faça a alteração
3. Clique em "Salvar Alterações"

---

#### 💬 Adicionar Comentários

```
┌──────────────────────────────────────┐
│ 💬 Comentários (5)                   │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ Escreva um comentário...       │  │
│ │                                │  │
│ │ Use @ para mencionar alguém    │  │
│ └────────────────────────────────┘  │
│ ☐ Comentário interno                │
│ [Adicionar Comentário]               │
└──────────────────────────────────────┘
```

**Recursos:**
- **Menções (@)**: Digite @ e comece a escrever o nome
  ```
  @joao → Mostra sugestões: João Silva, João Pedro...
  ```
- **Comentário interno**: Visível apenas para a equipe IT
- **Formatação**: Suporta texto simples e links

**Exemplo:**
```
Olá @João Silva, já verifiquei o problema.

O sistema estava com erro de permissão.
Já corrigi e testei.

Pode validar: https://sistema.exemplo.com
```

---

#### 📎 Anexar Arquivos

```
┌──────────────────────────────────────┐
│ 📎 Anexos (2)                        │
│                                      │
│ screenshot.png         2.3 MB        │ ← Clique para baixar
│ log_error.txt          45 KB         │
│                                      │
│ [📎 Adicionar Anexo]                 │
└──────────────────────────────────────┘
```

**Como anexar:**
1. Clique em "📎 Adicionar Anexo"
2. Selecione o(s) arquivo(s)
3. Aguarde o upload
4. Pronto! Arquivo anexado ao ticket

**Formatos aceitos:**
- Imagens: .png, .jpg, .gif
- Documentos: .pdf, .doc, .xlsx
- Logs: .txt, .log
- Outros: qualquer arquivo (até 10 MB)

---

## 🖥️ Menu Bar (Bandeja do Sistema)

O Jira Monitor fica sempre disponível na **Menu Bar** do macOS:

```
[ ]  [ ]  [ ]  🔴🟡🟢 Jira Monitor  [ ]  [ ]
                  ↑
            Indicadores visuais
```

### Indicadores

O ícone mostra o estado dos seus tickets:

- **🔴** = Tem tickets com SLA vencido ou crítico
- **🟡** = Tem tickets próximos do vencimento
- **🟢** = Tem tickets OK
- **⚪** = Nenhum ticket no momento

> 💡 **Pode ter múltiplos**: Se você tem tickets em diferentes estados, verá vários emojis! (ex: 🔴🟡🟢)

### Menu Dropdown

Clique no ícone para ver o menu:

```
┌─────────────────────────────────────┐
│ 📊 2 crítico(s)                     │ ← Status
├─────────────────────────────────────┤
│ 🔴 SLA VENCIDO                      │
│   IT-12345: Bug no login            │ ← Clique para abrir
│   IT-12346: Sistema lento           │
├─────────────────────────────────────┤
│ 🟡 SLA PRÓXIMO DO VENCIMENTO        │
│   IT-12347: Criar usuário           │
│   IT-12348: Reset de senha          │
│   IT-12349: Acesso negado           │
├─────────────────────────────────────┤
│ 🟢 SLA OK (10)                      │
│   IT-12350: Configuração            │
│   ... e mais 9                      │
├─────────────────────────────────────┤
│ 📊 Abrir Jira Monitor               │
│ 🔄 Atualizar Agora                  │
├─────────────────────────────────────┤
│ 🧪 Testar Cores                     │ ← Menu de demonstração
│ ⚙️ Configurações                    │
│ 🚪 Sair                             │
└─────────────────────────────────────┘
```

**Como usar:**
1. Clique em qualquer ticket para abrir o preview
2. Clique em "Atualizar Agora" para buscar novos dados
3. Clique em "Abrir Jira Monitor" para mostrar a janela principal

> 💡 **Dica**: Você pode fechar a janela principal e continuar monitorando pela Menu Bar!

---

## ⌨️ Atalhos de Teclado

### Atalhos Principais

| Atalho | Ação | Descrição |
|--------|------|-----------|
| **Cmd+K** | Busca Rápida | Abre busca de tickets |
| **Cmd+R** | Atualizar | Atualiza os dados do Jira |
| **Cmd+,** | Configurações | Abre configurações |
| **Cmd+P** | Modo Pro | Ativa/desativa Modo Pro |
| **Cmd+L** | Layout | Alterna layout (vertical/horizontal) |
| **Esc** | Fechar/Minimizar | Fecha modal ou minimiza janela |

### Atalhos de Navegação

| Atalho | Ação |
|--------|------|
| **1** | Abre card "Total de Tickets" |
| **2** | Abre card "Waiting for Support" |
| **3** | Abre card "Waiting for Customer" |
| **4** | Abre card "Tickets Pending" |

### Atalhos de Busca

Quando a busca está ativa:

| Atalho | Ação |
|--------|------|
| **↑ ↓** | Navegar entre resultados |
| **Enter** | Abrir ticket selecionado |
| **Esc** | Fechar busca |

### Atalhos no Preview de Ticket

| Atalho | Ação |
|--------|------|
| **Cmd+E** | Editar (Modo Pro) |
| **Cmd+Enter** | Enviar comentário (Modo Pro) |
| **Esc** | Fechar preview |

---

## 💡 Dicas e Truques

### 1. Priorização Inteligente

**Ordem de atendimento recomendada:**

1. 🔴 **SLA Vencido** (pulsante) - URGENTE
2. 🔴 **SLA Crítico** (< 1h) - Muito Alta
3. 🟡 **SLA Atenção** (1-3h) - Alta
4. 🟢 **SLA OK** (> 3h) - Normal

**Dica**: Sempre comece pelos vermelhos!

---

### 2. Uso do Modo Pro

**Quando usar o Modo Pro:**
- ✅ Quando precisar editar um ticket rapidamente
- ✅ Para adicionar comentários com menções
- ✅ Para anexar arquivos (screenshots, logs)
- ✅ Para ver métricas de performance
- ✅ Para acompanhar tickets de telefonia

**Quando não usar:**
- ❌ Para apenas visualizar tickets (modo normal é mais rápido)
- ❌ Quando precisar economizar recursos (Modo Pro usa mais memória)

---

### 3. Configuração de Intervalo

**Como escolher o intervalo ideal:**

```yaml
30 segundos:
  Prós: Atualização mais rápida
  Contras: Maior consumo de CPU e rede
  Quando usar: Equipes grandes, muitos tickets

60 segundos (padrão):
  Prós: Balanço entre velocidade e consumo
  Contras: Nenhum significativo
  Quando usar: Uso geral (recomendado)

120 segundos:
  Prós: Menor consumo
  Contras: Atualizações mais espaçadas
  Quando usar: Poucas mudanças, economizar bateria
```

---

### 4. Organização da Tela

**Layout Vertical** (padrão):
```
┌────┐
│ IT │
├────┤
│ CS │
├────┤
│ PT │
└────┘
```
- Melhor para monitores em retrato
- Mais espaço para ver tickets

**Layout Horizontal** (Cmd+L):
```
┌────┬────┬────┐
│ IT │ CS │ PT │
└────┴────┴────┘
```
- Melhor para monitores widescreen
- Visão panorâmica

---

### 5. Notificações Inteligentes

**Para não ficar sobrecarregado:**

1. Desative notificações de tipos menos importantes
   - ⚙️ Configurações → Notificações
   - Desmarque "Mudanças de status" se receber muitas

2. Use Do Not Disturb do macOS em reuniões
   - As notificações ficam salvas para ver depois

3. Verifique notificações in-app regularmente
   - Clique no sino 🔔
   - Limpe as já tratadas

---

### 6. Menu Bar como Monitor Secundário

**Aproveite a Menu Bar:**

1. Feche a janela principal (X)
2. App continua rodando na Menu Bar
3. Monitore os emojis: 🔴🟡🟢
4. Clique para ver detalhes quando necessário

**Vantagens:**
- ✅ Não ocupa espaço na tela
- ✅ Sempre visível
- ✅ Acesso rápido

---

### 7. Busca Rápida (Cmd+K)

**Use a busca para:**
- Encontrar tickets por número: `IT-12345`
- Buscar por palavras-chave: `login`, `senha`, `erro`
- Filtrar por status: `in progress`, `pending`

**Exemplo:**
```
Buscar: "login erro"
Resultados:
  IT-12345: Bug no sistema de login
  IT-12378: Erro de autenticação ao logar
  IT-12401: Login não funciona no Safari
```

---

## 🔧 Solução de Problemas

### Problema 1: App não inicia

**Sintomas:**
- Clica em "Jira Monitor" mas nada acontece
- Ícone aparece e desaparece no Dock

**Soluções:**

#### 1.1. Verificar Node.js
```bash
# Abra o Terminal e execute:
node --version
```

**Deve mostrar:** `v20.x.x` ou superior

**Se não:**
```bash
# Instalar Node.js 20
nvm install 20
nvm use 20
nvm alias default 20
```

#### 1.2. Reinstalar dependências
```bash
cd ~/dev/nu/jira-monitor
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 1.3. Ver logs de erro
```bash
# Executar com logs
cd ~/dev/nu/jira-monitor
npm start 2>&1 | tee debug.log
```

Compartilhe o arquivo `debug.log` com o suporte.

---

### Problema 2: Credenciais incorretas

**Sintomas:**
- "Authentication failed"
- "401 Unauthorized"
- Dashboard vazio

**Soluções:**

#### 2.1. Verificar credenciais salvas
1. ⚙️ Configurações
2. Verifique se o email está correto
3. Verifique se a URL do Jira está correta

#### 2.2. Criar novo API Token
1. Acesse: https://id.atlassian.com/manage-profile/security/api-tokens
2. Clique em "Create API token"
3. Copie o novo token
4. Cole nas configurações do Jira Monitor
5. Clique em "Salvar"

#### 2.3. Testar manualmente
```bash
# No Terminal:
curl -u "seu.email@empresa.com:SEU_TOKEN" \
  https://empresa.atlassian.net/rest/api/3/myself
```

**Se funcionar:** Credenciais estão corretas, reconfigure o app  
**Se não funcionar:** Token inválido, crie um novo

---

### Problema 3: Tickets não aparecem

**Sintomas:**
- Dashboard mostra "0" em todos os cards
- Não aparece nenhum ticket

**Causas possíveis:**

#### 3.1. Sem tickets atribuídos
**Verificar:**
1. Abra o Jira no navegador
2. Vá em "Filters" → "Assigned to me"
3. Veja se há tickets

**Se não houver tickets:** Está correto! O dashboard estará vazio mesmo.

#### 3.2. Filtro JQL incorreto
**Verificar:**
1. Abra o Jira no navegador
2. Vá em "Filters" → "Advanced search"
3. Execute: `assignee = currentUser() AND resolution = Unresolved`

**Se retornar tickets:** Problema pode ser na configuração do app

#### 3.3. Permissões insuficientes
**Verificar:**
1. Seu usuário tem acesso ao projeto IT?
2. Seu API Token tem as permissões corretas?

**Solução:**
- Entre em contato com o administrador do Jira
- Solicite acesso ao projeto IT

---

### Problema 4: Alto consumo de memória/CPU

**Sintomas:**
- Ventilador do Mac acelerando
- App lento
- Mac aquecendo

**Soluções:**

#### 4.1. Aumentar intervalo de atualização
1. ⚙️ Configurações
2. Intervalo de Atualização: `120 segundos`
3. Salvar

#### 4.2. Desativar Modo Pro temporariamente
- Clique em 👨‍💻 para desativar
- Modo Pro usa mais recursos

#### 4.3. Limpar cache
```bash
# Fechar app completamente
# Menu Bar → Jira Monitor → Sair

# Limpar cache
rm -rf ~/Library/Application\ Support/jira-monitor/
rm -rf ~/Library/Caches/jira-monitor/

# Iniciar novamente
npm start
```

#### 4.4. Verificar número de tickets
- Se você tem > 500 tickets, é normal uso maior de recursos
- App já limita renderização em 100 tickets por lista
- Considere delegar/resolver tickets antigos

---

### Problema 5: Notificações não aparecem

**Sintomas:**
- Sem notificações de desktop
- Badge do sino não atualiza

**Soluções:**

#### 5.1. Verificar permissões do macOS
1. **System Preferences** → **Notifications**
2. Procure "**Electron**" ou "**Jira Monitor**"
3. Marque **"Allow Notifications"**
4. Configure:
   - Notification Style: **Alerts** (recomendado)
   - Show in Notification Center: **ON**
   - Badge app icon: **ON**

#### 5.2. Verificar config do app
1. ⚙️ Configurações
2. Marque "🔔 Notificações desktop"
3. Marque os tipos desejados:
   - ✅ Novos tickets
   - ✅ Mudanças de status
   - ✅ SLA próximo
   - ✅ Menções
4. Salvar

#### 5.3. Testar notificação
1. ⚙️ Configurações
2. Clique em "Testar" ao lado de "Notificações desktop"
3. Deve aparecer uma notificação de teste

**Se não aparecer:** Problema nas permissões do macOS

---

### Problema 6: SLA Colors não aparecem

**Sintomas:**
- Todos os tickets aparecem sem cor
- Sem indicador de SLA
- Todos em branco/cinza

**Causas:**

#### 6.1. Tickets não são do projeto IT
- SLA Colors **só funciona** para projeto **IT**
- Outros projetos não têm o campo SLA configurado

#### 6.2. Campo SLA não configurado no Jira
**Verificar:**
1. Abra um ticket IT no Jira (navegador)
2. Procure por "Time to resolution"
3. Veja se o campo existe

**Se não existir:**
- Entre em contato com o administrador do Jira
- Solicite configuração de SLA para o projeto IT

#### 6.3. Bug temporário
**Solução:**
- Feche e reabra o app
- Aguarde próxima atualização (60s)

---

## ❓ Perguntas Frequentes (FAQ)

### Geral

**P: O Jira Monitor é oficial do Jira/Atlassian?**  
R: Não. É uma ferramenta desenvolvida internamente pelo Nubank para facilitar o trabalho da equipe IT.

**P: Funciona em Windows/Linux?**  
R: Atualmente não. Apenas macOS. Suporte para outras plataformas está no roadmap.

**P: É seguro? Minhas credenciais ficam onde?**  
R: As credenciais ficam armazenadas localmente no seu Mac (`~/Library/Application Support/jira-monitor/config.json`). Não são enviadas para nenhum servidor externo, apenas para o Jira.

**P: Consome muita bateria?**  
R: Não. Após otimizações, o consumo é mínimo (< 5% CPU em idle). Se notar consumo alto, aumente o intervalo de atualização.

---

### Tickets e SLA

**P: Por que alguns tickets não mostram cor de SLA?**  
R: SLA Colors só funciona para tickets do projeto IT que tenham o campo "Time to resolution" configurado no Jira.

**P: O SLA está diferente do que aparece no Jira**  
R: Pode haver um delay de até 60 segundos (ou o intervalo configurado). Clique em 🔄 para atualizar manualmente.

**P: Posso ver tickets de outros usuários?**  
R: Não diretamente. O app mostra apenas seus tickets (`assignee = currentUser()`). Mas você pode abrir uma janela separada para monitorar outro usuário (Modo Pro → futuro).

**P: Como faço para ver tickets de outros projetos além de IT?**  
R: Atualmente o app é focado no projeto IT. Outros projetos podem ser adicionados futuramente. Por enquanto, você precisa usar o Jira web.

---

### Notificações

**P: Recebo muitas notificações. Como reduzo?**  
R: Vá em ⚙️ Configurações → Notificações e desmarque os tipos menos importantes para você.

**P: Por que não recebo notificação de menções?**  
R: Verifique se "Menções em comentários" está marcado nas configurações. Também verifique as permissões do macOS.

**P: As notificações aparecem mesmo com o app fechado?**  
R: Sim! Desde que você não tenha saído completamente ("Sair" no menu da Menu Bar). Se apenas fechou a janela, o app continua rodando em background.

---

### Modo Pro

**P: O que é Modo Pro?**  
R: São recursos avançados: edição de tickets, comentários, anexos, dashboards e alertas proativos.

**P: Modo Pro consome mais recursos?**  
R: Sim, um pouco mais. Se notar lentidão, desative temporariamente.

**P: Preciso pagar pelo Modo Pro?**  
R: Não! É gratuito. Basta clicar no ícone 👨‍💻.

**P: As edições no Modo Pro afetam o Jira?**  
R: Sim! Tudo que você edita é salvo diretamente no Jira via API. Tenha cuidado!

---

### Técnico

**P: Qual versão do Node.js preciso?**  
R: Node.js 20 ou superior (20, 22, 25, 26+).

**P: Posso usar com Homebrew Node?**  
R: Sim, mas nvm é recomendado por ser mais estável.

**P: Como atualizo o Jira Monitor?**  
R: Execute `git pull` na pasta do projeto e `npm start` novamente. Auto-update virá em versões futuras.

**P: Onde ficam os logs?**  
R: `~/Library/Logs/jira-monitor/` e no console (Cmd+Alt+I).

---

## 📞 Suporte

### Precisa de Ajuda?

Entre em contato pelos canais:

**📧 Email:**
- gabriel.silva.digisystem@nubank.com.br
- yanka.araujo.digisystem@nubank.com.br

**💬 Slack:**
- @GABS SILVA
- @ya (Yanka Dantas)

**🐛 Reportar Bug:**
- https://github.com/gabinubank/jira-monitor/issues

**📚 Documentação:**
- [README.md](README.md) - Visão geral
- [DOCUMENTACAO-TECNICA.md](DOCUMENTACAO-TECNICA.md) - Para desenvolvedores
- [DOCUMENTACAO-COMPLETA.md](DOCUMENTACAO-COMPLETA.md) - Completa

---

## 🎓 Tutoriais em Vídeo

> 💡 **Em breve**: Vídeos tutoriais estarão disponíveis mostrando:
> - Instalação passo a passo
> - Tour pela interface
> - Como usar o Modo Pro
> - Dicas e truques avançados

---

## 📸 Galeria de Screenshots

> 📷 **Onde adicionar screenshots**:
> Crie uma pasta `assets/screenshots/` e adicione:
> - `dashboard.png` - Dashboard principal
> - `configuracao.png` - Tela de configuração
> - `ticket-preview.png` - Preview de ticket
> - `modo-pro.png` - Interface do Modo Pro
> - `notificacoes.png` - Sistema de notificações
> - `menu-bar.png` - Menu da Menu Bar
> - `sla-colors.png` - Exemplos de cores de SLA

---

## ✨ Novidades da Versão 1.6.1

### O que há de novo:

- 🚀 **Otimizações de Performance** (-60% uso de CPU e memória)
- 🎨 **SLA Colors Melhorado** (animação para tickets estourados)
- 🔔 **Sistema de Notificações** redesenhado
- 🖥️ **Menu Bar Inteligente** com emojis coloridos
- ⚡ **Modo Pro** com recursos avançados
- 🌍 **Suporte a Idiomas** (PT-BR, EN, ES)
- 📊 **Dashboard de Performance**
- 🔔 **Alertas Proativos**

Veja o [CHANGELOG.md](CHANGELOG.md) completo.

---

## 🗺️ Próximas Versões

### v1.7.0 (Em breve)
- [ ] Atalhos personalizáveis
- [ ] Temas customizáveis
- [ ] Filtros salvos
- [ ] Exportar relatórios
- [ ] Sons nas notificações

### v2.0.0 (Futuro)
- [ ] Suporte para Windows
- [ ] Suporte para Linux
- [ ] Multi-conta
- [ ] Worklog/Timer
- [ ] Templates de resposta
- [ ] Relatórios de produtividade

---

## 🙏 Agradecimentos

Obrigado por usar o Jira Monitor! 

Este projeto foi desenvolvido com ❤️ pela equipe IT do Nubank para tornar o trabalho com tickets mais eficiente e agradável.

**Equipe:**
- Gabriel Silva (@GABS SILVA)
- Yanka Dantas (@ya)

**Feedback:**
Seu feedback é muito importante! Entre em contato se tiver sugestões, bugs ou ideias de melhorias.

---

**Última atualização**: 09/01/2026  
**Versão**: 1.6.1

---

**Feito com ❤️ e muito ☕ no Nubank! 🚀**
