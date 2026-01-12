# 📊 Menu Bar Inteligente - Jira Monitor

## 🎯 Visão Geral

O **Menu Bar Inteligente** é uma funcionalidade que adiciona um ícone interativo na barra de menu do macOS, permitindo monitorar o status dos seus tickets do Jira em tempo real, sem precisar abrir a janela principal.

---

## ✨ Funcionalidades Principais

### 1. **Indicadores Visuais Múltiplos**

O Menu Bar mostra **todos os estados ativos** simultaneamente através de emojis coloridos:

| Emoji | Significado | Quando aparece |
|-------|-------------|----------------|
| 🔴 | **SLA Vencido** | Quando há pelo menos 1 ticket com SLA vencido |
| 🟡 | **SLA Próximo do Vencimento** | Quando há tickets próximos do vencimento |
| 🟢 | **SLA OK** | Quando há tickets com SLA dentro do prazo |
| ⚪ | **Sem Tickets** | Quando não há tickets ou está desconectado |

**Exemplos de Combinações:**
- `🔴` = Apenas tickets críticos (SLA vencido)
- `🟡🟢` = Tickets em alerta + tickets OK
- `🔴🟡🟢` = Todos os estados presentes
- `🟢` = Todos os tickets estão OK

### 2. **Menu Dropdown Inteligente**

Ao clicar no ícone, um menu detalhado aparece com:

#### 📊 **Resumo no Topo**
- Quantidade total de tickets em cada estado
- Exemplo: "5 ticket(s) OK" ou "1 crítico(s)"

#### 🔴 **Seção: SLA VENCIDO**
- Lista até 5 tickets com SLA vencido
- Mostra: Chave do ticket + Resumo
- Sublabel: Tempo que o SLA está vencido
- **Clique** → Abre o Jira Monitor e foca no ticket

#### 🟡 **Seção: SLA PRÓXIMO DO VENCIMENTO**
- Lista até 5 tickets em alerta
- Mostra: Chave do ticket + Resumo
- Sublabel: Tempo restante até vencer
- **Clique** → Abre o Jira Monitor e foca no ticket

#### 🟢 **Seção: SLA OK**
- Lista até 5 tickets normais
- Mostra: Chave do ticket + Resumo
- Sublabel: Status do SLA
- **Clique** → Abre o Jira Monitor e foca no ticket

#### 🚀 **Ações Rápidas**
- **📊 Abrir Jira Monitor** → Abre/restaura a janela principal
- **🔄 Atualizar Agora** → Força atualização manual dos dados

#### 🧪 **Testar Cores** (Menu de Debug)
Submenu para testar diferentes estados visuais:
- 🔴 Vermelho (SLA Vencido)
- 🟡 Amarelo (Próximo do Vencimento)
- 🟢 Verde (SLA OK)
- ⚪ Cinza (Sem Dados)
- 🔴🟡 Crítico + Alerta
- 🔴🟢 Crítico + OK
- 🟡🟢 Alerta + OK
- 🔴🟡🟢 Todos os Estados
- ♻️ Voltar ao Normal

#### ⚙️ **Configurações e Controles**
- **⚙️ Configurações** → Abre as configurações do Jira Monitor
- **🚪 Sair** → Fecha completamente o aplicativo

### 3. **Foco Inteligente em Tickets**

Quando você clica em um ticket específico no menu:

1. **Se a janela estiver aberta:**
   - Traz a janela para frente
   - Faz scroll automático até o ticket
   - Destaca o ticket com animação visual

2. **Se a janela estiver fechada:**
   - Recria a janela automaticamente
   - Aguarda os dados do Jira carregarem
   - Foca automaticamente no ticket clicado
   - Aplica destaque visual

### 4. **Atualização em Tempo Real**

O Menu Bar é atualizado automaticamente sempre que:
- Novos dados do Jira são carregados
- Status de SLA de tickets muda
- Tickets são adicionados ou removidos
- Você força uma atualização manual

---

## 🎨 Estados Visuais Detalhados

### Lógica de Prioridade

O sistema mostra **TODOS** os indicadores ativos, não apenas o mais crítico:

```
Tem críticos? → Adiciona 🔴
Tem alertas?  → Adiciona 🟡
Tem normais?  → Adiciona 🟢
Nenhum?       → Mostra ⚪
```

### Exemplos Reais

#### Cenário 1: Tudo sob controle
```
Menu Bar: 🟢
Tooltip: "Jira Monitor - 5 tickets OK"
```

#### Cenário 2: Situação crítica
```
Menu Bar: 🔴🟡🟢
Tooltip: "Jira Monitor - 2 críticos, 1 alerta, 3 normais"

Menu:
├─ 📊 2 crítico(s)
├─ 🔴 SLA VENCIDO
│  ├─ IT-12345: Bug crítico
│  └─ IT-12350: Falha no login
├─ 🟡 SLA PRÓXIMO DO VENCIMENTO
│  └─ IT-12346: Feature importante
└─ 🟢 SLA OK (3)
   ├─ IT-12347: Tarefa normal
   ├─ IT-12348: Melhoria UI
   └─ IT-12349: Documentação
```

#### Cenário 3: Sem tickets
```
Menu Bar: ⚪
Tooltip: "Jira Monitor - Sem tickets"
```

---

## 🛠️ Como Usar

### Uso Básico

1. **Monitorar Status**
   - Olhe para o Menu Bar
   - Veja os emojis coloridos para saber o estado geral

2. **Ver Detalhes**
   - Clique no ícone do Menu Bar
   - Menu dropdown aparece automaticamente

3. **Focar em Ticket Específico**
   - Abra o menu
   - Clique no ticket desejado
   - Jira Monitor abre e foca no ticket

4. **Atualizar Manualmente**
   - Abra o menu
   - Clique em "🔄 Atualizar Agora"

### Dicas de Uso

- 💡 **Tooltip informativo**: Passe o mouse sobre o ícone para ver resumo rápido
- 💡 **Mais de 5 tickets**: Link "... e mais X" abre a janela principal
- 💡 **Janela fechada**: O Menu Bar continua funcionando normalmente
- 💡 **Modo de teste**: Use "🧪 Testar Cores" para demonstrar para equipe

---

## 🔧 Detalhes Técnicos

### Arquitetura

```
┌─────────────────────────────────────────┐
│          Electron Main Process          │
├─────────────────────────────────────────┤
│  main.js                                │
│  ├─ createWindow()                      │
│  ├─ createTray()                        │
│  └─ IPC Handlers                        │
│     └─ update-tray-tickets              │
├─────────────────────────────────────────┤
│  tray-manager.js                        │
│  ├─ updateTickets()  ← Recebe dados    │
│  ├─ updateIcon()     ← Atualiza emoji  │
│  ├─ updateMenu()     ← Reconstrói menu │
│  └─ openTicket()     ← Foca em ticket  │
└─────────────────────────────────────────┘
                  ↕
         IPC Communication
                  ↕
┌─────────────────────────────────────────┐
│        Electron Renderer Process        │
├─────────────────────────────────────────┤
│  renderer.js                            │
│  ├─ fetchTickets()                      │
│  ├─ sendTicketsToTray()                 │
│  └─ focusAndHighlightTicket()           │
└─────────────────────────────────────────┘
```

### Comunicação IPC

#### Main → Renderer
```javascript
// Focar em ticket específico
mainWindow.webContents.send('focus-ticket', ticketKey);

// Abrir configurações
mainWindow.webContents.send('open-config-from-tray');

// Forçar atualização manual
mainWindow.webContents.send('manual-refresh');
```

#### Renderer → Main
```javascript
// Enviar dados dos tickets para o tray
ipcRenderer.send('update-tray-tickets', {
  critical: [...],
  warning: [...],
  normal: [...]
});
```

### Estrutura de Dados

```javascript
ticketsData = {
  critical: [
    {
      key: 'IT-12345',
      summary: 'Bug crítico no login',
      slaInfo: 'Vencido há 2h'
    }
  ],
  warning: [
    {
      key: 'IT-12346',
      summary: 'Feature importante',
      slaInfo: 'Estoura em 30min'
    }
  ],
  normal: [
    {
      key: 'IT-12347',
      summary: 'Tarefa de documentação',
      slaInfo: 'SLA OK - 2d restantes'
    }
  ]
}
```

### Fluxo de Atualização

```
1. renderer.js fetches Jira data
2. renderer.js categorizes tickets (critical/warning/normal)
3. renderer.js sends to main via IPC
4. tray-manager.js receives data
5. tray-manager.js updates icon emoji
6. tray-manager.js rebuilds menu
7. User sees updated status
```

### Fluxo de Foco em Ticket

**Janela Aberta:**
```
1. User clicks ticket in menu
2. openTicket() called
3. showMainWindow() brings window to front
4. IPC 'focus-ticket' sent (100ms delay)
5. renderer.js scrolls to ticket
6. Visual highlight applied
```

**Janela Fechada:**
```
1. User clicks ticket in menu
2. ticketKey stored in pendingTicketFocus
3. createWindow() recreates window
4. Window loads HTML
5. renderer.js fetches Jira data
6. Data sent via 'update-tray-tickets'
7. Main detects pendingTicketFocus
8. IPC 'focus-ticket' sent (500ms delay)
9. renderer.js scrolls to ticket
10. Visual highlight applied
```

---

## 🧪 Como Testar

### Teste Completo de Funcionalidades

#### 1. **Teste de Indicadores Visuais**
```bash
# Iniciar aplicativo
cd "/Users/gabriel.silva.digisystem/jira monitor"
./node_modules/.bin/electron .

# No Menu Bar, clicar no ícone
# Ir em: 🧪 Testar Cores
# Testar cada opção:
- 🔴 Vermelho → Deve mostrar apenas 🔴
- 🟡 Amarelo → Deve mostrar apenas 🟡
- 🟢 Verde → Deve mostrar apenas 🟢
- 🔴🟡🟢 Todos → Deve mostrar 🔴🟡🟢
```

#### 2. **Teste de Foco com Janela Aberta**
```
1. Manter janela aberta
2. Clicar no Menu Bar
3. Clicar em qualquer ticket
4. ✅ Deve focar no ticket imediatamente
```

#### 3. **Teste de Foco com Janela Fechada**
```
1. Fechar janela (X)
2. Clicar no Menu Bar
3. Clicar em qualquer ticket
4. ✅ Janela deve reabrir
5. ✅ Dados devem carregar
6. ✅ Ticket deve ser focado automaticamente
```

#### 4. **Teste de Atualização em Tempo Real**
```
1. Deixar aplicativo rodando
2. Aguardar intervalo de atualização (15min)
3. ✅ Menu Bar deve atualizar automaticamente
```

#### 5. **Teste de Múltiplos Estados**
```
# Usar tickets reais ou menu de teste
1. Ter tickets em estados diferentes
2. ✅ Verificar se todos os emojis aparecem
3. ✅ Verificar se menu mostra todas as seções
```

---

## 📝 Notas de Desenvolvimento

### Decisões de Design

1. **Por que múltiplos emojis em vez de um só?**
   - Fornece mais informações de relance
   - Usuário vê todos os estados simultaneamente
   - Não precisa abrir o menu para saber situação completa

2. **Por que não mudar a cor do ícone base?**
   - Emojis são mais visíveis e universais
   - macOS Template Images são limitadas (só preto/branco)
   - Solução atual funciona em light e dark mode

3. **Por que aguardar dados antes de focar ticket?**
   - Evita erro ao tentar focar em ticket não carregado
   - Garante experiência suave e confiável
   - Sistema inteligente detecta quando janela foi recriada

### Limitações Conhecidas

1. **macOS específico**: Funcionalidade desenvolvida e testada apenas para macOS
2. **Emoji visibility**: Depende das fontes do sistema
3. **Delay no foco**: 500ms-1500ms quando janela é recriada (necessário para carregar dados)

### Possíveis Melhorias Futuras

- [ ] Adicionar notificações quando SLA estourar
- [ ] Badge numérico no ícone (quantidade de tickets críticos)
- [ ] Atalhos de teclado para ações rápidas
- [ ] Tooltip com mais informações (nome do projeto, etc)
- [ ] Suporte para Windows/Linux
- [ ] Sons de alerta para tickets críticos
- [ ] Filtros personalizáveis no menu

---

## 🎓 Referências

### APIs Utilizadas

- **Electron Tray API**: [docs](https://www.electronjs.org/docs/latest/api/tray)
- **Electron Menu API**: [docs](https://www.electronjs.org/docs/latest/api/menu)
- **Electron IPC**: [docs](https://www.electronjs.org/docs/latest/api/ipc-main)
- **Electron NativeImage**: [docs](https://www.electronjs.org/docs/latest/api/native-image)

### Arquivos Relacionados

- `tray-manager.js` - Lógica principal do Menu Bar
- `main.js` - Integração com Electron
- `renderer.js` - Envio de dados e foco em tickets
- `styles.css` - Estilos de destaque visual

---

## ✅ Checklist de Funcionalidades

- [x] Ícone visível na Menu Bar
- [x] Múltiplos indicadores visuais (🔴🟡🟢)
- [x] Menu dropdown categorizado
- [x] Seção SLA Vencido
- [x] Seção SLA Próximo do Vencimento
- [x] Seção SLA OK
- [x] Clicar em ticket abre e foca
- [x] Funciona com janela fechada
- [x] Recria janela automaticamente
- [x] Aguarda dados antes de focar
- [x] Scroll automático para ticket
- [x] Destaque visual com animação
- [x] Atualização em tempo real
- [x] Menu de teste de cores
- [x] Botão de atualizar agora
- [x] Tooltip informativo
- [x] Ações rápidas (abrir, configurar, sair)

---

## 📞 Suporte

Se encontrar problemas ou bugs:

1. Verificar logs no terminal
2. Testar com "🧪 Testar Cores"
3. Verificar se dados do Jira estão carregando
4. Reiniciar aplicativo

**Logs importantes:**
```
🎨 Ícone atualizado: [emoji] ([quantidade de tickets])
🔄 Tray atualizado: { critical: X, warning: Y, normal: Z }
🎯 Focando no ticket: [ticket-key]
⏳ Janela foi recriada, aguardando carregamento...
```

---

**✨ Menu Bar Inteligente - Desenvolvido para o Jira Monitor**

*Última atualização: Janeiro 2026*
