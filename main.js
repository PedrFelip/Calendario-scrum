// Arquivo de Inicialização do Electron

const { app, BrowserWindow } = require('electron');

function createWindow() {
  // cria uma janela
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      contextIsolation: true, // isolar o contexto
    },
  });

  // index.html
  win.loadFile('src/screens/Cadastro/telaDeCadastro.html');
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