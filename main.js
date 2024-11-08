const { app, BrowserWindow, ipcMain } = require('electron'); // Electron modules
const express = require('express'); // Express para API
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Inicia o servidor Express
const api = express();
api.use(express.json());

// Conectar ao banco de dados SQLite
const dbPath = path.join(__dirname, 'calendario.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

// Cria as tabelas se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      description TEXT,
    )
  `);
});

// Função para criar a janela do Electron
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

  win.loadFile('src/escolhaInicial.html');
}

// Inicia o app Electron
app.whenReady().then(() => {
  createWindow();

  // No macOS, recria a janela se não houver janelas abertas ao ativar o app
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

// Rota para criar um evento
api.post('/api/events', (req, res) => {
  const { title, start_date, end_date, description, location } = req.body;
  const query = `INSERT INTO events (title, start_date, end_date, description, location) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [title, start_date, end_date, description, location], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao criar evento' });
    }
    res.status(200).json({ success: true, id: this.lastID });
  });
});

// Rota para listar os eventos
api.get('/api/events', (req, res) => {
  const query = `SELECT * FROM events`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao buscar eventos' });
    }
    res.status(200).json({ success: true, events: rows });
  });
});

// Rota para atualizar um evento
api.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, start_date, end_date, description, location } = req.body;
  const query = `UPDATE events SET title = ?, start_date = ?, end_date = ?, description = ?, location = ? WHERE id = ?`;
  db.run(query, [title, start_date, end_date, description, location, id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao atualizar evento' });
    }
    res.status(200).json({ success: true });
  });
});

// Rota para excluir um evento
api.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM events WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao excluir evento' });
    }
    res.status(200).json({ success: true });
  });
});

// Inicia o servidor Express em uma porta específica (ex.: 3000)
api.listen(3000, () => {
  console.log('Servidor API rodando em http://localhost:3000');
});
