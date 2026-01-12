# 📸 Guia de Screenshots - Jira Monitor

> **Lista de screenshots necessários para complementar as documentações**

---

## 📁 Estrutura de Pastas

Crie a seguinte estrutura para organizar os screenshots:

```
assets/
└── screenshots/
    ├── 01-instalacao/
    ├── 02-configuracao/
    ├── 03-dashboard/
    ├── 04-tickets/
    ├── 05-sla-colors/
    ├── 06-notificacoes/
    ├── 07-modo-pro/
    ├── 08-menu-bar/
    └── 09-diversos/
```

---

## 📋 Lista de Screenshots Necessários

### 1. Instalação (`01-instalacao/`)

#### `instalacao-terminal.png`
- **O que mostrar**: Terminal executando `npm install`
- **Quando tirar**: Durante a instalação das dependências
- **Resolução**: 1200x800 pixels
- **Formato**: PNG

#### `primeira-execucao.png`
- **O que mostrar**: Janela abrindo pela primeira vez
- **Quando tirar**: Ao executar `npm start` pela primeira vez
- **Destacar**: Loading inicial

---

### 2. Configuração (`02-configuracao/`)

#### `tela-configuracao-vazia.png`
- **O que mostrar**: Modal de configuração sem dados preenchidos
- **Campos visíveis**:
  - URL do Jira (vazio)
  - Email (vazio)
  - API Token (vazio)
  - Intervalo de Atualização (padrão: 60)
- **Destacar**: Botão "Criar API Token"

#### `tela-configuracao-preenchida.png`
- **O que mostrar**: Modal com dados preenchidos (usar dados fictícios)
- **Exemplo**:
  ```
  URL: https://empresa.atlassian.net
  Email: joao.silva@empresa.com
  API Token: ••••••••••••
  Intervalo: 60 segundos
  ```
- **Destacar**: Botão "Salvar"

#### `jira-api-token-page.png`
- **O que mostrar**: Página do Atlassian para criar API token
- **URL**: https://id.atlassian.com/manage-profile/security/api-tokens
- **Destacar**: Botão "Create API token"

#### `jira-api-token-criado.png`
- **O que mostrar**: Modal com o token gerado
- **Destacar**: Campo com o token (pode censurar parte)
- **Destacar**: Aviso "Copie agora, não será mostrado novamente"

---

### 3. Dashboard (`03-dashboard/`)

#### `dashboard-completo.png`
- **O que mostrar**: Dashboard com todos os 4 cards visíveis
- **Dados exemplo**:
  ```
  Total: 24 tickets
  Waiting for Support: 8 tickets
  Waiting for Customer: 12 tickets
  Tickets Pending: 4 tickets
  ```
- **Resolução**: Capturar janela inteira

#### `dashboard-cards-expandidos.png`
- **O que mostrar**: Um card expandido mostrando lista de tickets
- **Usar**: Card "Total de Tickets"
- **Mostrar**: Pelo menos 5 tickets na lista

#### `dashboard-vazio.png`
- **O que mostrar**: Dashboard sem tickets
- **Útil para**: Documentar estado inicial ou sem tickets

#### `header-completo.png`
- **O que mostrar**: Barra superior (header) com todos os ícones
- **Destacar**:
  - Menu (☰)
  - Notificações (🔔)
  - Documentação (📄)
  - Configurações (⚙️)
  - Modo Pro (👨‍💻)
  - Minimizar (−)
  - Fechar (✕)

---

### 4. Tickets (`04-tickets/`)

#### `ticket-item-normal.png`
- **O que mostrar**: Um item de ticket na lista (sem SLA especial)
- **Conteúdo**:
  ```
  IT-12345
  Configurar novo usuário no sistema
  Status: In Progress
  ```

#### `ticket-hover.png`
- **O que mostrar**: Ticket com mouse hover (efeito visual)
- **Destacar**: Mudança de cor/sombra

#### `lista-tickets-completa.png`
- **O que mostrar**: Lista com vários tickets (mínimo 10)
- **Incluir**: Tickets com diferentes status e cores

#### `ticket-preview-simples.png`
- **O que mostrar**: Modal de preview de ticket (modo normal, sem Modo Pro)
- **Conteúdo**:
  - Key: IT-12345
  - Summary
  - Description
  - Status
  - Assignee
  - Created/Updated

---

### 5. SLA Colors (`05-sla-colors/`)

#### `sla-verde.png`
- **O que mostrar**: Ticket com SLA verde (> 3h)
- **Destacar**:
  - Borda verde
  - Background levemente verde
  - Indicador: 🟢 5h 30min restantes

#### `sla-amarelo.png`
- **O que mostrar**: Ticket com SLA amarelo (1-3h)
- **Destacar**:
  - Borda amarela
  - Background levemente amarelo
  - Sombra amarela
  - Indicador: 🟡 2h 15min restantes

#### `sla-vermelho.png`
- **O que mostrar**: Ticket com SLA vermelho crítico (< 1h)
- **Destacar**:
  - Borda vermelha
  - Background levemente vermelho
  - Sombra vermelha intensa
  - Indicador: 🔴 45min restantes

#### `sla-vermelho-vencido.png`
- **O que mostrar**: Ticket com SLA vencido (pulsante)
- **Destacar**:
  - Borda vermelha
  - Background vermelho mais intenso
  - Animação pulsante (tirar screenshot no momento do pulse)
  - Indicador: 🔴 VENCIDO há 30min

#### `comparacao-slas.png`
- **O que mostrar**: 4 tickets lado a lado com diferentes SLAs
- **Layout**:
  ```
  🟢 Verde    🟡 Amarelo
  🔴 Crítico  🔴 Vencido
  ```

---

### 6. Notificações (`06-notificacoes/`)

#### `notificacao-desktop.png`
- **O que mostrar**: Notificação nativa do macOS
- **Localização**: Canto superior direito da tela
- **Conteúdo exemplo**:
  ```
  🎫 Jira Monitor
  
  Novo Ticket: IT-12345
  Solicitação de reset de senha
  
  há 2 segundos
  ```

#### `notificacoes-badge.png`
- **O que mostrar**: Ícone de notificações com badge vermelho
- **Badge**: Número (ex: 3)

#### `notificacoes-dropdown.png`
- **O que mostrar**: Dropdown de notificações aberto
- **Conteúdo**: Pelo menos 5 notificações de diferentes tipos
- **Tipos**:
  - 💬 Comentário
  - 🔴 SLA Crítico
  - ✅ Status Mudou
  - 🎫 Novo Ticket
  - 📢 Menção

#### `notificacao-vazia.png`
- **O que mostrar**: Dropdown sem notificações
- **Mensagem**: "Nenhuma notificação no momento"

---

### 7. Modo Pro (`07-modo-pro/`)

#### `modo-pro-ativacao.png`
- **O que mostrar**: Ícone 👨‍💻 destacado (ativo)
- **Efeito**: Borda/cor diferente quando ativo

#### `atividade-hoje.png`
- **O que mostrar**: Card de "Atividade de Hoje"
- **Conteúdo**:
  ```
  🆕 Recebidos: 5
  ✅ Fechados: 8
  💬 Comentários: 12
  ```

#### `atividade-hoje-expandido.png`
- **O que mostrar**: Atividade expandida com detalhes
- **Mostrar**: Listas de tickets recebidos, fechados e comentários

#### `telefonia-simcards.png`
- **O que mostrar**: Seção de Telefonia SIM cards
- **Conteúdo**:
  - Contador de tickets
  - Botões: MVE, Controle de SIMCARD

#### `tickets-avaliados.png`
- **O que mostrar**: Lista de tickets avaliados
- **Conteúdo**:
  ```
  IT-12345 ⭐⭐⭐⭐⭐ (há 2 dias)
  IT-12346 ⭐⭐⭐⭐   (há 3 dias)
  IT-12347 ⭐⭐⭐     (há 5 dias)
  ```

#### `dashboard-performance.png`
- **O que mostrar**: Dashboard de Performance (recolhido)
- **Métricas visíveis**:
  - Tempo Médio: 4.5 horas
  - Resolvidos: 87 tickets
  - Por Semana: 12 tickets/sem

#### `dashboard-performance-expandido.png`
- **O que mostrar**: Dashboard expandido
- **Incluir**:
  - Gráficos por prioridade
  - Gráficos por projeto
  - Heatmap de atividade
  - Lista de últimos resolvidos

#### `alertas-proativos.png`
- **O que mostrar**: Seção de Alertas Proativos
- **Conteúdo**:
  - ⚠️ Tickets sem resposta (3)
  - 🚨 SLA Crítico (2)
  - 💬 Menções (1)

#### `ticket-preview-modo-pro.png`
- **O que mostrar**: Preview de ticket com recursos Pro
- **Destacar**:
  - Campos editáveis
  - Botão "Salvar Alterações"
  - Área de comentários
  - Área de anexos

#### `editar-campos.png`
- **O que mostrar**: Campo sendo editado (ex: Priority com dropdown)

#### `adicionar-comentario.png`
- **O que mostrar**: Área de comentário com:
  - Campo de texto preenchido
  - Checkbox "Comentário interno"
  - Botão "Adicionar Comentário"

#### `mencoes-autocomplete.png`
- **O que mostrar**: Autocomplete de menções
- **Conteúdo**: Lista de usuários após digitar @
- **Exemplo**:
  ```
  @jo
  
  → João Silva
  → João Pedro
  → Joaquim Santos
  ```

#### `anexos.png`
- **O que mostrar**: Lista de anexos de um ticket
- **Conteúdo**:
  ```
  📎 Anexos (3)
  
  screenshot.png         2.3 MB
  log_error.txt          45 KB
  documento.pdf          1.8 MB
  
  [📎 Adicionar Anexo]
  ```

---

### 8. Menu Bar (`08-menu-bar/`)

#### `menu-bar-icon.png`
- **O que mostrar**: Ícone na Menu Bar do macOS
- **Destacar**: Emojis coloridos (🔴🟡🟢)
- **Contexto**: Capturar parte da barra superior do macOS

#### `menu-bar-dropdown.png`
- **O que mostrar**: Menu dropdown completo
- **Conteúdo**:
  - Status resumido
  - Tickets críticos (🔴)
  - Tickets em alerta (🟡)
  - Tickets OK (🟢)
  - Ações (Abrir, Atualizar, Sair)

#### `menu-bar-teste-cores.png`
- **O que mostrar**: Submenu "Testar Cores"
- **Conteúdo**:
  - 🔴 Vermelho
  - 🟡 Amarelo
  - 🟢 Verde
  - ⚪ Cinza
  - Combinações

#### `menu-bar-vermelho.png`
- **O que mostrar**: Ícone vermelho (SLA vencido)
- **Emoji**: 🔴

#### `menu-bar-amarelo.png`
- **O que mostrar**: Ícone amarelo (SLA próximo)
- **Emoji**: 🟡

#### `menu-bar-verde.png`
- **O que mostrar**: Ícone verde (tudo OK)
- **Emoji**: 🟢

#### `menu-bar-multiplo.png`
- **O que mostrar**: Ícone com múltiplos estados
- **Emojis**: 🔴🟡🟢

---

### 9. Diversos (`09-diversos/`)

#### `busca-rapida.png`
- **O que mostrar**: Modal de busca rápida (Cmd+K)
- **Conteúdo**:
  - Campo de busca ativo
  - Resultados abaixo
  - Hint: "↑↓ para navegar"

#### `busca-resultados.png`
- **O que mostrar**: Resultados da busca
- **Exemplo**: Busca por "login"
- **Mostrar**: 5-10 resultados

#### `atalhos-teclado.png`
- **O que mostrar**: Modal de atalhos de teclado
- **Conteúdo**: Lista de todos os atalhos
- **Organização**: Por categoria

#### `modo-densidade.png`
- **O que mostrar**: Diferentes modos de densidade
- **Criar**: 3 screenshots
  - Compacto
  - Confortável (padrão)
  - Espaçoso

#### `layout-vertical.png`
- **O que mostrar**: Layout vertical (padrão)
- **Cards**: Empilhados verticalmente

#### `layout-horizontal.png`
- **O que mostrar**: Layout horizontal
- **Cards**: Lado a lado

#### `loading-skeleton.png`
- **O que mostrar**: Estado de loading com skeleton screens

#### `erro-conexao.png`
- **O que mostrar**: Banner de erro de conexão
- **Mensagem**: "Não foi possível conectar ao Jira"

#### `janela-transparente.png`
- **O que mostrar**: Janela com opacidade reduzida (slider de opacidade)

---

## 🎨 Diretrizes de Captura

### Configurações Gerais

```yaml
Resolução:
  Desktop: 2560x1600 (Retina)
  Janela: 420x700 (tamanho padrão)
  
Formato: PNG

Qualidade: Alta (sem compressão)

Background:
  - Capture em desktop limpo
  - Ou use blur no fundo
  - Evite informações confidenciais
```

### Dados Fictícios

Use sempre dados fictícios para screenshots:

```yaml
Usuário:
  Nome: João Silva
  Email: joao.silva@empresa.com

Tickets:
  Keys: IT-12345, IT-12346, IT-12347...
  Summaries: Genéricos (ex: "Bug no sistema", "Configurar usuário")

Times:
  - TechCenter
  - Infrastructure
  - Security
```

### Anotações

Para screenshots instrutivos, use ferramentas de anotação:

**Ferramentas recomendadas:**
- **Skitch** (macOS) - Setas, texto, destaques
- **CleanShot X** (macOS) - Profissional
- **Annotate** (macOS) - Simples

**Elementos:**
- 🔴 Círculos vermelhos para destacar
- ➡️ Setas para indicar ação
- 📝 Caixas de texto para explicações
- ✨ Destaques amarelos para chamar atenção

---

## 📐 Templates de Anotação

### Template: Destaque de Funcionalidade

```
┌─────────────────────────────────┐
│                                 │
│     ┌────────────┐              │
│     │ 👈 Clique  │              │
│     └────────────┘              │
│           │                     │
│           ▼                     │
│      [ Elemento ]               │
│                                 │
└─────────────────────────────────┘
```

### Template: Sequência de Passos

```
① Passo 1: Abra configurações
② Passo 2: Preencha os campos
③ Passo 3: Clique em Salvar
```

### Template: Comparação Antes/Depois

```
┌───────────┐      ┌───────────┐
│   ANTES   │  →   │   DEPOIS  │
└───────────┘      └───────────┘
```

---

## 🔄 Processo de Captura

### Workflow Recomendado

1. **Preparar Ambiente**
   ```bash
   # Abrir Jira Monitor
   cd ~/dev/nu/jira-monitor
   npm start
   
   # Limpar desktop
   # Ocultar ícones (Cmd+Shift+.)
   ```

2. **Configurar App**
   - Use dados fictícios
   - Popule com tickets de exemplo
   - Ajuste zoom se necessário

3. **Capturar Screenshots**
   ```
   # macOS nativo
   Cmd+Shift+4 → Selecionar área
   Cmd+Shift+4 → Espaço → Janela completa
   ```

4. **Organizar Arquivos**
   ```bash
   # Renomear com nomes descritivos
   mv Screenshot\ 2026-01-09\ at\ 10.30.15.png dashboard-completo.png
   
   # Mover para pasta correta
   mv dashboard-completo.png assets/screenshots/03-dashboard/
   ```

5. **Anotar (se necessário)**
   - Abrir no Skitch/CleanShot
   - Adicionar anotações
   - Salvar com sufixo `-annotated`

6. **Revisar**
   - Verificar qualidade
   - Verificar se não há dados sensíveis
   - Verificar se está na pasta correta

---

## ✅ Checklist Final

Antes de considerar completo:

### Screenshots Principais
- [ ] Tela de configuração
- [ ] Dashboard completo
- [ ] Todos os 4 tipos de SLA Colors
- [ ] Notificação desktop
- [ ] Notificações in-app
- [ ] Menu Bar com dropdown
- [ ] Modo Pro ativado
- [ ] Ticket preview (normal e Pro)

### Screenshots de Funcionalidades
- [ ] Busca rápida
- [ ] Atalhos de teclado
- [ ] Edição de campos
- [ ] Adicionar comentário
- [ ] Menções (@)
- [ ] Anexos
- [ ] Dashboard de Performance
- [ ] Alertas Proativos

### Screenshots de Estados
- [ ] Loading
- [ ] Vazio (sem tickets)
- [ ] Erro de conexão
- [ ] Diferentes densidades
- [ ] Diferentes layouts

---

## 📤 Compartilhamento

### Onde usar os screenshots:

1. **Documentação**
   - Inserir nas documentações Markdown
   - Sintaxe: `![Alt text](assets/screenshots/pasta/arquivo.png)`

2. **README**
   - Hero image no topo
   - Seção de features com screenshots

3. **Apresentações**
   - Google Slides
   - Keynote

4. **Treinamentos**
   - Materiais de onboarding
   - Tutoriais em vídeo

---

## 🎬 Gravação de Tela

Além de screenshots, considere gravar:

### GIFs Demonstrativos

**Ferramentas:**
- **LICEcap** (gratuito, simples)
- **Kap** (gratuito, macOS)
- **CleanShot X** (pago, profissional)

**O que gravar:**
- Fluxo completo de configuração (30s)
- Interação com tickets (15s)
- SLA Colors em ação (10s)
- Menu Bar dropdown (5s)
- Notificações aparecendo (10s)
- Modo Pro em uso (30s)

**Configurações:**
```yaml
Resolução: 1280x720
FPS: 30
Duração máxima: 30 segundos
Formato: GIF ou MP4
```

---

## 📊 Estatísticas

**Estimativa de tempo:**
- Preparação: 30 minutos
- Captura: 2-3 horas
- Anotação: 1-2 horas
- Revisão: 30 minutos
- **Total**: 4-6 horas

**Estimativa de arquivos:**
- Screenshots básicos: 40-50 arquivos
- Screenshots anotados: 10-15 arquivos
- GIFs: 5-8 arquivos
- **Total**: ~60-70 arquivos
- **Tamanho**: ~50-100 MB

---

## 🤝 Contribuindo

Se você tirou screenshots e quer adicionar ao projeto:

1. Siga as diretrizes deste guia
2. Use dados fictícios
3. Organize nas pastas corretas
4. Crie um PR com os screenshots
5. Descreva o que cada screenshot mostra

---

**Última atualização**: 09/01/2026  
**Versão**: 1.0

---

**Feito com 📸 e atenção aos detalhes! 🎯**
