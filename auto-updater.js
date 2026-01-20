/**
 * Auto-Updater Module for Jira Monitor
 * 
 * Verifica atualizações disponíveis no GitHub e permite atualização automática.
 * Funciona para instalações via git clone.
 * 
 * Contribuição: Vinicius Reis (@vinireisss)
 */

const { app, dialog, Notification } = require('electron');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configurações
const GITHUB_REPO = 'gabinubank/jira-monitor';
const CHECK_INTERVAL = 60 * 60 * 1000; // Verificar a cada 1 hora
const APP_DIR = path.join(__dirname);

class AutoUpdater {
  constructor(options = {}) {
    this.onUpdateAvailable = options.onUpdateAvailable || (() => {});
    this.onUpdateDownloaded = options.onUpdateDownloaded || (() => {});
    this.onError = options.onError || console.error;
    this.debug = options.debug || false;
    this.checkInterval = null;
  }

  log(...args) {
    if (this.debug) {
      console.log('[AutoUpdater]', ...args);
    }
  }

  /**
   * Inicia a verificação periódica de atualizações
   */
  startChecking() {
    this.log('🔄 Iniciando verificação de atualizações...');
    
    // Verificar imediatamente (após 30 segundos para não atrasar o startup)
    setTimeout(() => this.checkForUpdates(), 30 * 1000);
    
    // Verificar periodicamente
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, CHECK_INTERVAL);
  }

  /**
   * Para a verificação periódica
   */
  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Verifica se é uma instalação via git
   */
  isGitInstallation() {
    const gitDir = path.join(APP_DIR, '.git');
    return fs.existsSync(gitDir);
  }

  /**
   * Obtém o commit local atual
   */
  getLocalCommit() {
    return new Promise((resolve, reject) => {
      exec('git rev-parse HEAD', { cwd: APP_DIR }, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.trim());
      });
    });
  }

  /**
   * Obtém o commit remoto mais recente
   */
  getRemoteCommit() {
    return new Promise((resolve, reject) => {
      // Primeiro, fazer fetch para atualizar refs remotas
      exec('git fetch origin main --quiet', { cwd: APP_DIR }, (fetchError) => {
        if (fetchError) {
          this.log('⚠️ Erro no fetch:', fetchError.message);
          // Tentar continuar mesmo com erro de fetch
        }
        
        exec('git rev-parse origin/main', { cwd: APP_DIR }, (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout.trim());
        });
      });
    });
  }

  /**
   * Obtém informações do último commit remoto
   */
  getRemoteCommitInfo() {
    return new Promise((resolve, reject) => {
      exec('git log origin/main -1 --format="%h|%s|%cr"', { cwd: APP_DIR }, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        const [hash, message, date] = stdout.trim().split('|');
        resolve({ hash, message, date });
      });
    });
  }

  /**
   * Verifica se há atualizações disponíveis
   */
  async checkForUpdates() {
    this.log('🔍 Verificando atualizações...');

    if (!this.isGitInstallation()) {
      this.log('⚠️ Não é uma instalação via git, ignorando verificação');
      return { hasUpdate: false };
    }

    try {
      const [localCommit, remoteCommit] = await Promise.all([
        this.getLocalCommit(),
        this.getRemoteCommit()
      ]);

      this.log(`📍 Local:  ${localCommit.substring(0, 7)}`);
      this.log(`📍 Remote: ${remoteCommit.substring(0, 7)}`);

      if (localCommit !== remoteCommit) {
        const commitInfo = await this.getRemoteCommitInfo();
        this.log(`✨ Atualização disponível: ${commitInfo.message}`);
        
        this.onUpdateAvailable({
          currentVersion: localCommit.substring(0, 7),
          newVersion: remoteCommit.substring(0, 7),
          commitInfo
        });

        return { hasUpdate: true, commitInfo };
      }

      this.log('✅ Você está na versão mais recente');
      return { hasUpdate: false };

    } catch (error) {
      this.log('❌ Erro ao verificar atualizações:', error.message);
      this.onError(error);
      return { hasUpdate: false, error };
    }
  }

  /**
   * Executa a atualização (git pull)
   */
  async performUpdate() {
    this.log('📥 Iniciando atualização...');

    return new Promise((resolve, reject) => {
      exec('git pull origin main', { cwd: APP_DIR }, (error, stdout, stderr) => {
        if (error) {
          this.log('❌ Erro na atualização:', error.message);
          reject(error);
          return;
        }

        this.log('✅ Atualização concluída:', stdout);
        this.onUpdateDownloaded();
        resolve(stdout);
      });
    });
  }

  /**
   * Atualiza e reinicia o app
   */
  async updateAndRestart() {
    try {
      await this.performUpdate();
      
      // Reiniciar o app
      this.log('🔄 Reiniciando aplicação...');
      app.relaunch();
      app.exit(0);
      
    } catch (error) {
      dialog.showErrorBox(
        'Erro na Atualização',
        `Não foi possível atualizar o aplicativo.\n\nErro: ${error.message}\n\nTente atualizar manualmente com:\ncd ~/dev/nu/jira-monitor && git pull`
      );
    }
  }

  /**
   * Mostra notificação de atualização disponível
   */
  showUpdateNotification(updateInfo) {
    const notification = new Notification({
      title: '🔄 Atualização Disponível',
      body: `Nova versão: ${updateInfo.commitInfo.message}\n(${updateInfo.commitInfo.date})`,
      silent: false,
      actions: [
        { type: 'button', text: 'Atualizar Agora' },
        { type: 'button', text: 'Depois' }
      ]
    });

    notification.on('click', () => {
      this.showUpdateDialog(updateInfo);
    });

    notification.on('action', (event, index) => {
      if (index === 0) {
        this.updateAndRestart();
      }
    });

    notification.show();
  }

  /**
   * Mostra diálogo de confirmação de atualização
   */
  showUpdateDialog(updateInfo) {
    const response = dialog.showMessageBoxSync({
      type: 'info',
      title: 'Atualização Disponível',
      message: 'Uma nova versão do Jira Monitor está disponível!',
      detail: `Versão atual: ${updateInfo.currentVersion}\nNova versão: ${updateInfo.newVersion}\n\nNovidade: ${updateInfo.commitInfo.message}\n\nDeseja atualizar agora? O aplicativo será reiniciado.`,
      buttons: ['Atualizar Agora', 'Depois'],
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      this.updateAndRestart();
    }
  }
}

module.exports = AutoUpdater;
