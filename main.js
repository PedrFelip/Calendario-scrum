const { app, BrowserWindow, ipcMain } = require('electron');
const db = require('./src/constants/database'); // Conexão com o banco de dados
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

  win.loadFile(path.join(__dirname, 'src', './screens/Start/escolhaInicial.html'));
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

// Lógica de Cadastro
ipcMain.on('signup-attempt', (event, { username, email, birthdate, password }) => {
  const queryCheckUser = `SELECT username FROM users WHERE username = ? OR email = ?`;

  db.get(queryCheckUser, [username, email], (err, row) => {
    if (err) {
      event.reply('signup-response', { success: false, message: 'Erro interno no sistema.' });
      return;
    }

    if (row) {
      event.reply('signup-response', { success: false, message: 'Usuário ou email já existente.' });
    } else {
      const queryInsertUser = `INSERT INTO users (username, email, birthdate, password) VALUES (?, ?, ?, ?)`;
      db.run(queryInsertUser, [username, email, birthdate, password], function (err) {
        if (err) {
          event.reply('signup-response', { success: false, message: 'Erro ao cadastrar usuário.' });
        } else {
          event.reply('signup-response', { success: true });
        }
      });
    }
  });
});

// Lógica de Login
ipcMain.on('login-attempt', (event, { username, password }) => {
  const queryCheckUser = `SELECT id, username FROM users WHERE username = ? AND password = ?`;

  db.get(queryCheckUser, [username, password], (err, row) => {
    if (err) {
      event.reply('login-response', { success: false, message: 'Erro interno no sistema.' });
      return;
    }

    if (row) {
      event.reply('login-response', { success: true, user_id: row.id });
    } else {
      event.reply('login-response', { success: false, message: 'Usuário ou senha inválidos.' });
    }
  });
});

// CRUD de eventos via IPC

// Listar eventos
ipcMain.on('get-events', (event, userId) => {
  db.all('SELECT * FROM events WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      event.reply('get-events-response', { success: false, message: 'Erro ao buscar eventos.' });
    } else {
      event.reply('get-events-response', { success: true, events: rows });
    }
  });
});

// Criar evento
ipcMain.on('create-event', (event, eventData) => {
  const { user_id, title, start_date, end_date, color, description } = eventData;
  const query = `INSERT INTO events (user_id, title, start_date, end_date, color, description) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [user_id, title, start_date, end_date, color, description], function (err) {
    if (err) {
      event.reply('create-event-response', { success: false, message: 'Erro ao criar evento.' });
    } else {
      event.reply('create-event-response', { success: true, id: this.lastID });
    }
  });
});

// Editar evento
ipcMain.on('edit-event', (event, eventData) => {
  const { id, user_id, title, start_date, end_date, color, description } = eventData;
  const query = `UPDATE events SET title=?, start_date=?, end_date=?, color=?, description=? WHERE id=? AND user_id=?`;
  db.run(query, [title, start_date, end_date, color, description, id, user_id], function (err) {
    if (err) {
      event.reply('edit-event-response', { success: false, message: 'Erro ao editar evento.' });
    } else {
      event.reply('edit-event-response', { success: true });
    }
  });
});

// Excluir evento
ipcMain.on('delete-event', (event, { id, user_id }) => {
  db.run('DELETE FROM events WHERE id=? AND user_id=?', [id, user_id], function (err) {
    if (err) {
      event.reply('delete-event-response', { success: false, message: 'Erro ao excluir evento.' });
    } else {
      event.reply('delete-event-response', { success: true });
    }
  });
});
