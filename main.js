const { app, BrowserWindow, ipcMain } = require('electron');
const api = require('./src/constants/api'); // Rota de API
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

// Lógica de Cadastro
ipcMain.on('signup-attempt', (event, { username, password }) => {
  console.log('Tentativa de cadastro recebida:', username);
  
  const query = `SELECT username FROM users WHERE username = ?`;
  db.get(query, [username], (err, row) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      event.reply('signup-response', { success: false, message: 'Erro interno no sistema.' });
      return;
    }

    if (row) {
      event.reply('signup-response', { success: false, message: 'Usuário já existente.' });
    } else {
      const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
      db.run(insertQuery, [username, password], function (err) {
        if (err) {
          console.error('Erro ao cadastrar usuário:', err);
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
  console.log('Tentativa de login recebida:', username);
  
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      event.reply('login-response', { success: false, message: 'Erro interno no sistema.' });
      return;
    }

    if (row) {
      console.log('Login bem-sucedido para:', username);
      event.reply('login-response', { success: true });
    } else {
      console.log('Login falhou para:', username);
      event.reply('login-response', { success: false, message: 'Usuário ou senha inválidos.' });
    }
  });
});

// Inicializa o servidor Express
api.listen(3000, () => {
  console.log('Servidor Express rodando em http://localhost:3000');
});
