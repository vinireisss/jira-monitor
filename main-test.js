const { app, BrowserWindow } = require('electron');

console.log('✅ Electron carregado com sucesso!');
console.log('✅ app:', typeof app);
console.log('✅ BrowserWindow:', typeof BrowserWindow);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  });
  
  win.loadURL('https://www.google.com');
}

app.whenReady().then(() => {
  console.log('✅ App pronto!');
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});






