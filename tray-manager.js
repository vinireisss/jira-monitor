// Não importar electron no topo - fazer lazy loading
let Tray, Menu, nativeImage;

// Importar ícones
const { RED_ICON, YELLOW_ICON, GREEN_ICON, GRAY_ICON } = require('./tray-icon-generator');

class TrayManager {
  constructor(mainWindow, recreateWindowFn, options = {}) {
    this.mainWindow = mainWindow;
    this.recreateWindowFn = recreateWindowFn; // Função para recriar a janela se destruída
    this.onCheckForUpdates = options.onCheckForUpdates || null; // Callback para verificar atualizações
    this.tray = null;
    this.ticketsData = {
      critical: [], // Tickets com SLA estourado
      warning: [],  // Tickets próximos de estourar
      normal: []    // Tickets no prazo
    };
    this.totalCritical = 0;
    
    // Lazy load electron modules
    if (!Tray) {
      const electron = require('electron');
      Tray = electron.Tray;
      Menu = electron.Menu;
      nativeImage = electron.nativeImage;
    }
  }

  /**
   * Inicializa o Tray na Menu Bar
   */
  create() {
    // Criar ícone inicial usando texto que sempre funciona
    const icon = this.createTextIcon('○', 'white');
    
    this.tray = new Tray(icon);
    this.tray.setToolTip('Jira Monitor - Carregando...');
    this.updateMenu();
    
    // Clicar no ícone abre/foca a janela principal
    // No macOS, o menu aparece automaticamente ao clicar
    // Não precisamos abrir a janela aqui, apenas ao clicar em tickets específicos
    
    console.log('✅ Tray Manager inicializado na Menu Bar');
    console.log('📍 Ícone:', icon.isEmpty() ? 'VAZIO!' : `${icon.getSize().width}x${icon.getSize().height}`);
  }
  
  /**
   * Cria um ícone colorido usando PNG base64 (garantido funcionar no macOS!)
   */
  createTextIcon(text, color) {
    const path = require('path');
    
    // SOLUÇÃO FINAL: Usar o ícone do Jira Monitor (sem texto/emoji aqui)
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    let image = nativeImage.createFromPath(iconPath);
    image = image.resize({ width: 16, height: 16 });
    
    return image;
  }
  
  /**
   * Cria um ícone colorido usando apenas o logo do Jira Monitor
   * Por enquanto usa o mesmo ícone para todos (roxo do Jira)
   * TODO: Criar variações coloridas ou overlay
   */
  createColoredIcon(color) {
    const path = require('path');
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    
    let image = nativeImage.createFromPath(iconPath);
    image = image.resize({ width: 16, height: 16 });
    
    console.log(`🎨 Ícone fallback criado para: ${color}`);
    return image;
  }

  /**
   * Atualiza os dados dos tickets e reconstrói o menu
   * @param {Object} ticketsData - { critical: [], warning: [], normal: [] }
   */
  updateTickets(ticketsData) {
    this.ticketsData = ticketsData || { critical: [], warning: [], normal: [] };
    this.totalCritical = this.ticketsData.critical.length;
    
    // Atualizar ícone baseado no status mais crítico
    this.updateIcon();
    
    // Atualizar tooltip
    this.updateTooltip();
    
    // Reconstruir menu
    this.updateMenu();
    
    console.log('🔄 Tray atualizado:', {
      critical: this.ticketsData.critical.length,
      warning: this.ticketsData.warning.length,
      normal: this.ticketsData.normal.length
    });
  }

  /**
   * Atualiza o ícone baseado no status dos tickets
   * Mostra TODOS os indicadores ativos (vermelho + amarelo + verde)
   */
  updateIcon() {
    if (!this.tray) return;
    
    const totalTickets = this.ticketsData.critical.length + 
                        this.ticketsData.warning.length + 
                        this.ticketsData.normal.length;
    
    // Construir string com TODOS os emojis ativos
    let emojis = '';
    
    if (this.ticketsData.critical.length > 0) {
      emojis += '🔴'; // Vermelho para críticos
    }
    
    if (this.ticketsData.warning.length > 0) {
      emojis += '🟡'; // Amarelo para alertas
    }
    
    if (this.ticketsData.normal.length > 0) {
      emojis += '🟢'; // Verde para OK
    }
    
    if (totalTickets === 0) {
      emojis = '⚪'; // Cinza se não tiver nenhum ticket
    }
    
    // Definir cor do ícone base (usa a mais crítica para manter compatibilidade)
    let iconColor = 'white';
    if (this.ticketsData.critical.length > 0) {
      iconColor = 'red';
    } else if (this.ticketsData.warning.length > 0) {
      iconColor = 'yellow';
    } else if (totalTickets > 0) {
      iconColor = 'green';
    }
    
    // Atualizar ícone e emojis visíveis
    const icon = this.createTextIcon('●', iconColor);
    this.tray.setImage(icon);
    this.tray.setTitle(emojis);
    
    console.log(`🎨 Ícone atualizado: ${emojis} (${this.ticketsData.critical.length} crítico, ${this.ticketsData.warning.length} alerta, ${this.ticketsData.normal.length} OK)`);
  }

  /**
   * Atualiza o tooltip do ícone
   */
  updateTooltip() {
    if (!this.tray) return;
    
    const total = this.ticketsData.critical.length + 
                  this.ticketsData.warning.length + 
                  this.ticketsData.normal.length;
    
    let tooltip = 'Jira Monitor';
    
    if (this.ticketsData.critical.length > 0) {
      tooltip += `\n🔴 ${this.ticketsData.critical.length} ticket(s) com SLA vencido`;
    }
    if (this.ticketsData.warning.length > 0) {
      tooltip += `\n🟡 ${this.ticketsData.warning.length} ticket(s) próximo do vencimento`;
    }
    if (total === 0) {
      tooltip += '\n✅ Nenhum ticket crítico';
    }
    
    this.tray.setToolTip(tooltip);
  }

  /**
   * Reconstrói o menu dropdown
   */
  updateMenu() {
    if (!this.tray) return;
    
    const menuTemplate = [];
    
    // Status resumido no topo
    const totalTickets = this.ticketsData.critical.length + 
                        this.ticketsData.warning.length + 
                        this.ticketsData.normal.length;
    
    if (totalTickets === 0) {
      menuTemplate.push({
        label: '✅ Sem tickets no momento',
        enabled: false
      });
    } else {
      let statusText = '📊 ';
      if (this.ticketsData.critical.length > 0) {
        statusText += `${this.ticketsData.critical.length} crítico(s)`;
      } else if (this.ticketsData.warning.length > 0) {
        statusText += `${this.ticketsData.warning.length} em alerta`;
      } else {
        statusText += `${totalTickets} ticket(s) no prazo`;
      }
      
      menuTemplate.push({
        label: statusText,
        enabled: false
      });
    }
    
    menuTemplate.push({ type: 'separator' });
    
    // Tickets críticos (SLA estourado)
    if (this.ticketsData.critical.length > 0) {
      menuTemplate.push({
        label: '🔴 SLA VENCIDO',
        enabled: false
      });
      
      this.ticketsData.critical.slice(0, 5).forEach(ticket => {
        menuTemplate.push({
          label: `   ${ticket.key}: ${this.truncate(ticket.summary, 40)}`,
          sublabel: ticket.slaInfo || '',
          click: () => this.openTicket(ticket.key)
        });
      });
      
      if (this.ticketsData.critical.length > 5) {
        menuTemplate.push({
          label: `   ... e mais ${this.ticketsData.critical.length - 5}`,
          click: () => this.showMainWindow()
        });
      }
      
      menuTemplate.push({ type: 'separator' });
    }
    
    // Tickets em alerta (próximo de estourar)
    if (this.ticketsData.warning.length > 0) {
      menuTemplate.push({
        label: '🟡 SLA PRÓXIMO DO VENCIMENTO',
        enabled: false
      });
      
      this.ticketsData.warning.slice(0, 5).forEach(ticket => {
        menuTemplate.push({
          label: `   ${ticket.key}: ${this.truncate(ticket.summary, 40)}`,
          sublabel: ticket.slaInfo || '',
          click: () => this.openTicket(ticket.key)
        });
      });
      
      if (this.ticketsData.warning.length > 5) {
        menuTemplate.push({
          label: `   ... e mais ${this.ticketsData.warning.length - 5}`,
          click: () => this.showMainWindow()
        });
      }
      
      menuTemplate.push({ type: 'separator' });
    }
    
    // Tickets no prazo (SLA OK)
    if (this.ticketsData.normal.length > 0) {
      menuTemplate.push({
        label: `🟢 SLA OK (${this.ticketsData.normal.length})`,
        enabled: false
      });
      
      this.ticketsData.normal.slice(0, 5).forEach(ticket => {
        menuTemplate.push({
          label: `   ${ticket.key}: ${this.truncate(ticket.summary, 40)}`,
          sublabel: ticket.slaInfo || '',
          click: () => this.openTicket(ticket.key)
        });
      });
      
      if (this.ticketsData.normal.length > 5) {
        menuTemplate.push({
          label: `   ... e mais ${this.ticketsData.normal.length - 5}`,
          click: () => this.showMainWindow()
        });
      }
      
      menuTemplate.push({ type: 'separator' });
    }
    
    // Ações rápidas
    menuTemplate.push(
      {
        label: '📊 Abrir Jira Monitor',
        click: () => this.showMainWindow()
      },
      {
        label: '🔄 Atualizar Tickets',
        click: () => this.refreshTickets()
      },
      {
        label: '⬆️ Verificar Atualizações do App',
        click: () => this.checkForAppUpdates()
      }
    );
    
    menuTemplate.push({ type: 'separator' });
    
    // Menu de teste de cores
    menuTemplate.push(
      {
        label: '🧪 Testar Cores',
        submenu: [
          {
            label: '🔴 Vermelho (SLA Vencido)',
            click: () => this.testIcon('red')
          },
          {
            label: '🟡 Amarelo (Próximo do Vencimento)',
            click: () => this.testIcon('yellow')
          },
          {
            label: '🟢 Verde (Tudo OK)',
            click: () => this.testIcon('green')
          },
          {
            label: '⚪ Cinza (Sem Dados)',
            click: () => this.testIcon('gray')
          },
          { type: 'separator' },
          {
            label: '🔴🟡 Crítico + Alerta',
            click: () => this.testIcon('red-yellow')
          },
          {
            label: '🔴🟢 Crítico + OK',
            click: () => this.testIcon('red-green')
          },
          {
            label: '🟡🟢 Alerta + OK',
            click: () => this.testIcon('yellow-green')
          },
          {
            label: '🔴🟡🟢 Todos os Estados',
            click: () => this.testIcon('all')
          },
          { type: 'separator' },
          {
            label: '♻️ Voltar ao Normal',
            click: () => this.testIcon(null)
          }
        ]
      }
    );
    
    menuTemplate.push({ type: 'separator' });
    
    menuTemplate.push(
      {
        label: '⚙️ Configurações',
        click: () => {
          this.showMainWindow();
          // Enviar evento para abrir configurações
          if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('open-config-from-tray');
          }
        }
      },
      {
        label: '🚪 Sair',
        click: () => {
          // Importar app apenas quando necessário
          const { app } = require('electron');
          app.quit();
        }
      }
    );
    
    const contextMenu = Menu.buildFromTemplate(menuTemplate);
    this.tray.setContextMenu(contextMenu);
  }

  /**
   * Abre/foca a janela principal
   */
  showMainWindow() {
    // Se a janela foi destruída ou não existe, recriar
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.log('🔄 Janela foi destruída, recriando...');
      if (this.recreateWindowFn) {
        this.mainWindow = this.recreateWindowFn();
      } else {
        console.error('❌ Não há função para recriar a janela!');
        return;
      }
    }
    
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    
    this.mainWindow.show();
    this.mainWindow.focus();
    console.log('✅ Janela principal exibida');
  }

  /**
   * Abre um ticket específico na janela principal
   * @param {string} ticketKey - Chave do ticket (ex: IT-12345)
   */
  openTicket(ticketKey) {
    const wasDestroyed = !this.mainWindow || this.mainWindow.isDestroyed();
    
    // Armazenar o ticket pendente para focar depois que os dados carregarem
    this.pendingTicketFocus = ticketKey;
    
    this.showMainWindow();
    
    // Se a janela já existia e não foi recriada, focar imediatamente
    if (!wasDestroyed && this.mainWindow && !this.mainWindow.isDestroyed()) {
      console.log(`🎯 Focando no ticket (janela existente): ${ticketKey}`);
      setTimeout(() => {
        this.mainWindow.webContents.send('focus-ticket', ticketKey);
        this.pendingTicketFocus = null;
      }, 100);
    } else {
      console.log(`⏳ Janela foi recriada, aguardando dados do Jira carregar para focar em: ${ticketKey}`);
      // O evento será enviado quando o renderer avisar que os dados estão prontos
    }
  }

  /**
   * Solicita atualização dos tickets
   */
  refreshTickets() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('manual-refresh');
    }
  }

  /**
   * Verifica se há atualizações do app disponíveis
   */
  checkForAppUpdates() {
    if (this.onCheckForUpdates) {
      this.onCheckForUpdates();
    }
  }

  /**
   * Define o callback para verificar atualizações do app
   * @param {Function} callback - Função a ser chamada
   */
  setOnCheckForUpdates(callback) {
    this.onCheckForUpdates = callback;
  }

    /**
   * Cria um ícone para o tray
   * @param {string} color - 'red', 'yellow', 'green', 'gray'
   * @param {number|null} badge - Número para exibir no badge
   * @returns {NativeImage}
   */
  createIcon(color, badge = null) {
    const text = (color === 'red' || color === 'yellow' || color === 'green') ? '●' : '○';
    return this.createTextIcon(text, color);
  }

  /**
   * Cria um canvas simples para desenhar
   */
  createCanvas(width, height) {
    // No Node.js não temos Canvas nativo
    // Vamos criar um mock que retorna um dataURL
    const color = arguments[2] || 'gray'; // Recebe a cor do ícone
    
    // Mapeamento de cores para data URLs de ícones simples
    const icons = {
      red: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVQ4je2VQQ6DIBBFnyM9QOPFuPcOHMEDaLwYV+7AEVxJlg5dsPETCrZqbdJ/Mkn4w/Dng0EIIf4EIcRVa30xxhwppY8Y41trvRtjLkqpm9b6qrW+SillKeWSJMmV/0gpZZIkyZVSyh6llEuSJFf+Q0opkyRJrpRSds65M6W0C4DjnDsbYy5CCEEpZU8p7eKcu1BK2VNKO0opg5C1lgEwOeeu1loGwBBCAACLc+5qrWUADCGEAIDFOXe11jIAhhACABYhhGCMuSilbkqpm7WWrbVsrWVa69u/FH8AwdxuV2xRF2kAAAAASUVORK5CYII=',
      yellow: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVQ4je2VQQ6DIBBFnyM9QOPFuPcOHMEDaLwYV+7AEVxJlg5dsPETCrZqbdJ/Mkn4w/Dng0EIIf4EIcRVa30xxhwppY8Y41trvRtjLkqpm9b6qrW+SyllKeWSJMmV/0gpZZIkyZVSyh6llEuSJFf+Q0opkyRJrpRSds65M6W0C4DjnDsbYy5CCEEpZU8p7eKcu1BK2VNKO0opg5C1lgEwOeeu1loGwBBCAACLc+5qrWUADCGEAIDFOXe11jIAhhACABYhhGCMuSilbkqpm7WWrbVsrWVa69u/FH8AwdxuV2xRF2kAAAAASUVORK5CYII=',
      green: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVQ4je2VQQ6DIBBFnyM9QOPFuPcOHMEDaLwYV+7AEVxJlg5dsPETCrZqbdJ/Mkn4w/Dng0EIIf4EIcRVa30xxhwppY8Y41trvRtjLkqpm9b6qrW+SyllKeWSJMmV/0gpZZIkyZVSyh6llEuSJFf+Q0opkyRJrpRSds65M6W0C4DjnDsbYy5CCEEpZU8p7eKcu1BK2VNKO0opg5C1lgEwOeeu1loGwBBCAACLc+5qrWUADCGEAIDFOXe11jIAhhACABYhhGCMuSilbkqpm7WWrbVsrWVa69u/FH8AwdxuV2xRF2kAAAAASUVORK5CYII=',
      gray: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2klEQVQ4je2VQQ6DIBBFnyM9QOPFuPcOHMEDaLwYV+7AEVxJlg5dsPETCrZqbdJ/Mkn4w/Dng0EIIf4EIcRVa30xxhwppY8Y41trvRtjLkqpm9b6qrW+SyllKeWSJMmV/0gpZZIkyZVSyh6llEuSJFf+Q0opkyRJrpRSds65M6W0C4DjnDsbYy5CCEEpZU8p7eKcu1BK2VNKO0opg5C1lgEwOeeu1loGwBBCAACLc+5qrWUADCGEAIDFOXe11jIAhhACABYhhGCMuSilbkqpm7WWrbVsrWVa69u/FH8AwdxuV2xRF2kAAAAASUVORK5CYII='
    };
    
    return {
      width,
      height,
      getContext: () => ({
        font: '',
        textAlign: '',
        textBaseline: '',
        fillText: () => {}
      }),
      toDataURL: () => {
        // Retornar um ícone baseado na cor
        // Para simplificar, vamos usar círculos coloridos
        return `data:image/svg+xml;utf8,<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><circle cx="${width/2}" cy="${height/2}" r="8" fill="${color === 'red' ? '#EF4444' : color === 'yellow' ? '#F59E0B' : color === 'green' ? '#10B981' : '#9CA3AF'}"/></svg>`;
      }
    };
  }

  /**
   * Trunca uma string
   */
  truncate(str, maxLength) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  /**
   * Testa o ícone com cores diferentes (para demonstração)
   * @param {string|null} color - 'red', 'yellow', 'green', 'gray' ou null para voltar ao normal
   */
  testIcon(color) {
    if (color === null) {
      // Voltar ao estado real
      this.updateIcon();
      this.updateTooltip();
      console.log('♻️ Voltando ao estado real dos tickets');
      return;
    }
    
    // Emojis para cada cor (visual feedback)
    const emojis = {
      red: '🔴',
      yellow: '🟡',
      green: '🟢',
      gray: '⚪'
    };
    
    // Simular tickets para teste
    const testData = {
      red: {
        tickets: { critical: [{ key: 'IT-12345', summary: 'Bug crítico', slaInfo: 'Estourado há 2h' }], warning: [], normal: [] },
        tooltip: `${emojis.red} TESTE: SLA VENCIDO\n🔴 1 ticket com SLA vencido\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      },
      yellow: {
        tickets: { critical: [], warning: [{ key: 'IT-12346', summary: 'Feature importante', slaInfo: 'Estoura em 30min' }], normal: [] },
        tooltip: `${emojis.yellow} TESTE: SLA PRÓXIMO DO VENCIMENTO\n🟡 1 ticket próximo do vencimento\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      },
      green: {
        tickets: { 
          critical: [], 
          warning: [], 
          normal: [
            { key: 'IT-12347', summary: 'Tarefa normal', slaInfo: 'SLA OK' },
            { key: 'IT-12348', summary: 'Melhoria UI', slaInfo: 'SLA OK' },
            { key: 'IT-12349', summary: 'Documentação', slaInfo: 'SLA OK' },
            { key: 'IT-12351', summary: 'Refatoração', slaInfo: 'SLA OK' },
            { key: 'IT-12352', summary: 'Testes unitários', slaInfo: 'SLA OK' }
          ] 
        },
        tooltip: `${emojis.green} TESTE: TUDO OK\n🟢 5 tickets OK\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      },
      gray: {
        tickets: { critical: [], warning: [], normal: [] },
        tooltip: `${emojis.gray} TESTE: SEM TICKETS\n⚪ Nenhum ticket\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      },
      'red-yellow': {
        tickets: { 
          critical: [{ key: 'IT-12345', summary: 'Bug crítico', slaInfo: 'Estourado há 2h' }], 
          warning: [{ key: 'IT-12346', summary: 'Feature importante', slaInfo: 'Estoura em 30min' }], 
          normal: [{ key: 'IT-12348', summary: 'Melhoria UI', slaInfo: 'SLA OK' }] 
        },
        tooltip: `🔴🟡🟢 TESTE: CRÍTICO + ALERTA + OK\n🔴 1 ticket vencido\n🟡 1 ticket próximo do vencimento\n🟢 1 ticket OK\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      },
      'red-green': {
        tickets: { 
          critical: [{ key: 'IT-12345', summary: 'Bug crítico', slaInfo: 'Estourado há 2h' }], 
          warning: [], 
          normal: [
            { key: 'IT-12347', summary: 'Tarefa normal', slaInfo: 'SLA OK' },
            { key: 'IT-12348', summary: 'Melhoria UI', slaInfo: 'SLA OK' }
          ] 
        },
        tooltip: `🔴🟢 TESTE: CRÍTICO + OK\n🔴 1 ticket vencido\n🟢 2 tickets OK\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      },
      'yellow-green': {
        tickets: { 
          critical: [], 
          warning: [{ key: 'IT-12346', summary: 'Feature importante', slaInfo: 'Estoura em 30min' }], 
          normal: [
            { key: 'IT-12347', summary: 'Tarefa normal', slaInfo: 'SLA OK' },
            { key: 'IT-12348', summary: 'Melhoria UI', slaInfo: 'SLA OK' }
          ] 
        },
        tooltip: `🟡🟢 TESTE: ALERTA + OK\n🟡 1 ticket próximo do vencimento\n🟢 2 tickets OK\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      },
      'all': {
        tickets: { 
          critical: [
            { key: 'IT-12345', summary: 'Bug crítico', slaInfo: 'Estourado há 2h' },
            { key: 'IT-12350', summary: 'Falha no login', slaInfo: 'Estourado há 5h' }
          ], 
          warning: [
            { key: 'IT-12346', summary: 'Feature importante', slaInfo: 'Estoura em 30min' }
          ], 
          normal: [
            { key: 'IT-12347', summary: 'Tarefa normal', slaInfo: 'SLA OK' },
            { key: 'IT-12348', summary: 'Melhoria UI', slaInfo: 'SLA OK' },
            { key: 'IT-12349', summary: 'Documentação', slaInfo: 'SLA OK' }
          ] 
        },
        tooltip: `🔴🟡🟢 TESTE: TODOS OS ESTADOS\n🔴 2 tickets vencidos\n🟡 1 ticket próximo do vencimento\n🟢 3 tickets OK\n\n(Isto é um teste - clique em "Voltar ao Normal")`
      }
    };
    
    const test = testData[color];
    if (!test) return;
    
    // Atualizar tooltip com indicador de teste
    this.tray.setToolTip(test.tooltip);
    
    // Reconstruir menu e ícone com tickets de teste
    this.ticketsData = test.tickets;
    this.updateIcon(); // Isso vai calcular e mostrar TODOS os emojis ativos
    this.updateMenu();
    
    console.log(`🧪 MODO TESTE ATIVO: ${color.toUpperCase()}`);
    console.log(`💡 Os emojis devem estar visíveis na Menu Bar ao lado do ícone`);
  }

  /**
   * Destroi o tray
   */
  destroy() {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}

module.exports = TrayManager;
