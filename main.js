// Arquivo de Inicialização do Electron

const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      contextIsolation: true, // isolar o contexto
    },
  });

  // index.html
  win.loadFile('src/screens/Home/telaHome.html');
}

// Inicia o app
app.whenReady().then(() => {
  createWindow();

  // No macOS, cria nova janela ao reativar o app
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//fecha aplicação menos no mac
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('cadastro-attempt', (event, { username, password }) => {
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, password], function (err) {
    if (err) {
      event.reply('cadastro-response', { success: false, message: 'Usuário já existe' });
    } else {
      event.reply('cadastro-response', { success: true });
    }
  });
});


ipcMain.on('login-attempt', (event, { username, password }) => {
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (row) {
      event.reply('login-response', { success: true });
    } else {
      event.reply('login-response', { success: false, message: 'Usuário ou senha incorretos' });
    }
  });
});