// main.js
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    title: 'Quantum LOL'
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  // Запускаем server.js
  const serverProc = spawn(process.execPath, [path.join(__dirname, 'server.js')], { cwd: __dirname, stdio: ['ignore', 'pipe', 'pipe'] });
  serverProc.stdout.on('data', d => console.log(`[SERVER] ${d}`));
  serverProc.stderr.on('data', d => console.error(`[SERVER ERR] ${d}`));
  serverProc.on('error', err => dialog.showErrorBox('Server Error', err.message));

  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

process.on('uncaughtException', err => dialog.showErrorBox('Unexpected Error', err.stack || err.message));

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });