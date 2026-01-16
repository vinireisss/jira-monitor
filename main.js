// 🔁 Auto-relançar se Electron estiver em modo Node (ELECTRON_RUN_AS_NODE)
if (process.env.ELECTRON_RUN_AS_NODE && !process.env.JIRA_MONITOR_RELAUNCH) {
  const { spawn } = require('child_process');
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  env.JIRA_MONITOR_RELAUNCH = '1';
  spawn(process.execPath, process.argv.slice(1), {
    env,
    detached: true,
    stdio: 'ignore'
  }).unref();
  process.exit(0);
}

const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog, shell, screen } = require('electron');

const path = require('path');
const Store = require('electron-store');
const fs = require('fs');
const TrayManager = require('./tray-manager');

// 🎛️ CONTROLE DE DEBUG: Altere para true para ver logs detalhados
const DEBUG_MODE = false;

// 🛡️ Função auxiliar para logs condicionais
const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

// 🧭 Persistir bounds confiáveis (evita posições inválidas quando minimizada/maximizada)
const getPersistableBounds = (window) => {
  if (!window || window.isDestroyed()) return null;
  const bounds = typeof window.getNormalBounds === 'function'
    ? window.getNormalBounds()
    : window.getBounds();

  return {
    ...bounds,
    width: Math.max(150, bounds.width || 420),
    height: Math.max(60, bounds.height || 700)
  };
};

// 🛡️ Inicializar store com tratamento de erro para arquivo corrompido
let store;
function initializeStore() {
  try {
    store = new Store();
  } catch (error) {
    console.error('⚠️ Arquivo de configuração corrompido. Criando novo...');
    try {
      // Tentar limpar o arquivo corrompido
      const { app } = require('electron');
      if (app && app.isReady()) {
        const configPath = path.join(app.getPath('userData'), 'config.json');
        if (fs.existsSync(configPath)) {
          try {
            fs.unlinkSync(configPath);
            console.log('✅ Arquivo corrompido removido');
          } catch (unlinkError) {
            console.error('Erro ao remover arquivo corrompido:', unlinkError);
          }
        }
      }
      // Criar novo store limpo
      store = new Store();
    } catch (reinitError) {
      console.error('❌ Erro ao reinicializar store:', reinitError);
      // Criar store vazio como último recurso
      store = new Store({ name: 'config-recovery' });
    }
  }
}
let mainWindow;
let tray;
let trayManager;
let lastKnownBounds = null;

// Criar janela principal
function createWindow() {
  // 1. Tentar carregar config.json primeiro para ter valores padrão do projeto
  const projectConfigPath = path.join(__dirname, 'config.json');
  let projectConfig = {};
  if (fs.existsSync(projectConfigPath)) {
    try {
      projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
    } catch (e) {}
  }

  // 2. Restaurar posição e tamanho (Prioridade: Electron Store > config.json > Padrão)
  const defaultBounds = projectConfig.windowBounds || { width: 420, height: 700, x: undefined, y: undefined };
  const savedBounds = store.get('windowBounds', defaultBounds);
  
  debugLog('📍 Posição carregada final:', savedBounds);
  
  const { screen } = require('electron');
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  
  let { x, y, width, height } = savedBounds;
  
  // Validar largura e altura mínimas
  // Permitir modo micro (150x60) mas usar padrão maior se indefinido
  width = Math.max(150, width || 420);
  height = Math.max(60, height || 700);
  
  // Verificar se a posição está em algum display conectado
  let isPositionValid = false;
  if (x !== undefined && y !== undefined) {
    // Verificar se a janela está visível em algum monitor
    for (const display of displays) {
      const { x: dx, y: dy, width: dw, height: dh } = display.bounds;
      // Verificar se pelo menos parte da janela está visível neste display
      if (x + width > dx && x < dx + dw && y + height > dy && y < dy + dh) {
        isPositionValid = true;
        // console.log('✅ Posição válida no display:', display.id);
        break;
      }
    }
  }
  
  // Se a posição não for válida (monitor desconectado), usar posição padrão
  if (!isPositionValid) {
    debugLog('⚠️ Posição inválida, usando padrão na tela primária');
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    x = screenWidth - width - 20;
    y = 20;
  }
  
  // Configurar ícone customizado
  const iconPath = path.join(__dirname, 'icon.png');
  const windowIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : undefined;
  
  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    minWidth: 150,  // 🔬 Permite modo micro
    minHeight: 60,  // 🔬 Permite modo micro
    title: 'Jira Monitor',
    icon: windowIcon,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    show: false
  });

  mainWindow.loadFile('index.html');

  // Função para garantir que a janela apareça (SEM alterar posição)
  const forceShowWindow = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      // Forçar janela a aparecer na posição atual
      mainWindow.restore(); // Restaurar se estiver minimizada
      mainWindow.show();
      mainWindow.focus();
      mainWindow.moveTop(); // Trazer para frente
      
      // No macOS, forçar app em primeiro plano
      if (process.platform === 'darwin') {
        app.focus({ steal: true });
        mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
        mainWindow.setVisibleOnAllWorkspaces(false); // Resetar para comportamento normal
      }
    }
  };
  
  // Mostrar janela quando estiver pronta (mantém posição salva)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    lastKnownBounds = getPersistableBounds(mainWindow) || lastKnownBounds;
    if (process.platform === 'darwin') {
      app.focus({ steal: true });
    }
  });
  
  // Fallback: garantir que a janela apareça mesmo se ready-to-show demorar
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      console.log('⚠️ Forçando janela a aparecer (timeout)');
      forceShowWindow();
    }
  }, 1500);

  // Salvar posição e tamanho quando a janela for movida ou redimensionada
  let saveTimeout;
  const saveBounds = () => {
    clearTimeout(saveTimeout);
    lastKnownBounds = getPersistableBounds(mainWindow) || lastKnownBounds;
    saveTimeout = setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        const bounds = lastKnownBounds || getPersistableBounds(mainWindow);
        if (bounds) {
          store.set('windowBounds', bounds);
          debugLog('💾 Posição salva (debounce):', bounds);
        }
      }
    }, 300); // Debounce de 300ms (reduzido para salvar mais rápido)
  };

  mainWindow.on('move', saveBounds);
  mainWindow.on('resize', saveBounds);
  
  // Salvar também quando a janela perde o foco (blur)
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const bounds = lastKnownBounds || getPersistableBounds(mainWindow);
      if (bounds) {
        store.set('windowBounds', bounds);
        debugLog('💾 Posição salva (blur):', bounds);
      }
    }
  });

  // Salvar posição ao fechar
  mainWindow.on('close', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const bounds = lastKnownBounds || getPersistableBounds(mainWindow);
      if (bounds) {
        store.set('windowBounds', bounds);
        debugLog('💾 Posição salva (close):', bounds);
      }
    }
  });
  
  // Log quando a janela for fechada
  mainWindow.on('closed', () => {
    debugLog('🔴 Janela principal fechada');
    mainWindow = null;
  });

  // Menu de contexto (botão direito)
  mainWindow.webContents.on('context-menu', (event, params) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '⬅️ Voltar',
        enabled: mainWindow.webContents.canGoBack(),
        click: () => mainWindow.webContents.goBack()
      },
      {
        label: '➡️ Avançar',
        enabled: mainWindow.webContents.canGoForward(),
        click: () => mainWindow.webContents.goForward()
      },
      {
        label: '🔄 Recarregar',
        click: () => mainWindow.webContents.reload()
      },
      { type: 'separator' },
      {
        label: '✂️ Recortar',
        role: 'cut',
        enabled: params.editFlags.canCut
      },
      {
        label: '📋 Copiar',
        role: 'copy',
        enabled: params.editFlags.canCopy
      },
      {
        label: '📄 Colar',
        role: 'paste',
        enabled: params.editFlags.canPaste
      },
      {
        label: '🗑️ Deletar',
        role: 'delete',
        enabled: params.editFlags.canDelete
      },
      { type: 'separator' },
      {
        label: '🔍 Selecionar Tudo',
        role: 'selectAll'
      },
      { type: 'separator' },
      {
        label: '🎯 Modo Focus',
        type: 'checkbox',
        click: () => {
          mainWindow.webContents.send('toggle-focus-mode');
        }
      },
      { type: 'separator' },
      {
        label: '🔗 Copiar Link',
        visible: params.linkURL.length > 0,
        click: () => {
          const { clipboard } = require('electron');
          clipboard.writeText(params.linkURL);
        }
      },
      {
        label: '🖼️ Copiar Imagem',
        visible: params.hasImageContents,
        click: () => mainWindow.webContents.copyImageAt(params.x, params.y)
      },
      {
        label: '🌐 Abrir Link em Navegador Externo',
        visible: params.linkURL.length > 0,
        click: () => shell.openExternal(params.linkURL)
      },
      { type: 'separator' },
      {
        label: '🔧 Inspecionar Elemento',
        click: () => {
          mainWindow.webContents.inspectElement(params.x, params.y);
          if (mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.webContents.devToolsWebContents.focus();
          }
        }
      }
    ]);
    
    contextMenu.popup(mainWindow);
  });

  // Abrir DevTools em modo desenvolvimento
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

// Criar ícone na bandeja do sistema usando TrayManager
function createTray() {
  try {
    trayManager = new TrayManager(mainWindow, createWindow);
    trayManager.create();
    debugLog('✅ Tray Manager inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar Tray Manager:', error);
  }
}

// Criar janela de webview para o Jira
function createJiraWebviewWindow(url, ticketKey) {
  let webviewWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: `Jira - ${ticketKey}`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    },
    backgroundColor: '#ffffff',
    show: false
  });
  
  // Criar HTML com webview
  const webviewHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Jira - ${ticketKey}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            overflow: hidden;
            background: #ffffff;
          }
          webview {
            width: 100vw;
            height: 100vh;
            border: none;
          }
          .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #667eea;
            font-size: 18px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="loading">Carregando Jira...</div>
        <webview 
          id="jira-webview" 
          src="${url}"
          partition="persist:jira"
        ></webview>
        <script>
          const webview = document.getElementById('jira-webview');
          const loading = document.querySelector('.loading');
          
          webview.addEventListener('did-start-loading', () => {
            loading.style.display = 'block';
          });
          
          webview.addEventListener('did-stop-loading', () => {
            loading.style.display = 'none';
          });
          
          // Abrir links externos no navegador padrão
          webview.addEventListener('new-window', (e) => {
            const { shell } = require('electron');
            shell.openExternal(e.url);
          });
        </script>
      </body>
    </html>
  `;
  
  webviewWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(webviewHTML)}`);
  
  // Capturar a webview quando ela for anexada
  webviewWindow.webContents.on('did-attach-webview', (event, webContents) => {
    // Menu de contexto para o conteúdo dentro da webview
    webContents.on('context-menu', (event, params) => {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: '⬅️ Voltar',
          enabled: webContents.canGoBack(),
          click: () => webContents.goBack()
        },
        {
          label: '➡️ Avançar',
          enabled: webContents.canGoForward(),
          click: () => webContents.goForward()
        },
        {
          label: '🔄 Recarregar',
          click: () => webContents.reload()
        },
        { type: 'separator' },
        {
          label: '✂️ Recortar',
          role: 'cut',
          enabled: params.editFlags.canCut
        },
        {
          label: '📋 Copiar',
          role: 'copy',
          enabled: params.editFlags.canCopy
        },
        {
          label: '📄 Colar',
          role: 'paste',
          enabled: params.editFlags.canPaste
        },
        {
          label: '🗑️ Deletar',
          role: 'delete',
          enabled: params.editFlags.canDelete
        },
        { type: 'separator' },
        {
          label: '🔍 Selecionar Tudo',
          role: 'selectAll'
        },
        { type: 'separator' },
        {
          label: '🔗 Copiar Link',
          visible: params.linkURL && params.linkURL.length > 0,
          click: () => {
            const { clipboard } = require('electron');
            clipboard.writeText(params.linkURL);
          }
        },
        {
          label: '🖼️ Copiar Imagem',
          visible: params.hasImageContents,
          click: () => webContents.copyImageAt(params.x, params.y)
        },
        {
          label: '🌐 Abrir Link em Navegador Externo',
          visible: params.linkURL && params.linkURL.length > 0,
          click: () => shell.openExternal(params.linkURL)
        },
        { type: 'separator' },
        {
          label: '🏠 Abrir Jira Home',
          click: () => {
            const config = store.store;
            const jiraUrl = config.jiraUrl || 'https://nubank.atlassian.net';
            webContents.loadURL(jiraUrl);
          }
        },
        {
          label: '🔧 Inspecionar Elemento',
          click: () => {
            webContents.inspectElement(params.x, params.y);
            if (webContents.isDevToolsOpened()) {
              webContents.devToolsWebContents.focus();
            }
          }
        }
      ]);
      
      contextMenu.popup(webviewWindow);
    });
  });
  
  // Menu de contexto para a janela container (área de loading)
  webviewWindow.webContents.on('context-menu', (event, params) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '🔄 Recarregar Página',
        click: () => webviewWindow.webContents.reload()
      },
      {
        label: '🔧 DevTools',
        click: () => webviewWindow.webContents.openDevTools()
      }
    ]);
    
    contextMenu.popup(webviewWindow);
  });
  
  webviewWindow.once('ready-to-show', () => {
    webviewWindow.show();
  });
  
  // Limpar referência quando a janela é fechada
  webviewWindow.on('closed', () => {
    webviewWindow = null;
  });
}

// IPC Handlers
function registerIpcHandlers() {
ipcMain.handle('get-config', () => {
  // 🔥 FIX: SEMPRE ler do config.json do projeto para evitar cache corrompido
  const projectConfigPath = path.join(__dirname, 'config.json');
  let projectConfig = {};
  
  if (fs.existsSync(projectConfigPath)) {
    try {
      const fileContent = fs.readFileSync(projectConfigPath, 'utf8');
      projectConfig = JSON.parse(fileContent);
      debugLog('✅ Config lida do config.json do projeto');
    } catch (err) {
      console.error('❌ Erro ao ler config.json:', err.message);
    }
  }
  
  // Mesclar com Electron Store (PRIORIDADE para Electron Store agora)
  const electronConfig = store.store;
  const mergedConfig = {
    ...projectConfig, // Valores do arquivo config.json
    ...electronConfig // ✅ Electron Store sobrescreve config.json (preserva alterações do usuário)
  };
  
  debugLog('📂 ========================================');
  debugLog('📂 CONFIG MESCLADA (projeto + electron-store)');
  debugLog('📂 evaluatedTicketsSatisfactionField:', mergedConfig.evaluatedTicketsSatisfactionField);
  debugLog('📂 evaluatedTicketsMaxPages:', mergedConfig.evaluatedTicketsMaxPages);
  debugLog('📂 Tipo:', typeof mergedConfig.evaluatedTicketsSatisfactionField);
  debugLog('📂 É array?', Array.isArray(mergedConfig.evaluatedTicketsSatisfactionField));
  debugLog('📂 Modo Pro:', mergedConfig.proMode);
  debugLog('📂 Localização Electron Store:', store.path);
  debugLog('📂 ========================================');
  
  return mergedConfig;
});

ipcMain.handle('save-config', (event, config) => {
  Object.keys(config).forEach(key => {
    const value = config[key];
    if (value === undefined || value === null) {
      store.delete(key);
    } else {
      store.set(key, value);
    }
  });
  return { success: true };
});

// Save config síncrono (para beforeunload)
ipcMain.on('save-config-sync', (event, config) => {
  Object.keys(config).forEach(key => {
    const value = config[key];
    if (value === undefined || value === null) {
      store.delete(key);
    } else {
      store.set(key, value);
    }
  });
  debugLog('💾 ========================================');
  debugLog('💾 CONFIG SALVA NO DISCO (electron-store)');
  debugLog('💾 Modo Pro salvo:', config.proMode);
  debugLog('💾 Localização:', store.path);
  debugLog('💾 ========================================');
});

// Atualizar tray com dados de tickets
ipcMain.on('update-tray-tickets', (event, ticketsData) => {
  if (trayManager) {
    try {
      trayManager.updateTickets(ticketsData);
    } catch (error) {
      console.error('❌ Erro ao atualizar tray com tickets:', error);
    }
  }
});

// Atualizar tray com dados de estatísticas
ipcMain.on('update-tray-stats', (event, stats) => {
  if (trayManager) {
    try {
      trayManager.update(stats);
    } catch (error) {
      console.error('❌ Erro ao atualizar tray:', error);
    }
  }
});

// Abrir nova janela para monitorar outro usuário
ipcMain.handle('open-user-window', (event, userEmail) => {
  createUserMonitorWindow(userEmail);
  return { success: true };
});

ipcMain.handle('minimize-window', async (event) => {
  try {
    // Minimizar a janela que enviou o comando
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window && !window.isDestroyed()) {
      window.minimize();
      return { success: true };
    }
    return { success: false, error: 'Window not found' };
  } catch (error) {
    console.error('Erro ao minimizar janela:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('toggle-devtools', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
    } else {
      mainWindow.webContents.openDevTools();
    }
  }
});

ipcMain.handle('close-window', async (event) => {
  try {
    // 🔴 GRACEFUL SHUTDOWN - Fechar app completamente ao clicar no X
    const window = BrowserWindow.fromWebContents(event.sender);
    
    // Se for a janela principal, sair completamente do app
    if (window === mainWindow) {
      debugLog('🔴 Fechando aplicação completamente...');
      
      // Salvar posição da janela antes de fechar
      if (mainWindow && !mainWindow.isDestroyed()) {
        const bounds = lastKnownBounds || getPersistableBounds(mainWindow);
        if (bounds) {
          store.set('windowBounds', bounds);
          debugLog('💾 Posição final salva:', bounds);
        }
      }
      
      // Destruir todas as janelas
      BrowserWindow.getAllWindows().forEach(w => {
        if (!w.isDestroyed()) {
          w.destroy();
        }
      });
      
      // Sair do aplicativo completamente
      app.quit();
      return { success: true };
    } else {
      // Se for uma janela secundária, apenas fechá-la
      if (window && !window.isDestroyed()) {
        window.close();
        return { success: true };
      }
      return { success: false, error: 'Window not found' };
    }
  } catch (error) {
    console.error('Erro ao fechar janela:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-url', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    console.error('Erro ao abrir URL:', error);
    return { success: false, error: error.message };
  }
});

// Abrir Jira em webview (janela interna)
ipcMain.handle('open-jira-webview', (event, url, ticketKey) => {
  createJiraWebviewWindow(url, ticketKey);
});

ipcMain.handle('play-sound', (event, soundPath) => {
  const { exec } = require('child_process');
  exec(`afplay "${soundPath}"`, (error) => {
    if (error) {
      console.error('Erro ao tocar som:', error);
    }
  });
});

// IPC Handlers para tickets
const JiraService = require('./jira-service');
let jiraService = null;

function getJiraService() {
  if (!jiraService) {
    const config = store.store;
    jiraService = new JiraService(config);
  }
  return jiraService;
}

ipcMain.handle('fetch-jira-stats', async (event, config) => {
  try {
    jiraService = new JiraService(config);
    const stats = await jiraService.fetchStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Erro ao buscar stats do Jira:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('search-jira-tickets', async (event, jql, maxResults = 50) => {
  try {
    const service = getJiraService();
    const fields = ['status', 'summary', 'key', 'priority', 'updated', 'assignee', 'reporter'];
    const result = await service._searchJql(jql, fields);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('fetch-mentions', async (event) => {
  try {
    const service = getJiraService();
    const mentions = await service.fetchMentions();
    return { success: true, data: mentions };
  } catch (error) {
    console.error('Erro ao buscar menções:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-ticket-details', async (event, ticketKey) => {
  try {
    debugLog(`🎫 [IPC] Recebida solicitação de detalhes para: ${ticketKey}`);
    const service = getJiraService();
    const details = await service.getTicketDetails(ticketKey);
    debugLog(`✅ [IPC] Detalhes obtidos para ${ticketKey}:`, {
      key: details.key,
      hasComments: !!details.comments,
      commentsLength: details.comments?.length
    });
    return { success: true, data: details };
  } catch (error) {
    console.error(`❌ [IPC] Erro ao buscar detalhes do ticket ${ticketKey}:`, error);
    return { success: false, error: error.message };
  }
});

// Buscar SLA do ticket
ipcMain.handle('get-ticket-sla', async (event, ticketKey) => {
  try {
    const service = getJiraService();
    const slaData = await service.getTicketSla(ticketKey);
    return { success: true, data: slaData };
  } catch (error) {
    console.error(`❌ [IPC] Erro ao buscar SLA do ticket ${ticketKey}:`, error);
    return { success: false, error: error.message };
  }
});

// Atualizar campo do ticket
ipcMain.handle('update-ticket-field', async (event, { ticketKey, fieldName, value }) => {
  try {
    const service = getJiraService();
    await service.updateTicketField(ticketKey, fieldName, value);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar campo do ticket:', error);
    return { success: false, error: error.message };
  }
});

// Buscar usuários assignáveis
ipcMain.handle('get-assignable-users', async (event, projectKey) => {
  try {
    const service = getJiraService();
    const users = await service.getAssignableUsers(projectKey);
    return { success: true, data: users };
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return { success: false, error: error.message };
  }
});

// Buscar opções de ITOps Team
ipcMain.handle('get-itops-team-options', async (event) => {
  try {
    const service = getJiraService();
    const teams = await service.getITOpsTeamOptions();
    return { success: true, data: teams };
  } catch (error) {
    console.error('Erro ao buscar times:', error);
    return { success: false, error: error.message };
  }
});

// Buscar metadados do ticket
ipcMain.handle('get-ticket-edit-metadata', async (event, ticketKey) => {
  try {
    const service = getJiraService();
    const metadata = await service.getTicketEditMetadata(ticketKey);
    return { success: true, data: metadata };
  } catch (error) {
    console.error('Erro ao buscar metadados:', error);
    return { success: false, error: error.message };
  }
});

// Adicionar comentário
ipcMain.handle('add-comment', async (event, { ticketKey, commentBody, isInternal, mentions }) => {
  try {
    const service = getJiraService();
    await service.addComment(ticketKey, commentBody, isInternal, mentions);
    return { success: true };
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return { success: false, error: error.message };
  }
});

// Upload de anexos
ipcMain.handle('select-and-upload-attachments', async (event, ticketKey) => {
  try {
    const { dialog } = require('electron');
    const fs = require('fs');
    
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      title: 'Selecionar arquivos para anexar'
    });
    
    if (result.canceled) {
      return { success: false, cancelled: true };
    }
    
    const service = getJiraService();
    let count = 0;
    
    for (const filePath of result.filePaths) {
      await service.uploadAttachment(ticketKey, filePath);
      count++;
    }
    
    return { success: true, count };
  } catch (error) {
    console.error('Erro ao fazer upload de anexos:', error);
    return { success: false, error: error.message };
  }
});

// Download de anexo
ipcMain.handle('download-attachment', async (event, attachmentId, filename) => {
  try {
    const { dialog } = require('electron');
    const fs = require('fs');
    const path = require('path');
    
    const result = await dialog.showSaveDialog({
      title: 'Salvar anexo',
      defaultPath: filename
    });
    
    if (result.canceled) {
      return { success: false, cancelled: true };
    }
    
    const service = getJiraService();
    const content = await service.downloadAttachment(attachmentId);
    
    fs.writeFileSync(result.filePath, content);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao baixar anexo:', error);
    return { success: false, error: error.message };
  }
});

// Buscar notificações
ipcMain.handle('get-notifications', async (event, config) => {
  try {
    const service = getJiraService();
    const notifications = await service.getRecentNotifications(15);
    return { success: true, notifications };
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return { success: false, notifications: [], error: error.message };
  }
});

// Handler 'add-comment' já definido acima (linha 578), removendo duplicata

ipcMain.handle('update-comment', async (event, ticketKey, commentId, commentBody, isInternal) => {
  try {
    const service = getJiraService();
    const result = await service.updateComment(ticketKey, commentId, commentBody, isInternal);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-comment', async (event, ticketKey, commentId) => {
  try {
    const service = getJiraService();
    const result = await service.deleteComment(ticketKey, commentId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('add-attachment', async (event, ticketKey, filePaths) => {
  try {
    const service = getJiraService();
    const results = [];
    
    for (const filePath of filePaths) {
      const result = await service.addAttachment(ticketKey, filePath);
      results.push(result);
    }
    
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao adicionar anexo:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-attachment-files', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      title: 'Selecionar Arquivos'
    });
    
    if (result.canceled) {
      return { success: false, cancelled: true };
    }
    
    return { success: true, filePaths: result.filePaths };
  } catch (error) {
    console.error('Erro ao selecionar arquivos:', error);
    return { success: false, error: error.message };
  }
});

// Handler 'download-attachment' já definido acima (linha 620), removendo duplicata

ipcMain.handle('get-attachment-url', async (event, attachmentId) => {
  try {
    const service = getJiraService();
    const url = service.getAttachmentUrl(attachmentId);
    const config = store.store;
    
    return {
      success: true,
      url: url,
      auth: {
        email: config.jiraEmail,
        apiToken: config.jiraApiToken
      }
    };
  } catch (error) {
    console.error('Erro ao obter URL do anexo:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('search-users', async (event, query, maxResults) => {
  try {
    const service = getJiraService();
    const users = await service.searchUsers(query, maxResults);
    return { success: true, data: users };
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-current-user-account-id', async () => {
  try {
    const service = getJiraService();
    const accountId = await service.getCurrentUserAccountId();
    return { success: true, accountId };
  } catch (error) {
    console.error('Erro ao obter accountId do usuário:', error);
    return { success: false, error: error.message };
  }
});

// Buscar prioridades disponíveis do Jira
ipcMain.handle('get-jira-priorities', async () => {
  try {
    const service = getJiraService();
    const priorities = await service.getJiraPriorities();
    return { success: true, data: priorities };
  } catch (error) {
    console.error('Erro ao buscar prioridades:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-ticket-fields', async (event, ticketKey, fields) => {
  try {
    const service = getJiraService();
    const result = await service.updateTicketFields(ticketKey, fields);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erro ao atualizar campos do ticket:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-custom-field-options', async (event, ticketKey, fieldId) => {
  try {
    const service = getJiraService();
    const options = await service.getCustomFieldOptions(ticketKey, fieldId);
    return { success: true, data: options };
  } catch (error) {
    console.error('Erro ao obter opções do campo customizado:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-recent-notifications', async (event, maxResults) => {
  try {
    // Sempre usar o config atual para garantir o usuário correto
    const config = store.store;
    const service = new JiraService(config);
    const notifications = await service.getRecentNotifications(maxResults);
    return { success: true, data: notifications };
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return { success: false, error: error.message };
  }
});

// ============================================
// 📊 IPC HANDLERS - DASHBOARD DE PERFORMANCE
// ============================================

ipcMain.handle('get-performance-metrics', async (event, days) => {
  try {
    const service = getJiraService();
    const metrics = await service.getPerformanceMetrics(days || 30);
    return { success: true, data: metrics };
  } catch (error) {
    console.error('Erro ao buscar métricas de performance:', error);
    return { success: false, error: error.message };
  }
});

// ============================================
// ⏱️ IPC HANDLERS - TIMERS & WORKLOG
// ============================================

ipcMain.handle('add-worklog', async (event, ticketKey, timeSpentSeconds, comment, startedDate) => {
  try {
    const service = getJiraService();
    const result = await service.addWorklog(ticketKey, timeSpentSeconds, comment, startedDate);
    return { success: true, data: result };
  } catch (error) {
    console.error('Erro ao adicionar worklog:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-worklogs', async (event, ticketKey) => {
  try {
    const service = getJiraService();
    const worklogs = await service.getWorklogs(ticketKey);
    return { success: true, data: worklogs };
  } catch (error) {
    console.error('Erro ao buscar worklogs:', error);
    return { success: false, error: error.message };
  }
});

// ============================================
// 🔔 IPC HANDLERS - ALERTAS PROATIVOS
// ============================================

ipcMain.handle('get-tickets-without-response', async (event, hours) => {
  try {
    const service = getJiraService();
    const tickets = await service.getTicketsWithoutResponseSince(hours || 4);
    return { success: true, data: tickets };
  } catch (error) {
    console.error('Erro ao buscar tickets sem resposta:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-tickets-critical-sla', async (event, minutesBefore) => {
  try {
    const service = getJiraService();
    const tickets = await service.getTicketsWithCriticalSLA(minutesBefore || 15);
    return { success: true, data: tickets };
  } catch (error) {
    console.error('Erro ao buscar tickets com SLA crítico:', error);
    return { success: false, error: error.message };
  }
});
} // Fim de registerIpcHandlers()

// Criar janela para monitorar outro usuário
function createUserMonitorWindow(userEmail) {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  
  // Dimensões da nova janela
  const width = 420;
  const height = 700;
  
  // Posição: ao lado da janela principal ou centralizada
  let x, y;
  if (mainWindow && !mainWindow.isDestroyed()) {
    const mainBounds = mainWindow.getBounds();
    x = mainBounds.x - width - 20; // À esquerda da janela principal
    y = mainBounds.y;
    
    // Se a posição ficar fora da tela, coloca à direita
    if (x < 0) {
      x = mainBounds.x + mainBounds.width + 20;
    }
  } else {
    // Centralizada
    x = Math.floor((screenWidth - width) / 2);
    y = Math.floor((screenHeight - height) / 2);
  }
  
  // Usar o mesmo ícone customizado
  const iconPath = path.join(__dirname, 'icon.png');
  const windowIcon = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : undefined;
  
  const userWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    title: `Jira Monitor - ${userEmail}`,
    icon: windowIcon,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    show: false
  });
  
  userWindow.loadFile('index.html');
  
  // Quando a janela carregar, configurar para monitorar o usuário
  userWindow.webContents.on('did-finish-load', () => {
    userWindow.webContents.send('set-monitored-user', userEmail);
  });
  
  userWindow.once('ready-to-show', () => {
    userWindow.show();
  });
  
  // Menu de contexto (botão direito) para janela secundária
  userWindow.webContents.on('context-menu', (event, params) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '⬅️ Voltar',
        enabled: userWindow.webContents.canGoBack(),
        click: () => userWindow.webContents.goBack()
      },
      {
        label: '➡️ Avançar',
        enabled: userWindow.webContents.canGoForward(),
        click: () => userWindow.webContents.goForward()
      },
      {
        label: '🔄 Recarregar',
        click: () => userWindow.webContents.reload()
      },
      { type: 'separator' },
      {
        label: '✂️ Recortar',
        role: 'cut',
        enabled: params.editFlags.canCut
      },
      {
        label: '📋 Copiar',
        role: 'copy',
        enabled: params.editFlags.canCopy
      },
      {
        label: '📄 Colar',
        role: 'paste',
        enabled: params.editFlags.canPaste
      },
      {
        label: '🗑️ Deletar',
        role: 'delete',
        enabled: params.editFlags.canDelete
      },
      { type: 'separator' },
      {
        label: '🔍 Selecionar Tudo',
        role: 'selectAll'
      },
      { type: 'separator' },
      {
        label: '🔗 Copiar Link',
        visible: params.linkURL.length > 0,
        click: () => {
          const { clipboard } = require('electron');
          clipboard.writeText(params.linkURL);
        }
      },
      {
        label: '🖼️ Copiar Imagem',
        visible: params.hasImageContents,
        click: () => userWindow.webContents.copyImageAt(params.x, params.y)
      },
      {
        label: '🌐 Abrir Link em Navegador Externo',
        visible: params.linkURL.length > 0,
        click: () => shell.openExternal(params.linkURL)
      },
      { type: 'separator' },
      {
        label: '🔧 Inspecionar Elemento',
        click: () => {
          userWindow.webContents.inspectElement(params.x, params.y);
          if (userWindow.webContents.isDevToolsOpened()) {
            userWindow.webContents.devToolsWebContents.focus();
          }
        }
      }
    ]);
    
    contextMenu.popup(userWindow);
  });
  
  // IPC handlers específicos para esta janela
  const windowId = userWindow.id;
  
  ipcMain.on(`minimize-window-${windowId}`, () => {
    if (userWindow && !userWindow.isDestroyed()) {
      userWindow.minimize();
    }
  });
  
  ipcMain.on(`close-window-${windowId}`, () => {
    if (userWindow && !userWindow.isDestroyed()) {
      userWindow.destroy();
    }
  });
  
  // Limpar listeners ao fechar
  userWindow.on('closed', () => {
    ipcMain.removeAllListeners(`minimize-window-${windowId}`);
    ipcMain.removeAllListeners(`close-window-${windowId}`);
  });
  
  return userWindow;
}

// 🔒 SINGLE INSTANCE LOCK - Prevenir múltiplas janelas
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Se já existe uma instância, não criar nova - apenas sair
  debugLog('⚠️ Aplicação já está em execução. Encerrando esta instância...');
  app.quit();
} else {
  // Quando alguém tentar abrir uma segunda instância, focar na primeira
  app.on('second-instance', () => {
    debugLog('🔍 Tentativa de abrir segunda instância - focando na janela principal');
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.show();
      mainWindow.focus();
    }
  });
  
  // Inicializar app
  app.whenReady().then(() => {
    // Inicializar store (após app estar pronto)
    initializeStore();
    registerIpcHandlers();
    
    // Definir nome do app (força o nome no macOS)
    app.setName('Jira Monitor');
    
    // Definir ícone do Dock no macOS
    if (process.platform === 'darwin') {
      const dockIconPath = path.join(__dirname, 'icon.png');
      if (fs.existsSync(dockIconPath)) {
        const dockIcon = nativeImage.createFromPath(dockIconPath);
        app.dock.setIcon(dockIcon);
        debugLog('✅ Ícone do Dock configurado:', dockIconPath);
      }
    }
    
    createWindow();
    createTray(); // Ícone do tray no menu bar
    
    // Forçar app a ficar em primeiro plano no macOS
    if (process.platform === 'darwin') {
      app.focus({ steal: true });
    }
  });
}

// Sair quando todas as janelas forem fechadas
// Salvar posição antes de fechar o app (garante salvamento em Ctrl+C)
app.on('before-quit', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const bounds = lastKnownBounds || getPersistableBounds(mainWindow);
    if (bounds) {
      store.set('windowBounds', bounds);
      debugLog('💾 Posição salva antes de fechar:', bounds);
    }
  }
});

app.on('window-all-closed', () => {
  // No macOS é comum o app continuar rodando mesmo sem janelas abertas
  // No Windows/Linux, mantemos o app rodando no tray
  // O usuário pode sair pelo menu do tray ou pelo botão de fechar
  
  // Não fazer nada - app continua rodando no tray
  debugLog('📌 Todas as janelas fechadas, mas app continua no tray');
});

// Recriar ou mostrar janela no macOS quando o ícone do dock for clicado
app.on('activate', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    // Se a janela existe, mostrar e focar (mantém posição)
    mainWindow.restore(); // Restaurar se estiver minimizada
    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop(); // Trazer para frente
    
    if (process.platform === 'darwin') {
      app.focus({ steal: true });
    }
  } else if (BrowserWindow.getAllWindows().length === 0) {
    // Se não há janelas, criar uma nova
    createWindow();
  }
});

