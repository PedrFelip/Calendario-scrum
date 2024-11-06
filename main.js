const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar ao banco de dados SQLite
const dbPath = path.join(__dirname, 'calendario.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

// Criar a tabela de usuários se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 560,
    minWidth: 960, // Largura mínima
    minHeight: 540, // Altura mínima
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  win.loadFile('src/escolhaInicial.html');
}

// Inicia o app
app.whenReady().then(() => {
  createWindow();

  // No macOS, cria nova janela ao reativar o app
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fecha a aplicação, exceto no macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Lógica de cadastro
ipcMain.on('signup-attempt', (event, { username, password }) => {
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, password], function (err) {
    if (err) {
      event.reply('signup-response', { success: false, message: 'Erro ao cadastrar. Usuário já existente.' });
    } else {
      event.reply('signup-response', { success: true });
    }
  });
});

// Lógica de login
ipcMain.on('login-attempt', (event, { username, password }) => {
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (row) {
      event.reply('login-response', { success: true });
    } else {
      event.reply('login-response', { success: false, message: 'Usuário ou senha incorretos.' });
    }
  });
});
