const { app, BrowserWindow, ipcMain } = require('electron');
const api = require('./src/constants/api'); // Rota de API
const path = require('path');

// Função para criar a janela principal do Electron
function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 600,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  console.log('Tentando carregar:', path.join(__dirname, 'src', 'escolhaInicial.html'));

  win.loadFile(path.join(__dirname, 'src', 'escolhaInicial.html'));
}

// Inicia o aplicativo Electron
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fecha o aplicativo, exceto no macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Rotas de IPC para lógica interna
ipcMain.on('signup-attempt', (event, { username, password }) => {
  const db = require('./src/constants/database');
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, password], function (err) {
    if (err) {
      event.reply('signup-response', { success: false, message: 'Usuário já existente.' });
    } else {
      event.reply('signup-response', { success: true });
    }
  });
});

ipcMain.on('login-attempt', (event, { username, password }) => {
  const db = require('./src/constants/database');
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (row) {
      event.reply('login-response', { success: true });
    } else {
      event.reply('login-response', { success: false, message: 'Credenciais inválidas.' });
    }
  });
});

// Inicializa o servidor Express
api.listen(3000, () => {
  console.log('Servidor Express rodando em http://localhost:3000');
});
