const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
    createWindow()
  })